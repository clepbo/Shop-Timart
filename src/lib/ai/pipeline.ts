import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { bodiesFor } from "../bodies";
import { getProductById, storeFile, updateProduct } from "../store";
import { siteUrl } from "../site";
import type { FitRender } from "../types";
import { getTryOnProvider } from "./tryon";

const PUBLIC = path.join(process.cwd(), "public");

/**
 * Turns a stored image reference into something the AI provider can fetch.
 * Absolute URLs (Vercel Blob) pass straight through; local files become data URIs
 * (localhost isn't reachable from the provider), falling back to the site URL.
 */
async function providerImage(ref: string) {
  if (/^https?:\/\//.test(ref)) return ref;
  try {
    const buf = await fs.readFile(path.join(PUBLIC, ref));
    const ext = path.extname(ref).slice(1).toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return `${siteUrl()}${ref}`;
  }
}

async function available(ref: string) {
  try {
    await fs.access(path.join(PUBLIC, ref));
    return true;
  } catch {
    try {
      const res = await fetch(`${siteUrl()}${ref}`, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  }
}

/** Provider URLs expire, so results are copied into our own storage. */
async function persist(url: string, name: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download render (${res.status})`);
  const type = res.headers.get("content-type") ?? "image/jpeg";
  const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
  return storeFile(Buffer.from(await res.arrayBuffer()), `${name}.${ext}`, type, "renders");
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

  await updateProduct(productId, { renderStatus: "pending", renderError: null });
  try {
    const garmentImage = await providerImage(product.image);
    const renders: Record<string, FitRender> = { ...(product.renders ?? {}) };
    let made = 0;
    for (const body of bodiesFor(product.gender)) {
      if (!body.modelPhoto || !(await available(body.modelPhoto))) continue;
      const out = await provider.render({
        garmentImage,
        modelImage: await providerImage(body.modelPhoto),
        garmentType: product.garmentType,
        description: `${product.name}. ${product.description}`,
      });
      const key = `${product.id}-${body.id}`;
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
      renderError: made > 0 ? null : "No model photos found in /public/models — using illustrations.",
    });
  } catch (err) {
    await updateProduct(productId, {
      renderStatus: "failed",
      renderError: err instanceof Error ? err.message : String(err),
    });
  }
}
