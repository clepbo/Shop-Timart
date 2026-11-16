"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/auth";
import { deleteProduct, getProductById, saveProduct, saveUpload } from "@/lib/store";
import { generateFitRenders } from "@/lib/ai/pipeline";
import { garmentTypes, womenSizes, menSizes } from "@/lib/catalog";
import type { Colorway, GarmentType, Product } from "@/lib/types";

export type AdminState = { ok: boolean; message: string } | null;

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function login(_: AdminState, form: FormData): Promise<AdminState> {
  if (!checkPassword(String(form.get("password") ?? ""))) return { ok: false, message: "Incorrect password." };
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function saveProductAction(_: AdminState, form: FormData): Promise<AdminState> {
  await guard();
  const id = String(form.get("id") ?? "") || `p${Date.now().toString(36)}`;
  const existing = await getProductById(id);
  const name = String(form.get("name") ?? "").trim();
  const garmentType = String(form.get("garmentType")) as GarmentType;
  const gt = garmentTypes.find((g) => g.value === garmentType);
  const price = Number(form.get("price"));
  if (!name || !gt || !price) return { ok: false, message: "Name, garment type and price are required." };

  let colors: Colorway[] = [];
  try {
    colors = JSON.parse(String(form.get("colors") ?? "[]"));
  } catch {}
  colors = colors.filter((c) => c.name && /^#[0-9a-f]{6}$/i.test(c.hex));
  if (!colors.length) return { ok: false, message: "Add at least one colour." };

  const file = form.get("image");
  let image = existing?.image;
  let imageChanged = false;
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { ok: false, message: "Please upload an image file." };
    image = await saveUpload(file);
    imageChanged = true;
  }

  const sizes = form.getAll("sizes").map(String);
  const product: Product = {
    ...(existing ?? {}),
    id,
    slug: existing?.slug ?? `${slugify(name)}-${id.slice(-4)}`,
    name,
    gender: gt.gender,
    category: String(form.get("category") ?? "dresses"),
    occasions: form.getAll("occasions").map(String),
    price,
    compareAtPrice: Number(form.get("compareAtPrice")) || undefined,
    description: String(form.get("description") ?? "").trim(),
    details: String(form.get("details") ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
    care: String(form.get("care") ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
    careGuide: String(form.get("careGuide") ?? "") || undefined,
    garmentType,
    colors,
    sizes: sizes.length ? sizes : gt.gender === "women" ? womenSizes : menSizes,
    image,
    renderStatus: existing?.renderStatus ?? "illustration",
    isNew: form.get("isNew") === "on",
    featured: form.get("featured") === "on",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  if (imageChanged) {
    product.renders = {};
    product.renderStatus = "pending";
  }
  await saveProduct(product);

  // Generate the per-body try-on photos in the background — the owner never waits.
  if (imageChanged) after(() => generateFitRenders(product.id));

  revalidatePath("/", "layout");
  redirect(`/admin?saved=${product.id}`);
}

export async function regenerateAction(form: FormData) {
  await guard();
  const id = String(form.get("id"));
  after(() => generateFitRenders(id));
  revalidatePath("/admin");
}

export async function deleteProductAction(form: FormData) {
  await guard();
  await deleteProduct(String(form.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function setOrderStatus(form: FormData) {
  await guard();
  const status = String(form.get("status"));
  if (!["awaiting_payment", "paid", "shipped", "delivered", "cancelled"].includes(status)) return;
  const { updateRecord } = await import("@/lib/store");
  await updateRecord("orders", String(form.get("id")), { status });
  revalidatePath("/admin/orders");
}

export async function saveCouponAction(_: AdminState, form: FormData): Promise<AdminState> {
  await guard();
  const { saveCoupon, normaliseCode } = await import("@/lib/coupons");
  const code = normaliseCode(String(form.get("code") ?? ""));
  const kind = form.get("kind") === "fixed" ? "fixed" : "percent";
  const value = Number(form.get("value"));
  if (!code || code.length < 3) return { ok: false, message: "Use a code of at least 3 letters or numbers." };
  if (!value || value <= 0 || (kind === "percent" && value > 90)) return { ok: false, message: kind === "percent" ? "Percent must be between 1 and 90." : "Enter an amount in naira." };
  const num = (k: string) => (Number(form.get(k)) > 0 ? Number(form.get(k)) : undefined);
  const expires = String(form.get("expiresAt") ?? "");
  await saveCoupon({
    code,
    kind,
    value,
    active: form.get("active") === "on",
    description: String(form.get("description") ?? "").trim() || undefined,
    minSubtotal: num("minSubtotal"),
    maxUses: num("maxUses"),
    oncePerCustomer: form.get("oncePerCustomer") === "on",
    expiresAt: expires ? new Date(`${expires}T23:59:59+01:00`).toISOString() : undefined,
  });
  revalidatePath("/admin/coupons");
  return { ok: true, message: `Saved ${code}.` };
}

export async function toggleCouponAction(form: FormData) {
  await guard();
  const { listCoupons, saveCoupon } = await import("@/lib/coupons");
  const code = String(form.get("code"));
  const c = (await listCoupons()).find((x) => x.code === code);
  if (c) await saveCoupon({ ...c, active: !c.active });
  revalidatePath("/admin/coupons");
}

export async function deleteCouponAction(form: FormData) {
  await guard();
  const { removeCoupon, QR_COUPON } = await import("@/lib/coupons");
  const code = String(form.get("code"));
  if (code !== QR_COUPON) await removeCoupon(code);
  revalidatePath("/admin/coupons");
}

export async function saveContentAction(_: AdminState, form: FormData): Promise<AdminState> {
  await guard();
  const { contentSchema } = await import("@/lib/content-schema");
  const { saveSection, getContent } = await import("@/lib/content");
  const section = String(form.get("__section"));
  const def = (contentSchema as Record<string, { fields: Record<string, { type: string; default: string }> }>)[section];
  if (!def) return { ok: false, message: "Unknown section." };
  const current = (await getContent()) as unknown as Record<string, Record<string, string>>;
  const values: Record<string, string> = {};
  for (const [f, fd] of Object.entries(def.fields)) {
    if (form.get(`${f}__reset`) === "on") {
      values[f] = fd.default;
      continue;
    }
    if (fd.type === "image") {
      const file = form.get(f);
      if (file instanceof File && file.size > 0) {
        if (!file.type.startsWith("image/")) return { ok: false, message: "Please upload an image file." };
        values[f] = await saveUpload(file, "content");
      } else {
        values[f] = current[section]?.[f] ?? fd.default;
      }
    } else {
      values[f] = String(form.get(f) ?? "").replace(/\r\n/g, "\n").trim();
    }
  }
  await saveSection(section, values);
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved — the live site is updated." };
}
