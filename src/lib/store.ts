import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "./types";

/**
 * File-backed store so the project runs with zero setup.
 * For production, swap these functions for a database (e.g. Supabase/Postgres) —
 * the rest of the app only talks to this module.
 */
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

export async function getProducts(): Promise<Product[]> {
  const items = await readJson<Product[]>(PRODUCTS, []);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  return (await getProducts()).find((p) => p.id === id) ?? null;
}

export async function saveProduct(product: Product) {
  const items = await readJson<Product[]>(PRODUCTS, []);
  const i = items.findIndex((p) => p.id === product.id);
  if (i >= 0) items[i] = product;
  else items.push(product);
  await writeJson(PRODUCTS, items);
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  const items = await readJson<Product[]>(PRODUCTS, []);
  const i = items.findIndex((p) => p.id === id);
  if (i < 0) return null;
  items[i] = { ...items[i], ...patch };
  await writeJson(PRODUCTS, items);
  return items[i];
}

export async function deleteProduct(id: string) {
  const items = await readJson<Product[]>(PRODUCTS, []);
  await writeJson(PRODUCTS, items.filter((p) => p.id !== id));
}

/** Append-only records (orders, styling bookings, newsletter sign-ups). */
export async function appendRecord(collection: "orders" | "bookings" | "subscribers", record: object) {
  const file = path.join(DATA_DIR, `${collection}.json`);
  const items = await readJson<object[]>(file, []);
  const entry = { id: `${collection.slice(0, 3)}_${Date.now().toString(36)}`, createdAt: new Date().toISOString(), ...record };
  items.push(entry);
  await writeJson(file, items);
  return entry;
}

export async function listRecords<T = Record<string, unknown>>(collection: "orders" | "bookings" | "subscribers") {
  return readJson<T[]>(path.join(DATA_DIR, `${collection}.json`), []);
}

export async function saveUpload(file: File, folder = "uploads") {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/${folder}/${name}`;
}
