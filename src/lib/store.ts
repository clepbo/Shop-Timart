import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import type { Product } from "./types";
import seed from "../../data/products.json";

/**
 * Data access for the whole app.
 *
 * - With DATABASE_URL set (Neon on Vercel), everything lives in Postgres. Tables are created
 *   and the seed catalogue inserted automatically on first use.
 * - Without it (local dev), a JSON-file store under /data is used so the project runs with zero setup.
 *
 * Uploads go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise to /public/uploads.
 */

export type Collection = "orders" | "bookings" | "subscribers";

// ---------------------------------------------------------------- Postgres

let _sql: NeonQueryFunction<false, false> | null = null;
let _ready: Promise<void> | null = null;

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  _sql ??= neon(url);
  return _sql;
}

async function db() {
  const q = sql();
  if (!q) return null;
  _ready ??= (async () => {
    await q.query(`create table if not exists products (
      id text primary key,
      slug text unique not null,
      data jsonb not null,
      created_at timestamptz not null default now()
    )`);
    await q.query(`create table if not exists records (
      id text primary key,
      collection text not null,
      data jsonb not null,
      created_at timestamptz not null default now()
    )`);
    await q.query(`create index if not exists records_collection_idx on records (collection, created_at desc)`);
    const [{ count }] = (await q.query(`select count(*)::int as count from products`)) as { count: number }[];
    if (count === 0) {
      for (const p of seed as Product[]) {
        await q.query(`insert into products (id, slug, data, created_at) values ($1, $2, $3, $4) on conflict do nothing`, [p.id, p.slug, JSON.stringify(p), p.createdAt]);
      }
    }
  })().catch((e) => {
    _ready = null;
    throw e;
  });
  await _ready;
  return q;
}

// ---------------------------------------------------------------- JSON files (local dev)

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS = path.join(DATA_DIR, "products.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file);
}

// ---------------------------------------------------------------- Products

export async function getProducts(): Promise<Product[]> {
  const q = await db();
  const items = q ? ((await q.query(`select data from products`)) as { data: Product }[]).map((r) => r.data) : await readJson<Product[]>(PRODUCTS, []);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(slug: string) {
  const q = await db();
  if (q) {
    const rows = (await q.query(`select data from products where slug = $1`, [slug])) as { data: Product }[];
    return rows[0]?.data ?? null;
  }
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  const q = await db();
  if (q) {
    const rows = (await q.query(`select data from products where id = $1`, [id])) as { data: Product }[];
    return rows[0]?.data ?? null;
  }
  return (await getProducts()).find((p) => p.id === id) ?? null;
}

export async function saveProduct(product: Product) {
  const q = await db();
  if (q) {
    await q.query(
      `insert into products (id, slug, data, created_at) values ($1, $2, $3, $4)
       on conflict (id) do update set slug = excluded.slug, data = excluded.data`,
      [product.id, product.slug, JSON.stringify(product), product.createdAt],
    );
    return product;
  }
  const items = await readJson<Product[]>(PRODUCTS, []);
  const i = items.findIndex((p) => p.id === product.id);
  if (i >= 0) items[i] = product;
  else items.push(product);
  await writeJson(PRODUCTS, items);
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  const q = await db();
  if (q) {
    // jsonb merge is atomic, so concurrent render updates don't clobber each other's fields
    const rows = (await q.query(`update products set data = data || $2::jsonb where id = $1 returning data`, [id, JSON.stringify(patch)])) as { data: Product }[];
    return rows[0]?.data ?? null;
  }
  const items = await readJson<Product[]>(PRODUCTS, []);
  const i = items.findIndex((p) => p.id === id);
  if (i < 0) return null;
  items[i] = { ...items[i], ...patch };
  await writeJson(PRODUCTS, items);
  return items[i];
}

export async function deleteProduct(id: string) {
  const q = await db();
  if (q) {
    await q.query(`delete from products where id = $1`, [id]);
    return;
  }
  const items = await readJson<Product[]>(PRODUCTS, []);
  await writeJson(PRODUCTS, items.filter((p) => p.id !== id));
}

// ---------------------------------------------------------------- Records (orders, bookings, subscribers)

type Rec = { id: string; createdAt: string } & Record<string, unknown>;

export async function appendRecord(collection: Collection, record: object): Promise<Rec> {
  const entry: Rec = { id: `${collection.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), ...record };
  const q = await db();
  if (q) {
    await q.query(`insert into records (id, collection, data, created_at) values ($1, $2, $3, $4)`, [entry.id, collection, JSON.stringify(entry), entry.createdAt]);
    return entry;
  }
  const file = path.join(DATA_DIR, `${collection}.json`);
  const items = await readJson<Rec[]>(file, []);
  items.push(entry);
  await writeJson(file, items);
  return entry;
}

export async function listRecords<T = Rec>(collection: Collection): Promise<T[]> {
  const q = await db();
  if (q) return ((await q.query(`select data from records where collection = $1 order by created_at desc`, [collection])) as { data: T }[]).map((r) => r.data);
  return (await readJson<T[]>(path.join(DATA_DIR, `${collection}.json`), [])).reverse();
}

export async function getRecord<T = Rec>(collection: Collection, id: string): Promise<T | null> {
  const q = await db();
  if (q) {
    const rows = (await q.query(`select data from records where collection = $1 and id = $2`, [collection, id])) as { data: T }[];
    return rows[0]?.data ?? null;
  }
  const items = await readJson<Rec[]>(path.join(DATA_DIR, `${collection}.json`), []);
  return (items.find((r) => r.id === id) as T) ?? null;
}

export async function updateRecord(collection: Collection, id: string, patch: object) {
  const q = await db();
  if (q) {
    await q.query(`update records set data = data || $3::jsonb where collection = $1 and id = $2`, [collection, id, JSON.stringify(patch)]);
    return;
  }
  const file = path.join(DATA_DIR, `${collection}.json`);
  const items = await readJson<Rec[]>(file, []);
  const i = items.findIndex((r) => r.id === id);
  if (i >= 0) {
    items[i] = { ...items[i], ...patch };
    await writeJson(file, items);
  }
}

// ---------------------------------------------------------------- Files

const blobEnabled = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** Stores a file and returns its public URL (absolute for Blob, site-relative locally). */
export async function storeFile(data: Buffer | Blob, name: string, contentType: string, folder = "uploads") {
  const safe = name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  if (blobEnabled()) {
    const res = await put(`${folder}/${safe}`, data, { access: "public", addRandomSuffix: true, contentType });
    return res.url;
  }
  const dir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(dir, { recursive: true });
  const file = `${Date.now().toString(36)}-${safe}`;
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(await data.arrayBuffer());
  await fs.writeFile(path.join(dir, file), buf);
  return `/${folder}/${file}`;
}

export async function saveUpload(file: File, folder = "uploads") {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  return storeFile(file, `${Math.random().toString(36).slice(2, 8)}.${ext}`, file.type || "image/jpeg", folder);
}

export function storageMode() {
  return { database: sql() ? "neon" : "files", files: blobEnabled() ? "blob" : "local" } as const;
}
