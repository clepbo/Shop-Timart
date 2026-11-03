import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { bodiesFor } from "../bodies";
import { getProductById, updateProduct } from "../store";
import type { FitRender } from "../types";
import { getTryOnProvider } from "./tryon";

const PUBLIC = path.join(process.cwd(), "public");

async function toDataUri(publicPath: string) {
  const file = path.join(PUBLIC, publicPath);
  const buf = await fs.readFile(file);
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function exists(publicPath: string) {
  try {
    await fs.access(path.join(PUBLIC, publicPath));
    return true;
  } catch {
    return false;
  }
}

/** Provider URLs expire, so results are copied into /public/renders. */
async function persist(url: string, name: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download render (${res.status})`);
  const dir = path.join(PUBLIC, "renders");
  await fs.mkdir(dir, { recursive: true });
  const ext = (res.headers.get("content-type") ?? "").includes("png") ? "png" : "jpg";
  const file = `${name}.${ext}`;
  await fs.writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
  return `/renders/${file}`;
}

/**
 * Generates a try-on photo of the product for every body profile of its gender.
 * Runs in the background after the owner saves a product (see admin actions).
 * Without an AI provider configured, products fall back to the illustrated Fit Studio.
 */
export async function generateFitRenders(productId: string) {
  const product = await getProductById(productId);
  if (!product) return;
  const provider = getTryOnProvider();
  if (!provider || !product.image) {
    await updateProduct(productId, { renderStatus: "illustration" });
    return;
  }

  await updateProduct(productId, { renderStatus: "pending", renderError: undefined });
  try {
    const garmentImage = await toDataUri(product.image);
    const renders: Record<string, FitRender> = { ...(product.renders ?? {}) };
    let made = 0;
    for (const body of bodiesFor(product.gender)) {
      if (!body.modelPhoto || !(await exists(body.modelPhoto))) continue;
      const out = await provider.render({
        garmentImage,
        modelImage: await toDataUri(body.modelPhoto),
        garmentType: product.garmentType,
        description: `${product.name}. ${product.description}`,
      });
      const key = `${product.id}-${body.id}-${Date.now().toString(36)}`;
      renders[body.id] = {
        image: await persist(out.image, key),
        mask: out.mask ? await persist(out.mask, `${key}-mask`) : undefined,
        colour: product.colors[0]?.name,
      };
      made++;
      await updateProduct(productId, { renders });
    }
    await updateProduct(productId, {
      renders,
      renderStatus: made > 0 ? "ready" : "illustration",
      renderError: made > 0 ? undefined : "No model photos found in /public/models — using illustrations.",
    });
  } catch (err) {
    await updateProduct(productId, {
      renderStatus: "failed",
      renderError: err instanceof Error ? err.message : String(err),
    });
  }
}
