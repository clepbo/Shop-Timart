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
    compareAtPrice: undefined,
    sale:
      form.get("saleOn") === "on" && Number(form.get("saleValue")) > 0
        ? {
            kind: form.get("saleKind") === "fixed" ? "fixed" : "percent",
            value: Math.min(form.get("saleKind") === "fixed" ? 1e9 : 90, Number(form.get("saleValue"))),
            endsAt: form.get("saleEndsAt") ? new Date(`${form.get("saleEndsAt")}T23:59:59+01:00`).toISOString() : undefined,
          }
        : undefined,
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
  redirect("/admin?deleted=1");
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


export async function saveSaleAction(_: AdminState, form: FormData): Promise<AdminState> {
  await guard();
  const { saveSale } = await import("@/lib/sales");
  const name = String(form.get("name") ?? "").trim();
  const scope = String(form.get("scope")) as "all" | "category" | "collection" | "products";
  const kind = form.get("kind") === "fixed" ? "fixed" : "percent";
  const value = Number(form.get("value"));
  const targets = scope === "all" ? [] : form.getAll(`targets_${scope}`).map(String);
  if (!name) return { ok: false, message: "Give the sale a name, e.g. Easter sale." };
  if (!["all", "category", "collection", "products"].includes(scope)) return { ok: false, message: "Choose what the sale applies to." };
  if (scope !== "all" && targets.length === 0) return { ok: false, message: "Pick at least one item for the sale to apply to." };
  if (!value || value <= 0 || (kind === "percent" && value > 90)) return { ok: false, message: kind === "percent" ? "Percent must be between 1 and 90." : "Enter an amount in naira." };
  const day = (k: string, end: boolean) => {
    const v = String(form.get(k) ?? "");
    return v ? new Date(`${v}T${end ? "23:59:59" : "00:00:00"}+01:00`).toISOString() : undefined;
  };
  const startsAt = day("startsAt", false);
  const endsAt = day("endsAt", true);
  if (startsAt && endsAt && endsAt < startsAt) return { ok: false, message: "The end date is before the start date." };
  const id = String(form.get("id") ?? "") || `sale-${Date.now().toString(36)}`;
  await saveSale({ id, name, scope, targets, kind, value, startsAt, endsAt, active: form.get("active") === "on" });
  revalidatePath("/", "layout");
  redirect(`/admin/sales?saved=${encodeURIComponent(name)}`);
}

export async function toggleSaleAction(form: FormData) {
  await guard();
  const { getSale, saveSale } = await import("@/lib/sales");
  const s = await getSale(String(form.get("id")));
  if (s) await saveSale({ ...s, active: !s.active });
  revalidatePath("/", "layout");
}

export async function deleteSaleAction(form: FormData) {
  await guard();
  const { removeSale } = await import("@/lib/sales");
  await removeSale(String(form.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/sales");
}

// ---------------------------------------------------------------- site content (mini CMS)

function cleanValues(section: string, values: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values ?? {})) if (typeof v === "string") out[k] = v.replace(/\r\n/g, "\n");
  return out;
}

/** Saves what the owner is typing as a draft, so the preview can show it. Not visible to shoppers. */
export async function saveDraftAction(section: string, values: Record<string, string>) {
  await guard();
  const { saveDraftSection } = await import("@/lib/content");
  await saveDraftSection(section, cleanValues(section, values));
  return { ok: true };
}

export async function publishContentAction(section: string, values: Record<string, string>): Promise<AdminState> {
  await guard();
  const { saveSection, clearDraftSection } = await import("@/lib/content");
  const v = cleanValues(section, values);
  for (const k of Object.keys(v)) v[k] = v[k].trim();
  await saveSection(section, v);
  await clearDraftSection(section);
  revalidatePath("/", "layout");
  return { ok: true, message: "Published — this section is live on the website." };
}

export async function discardDraftAction(section: string) {
  await guard();
  const { clearDraftSection } = await import("@/lib/content");
  await clearDraftSection(section);
  return { ok: true };
}

export async function uploadContentImageAction(form: FormData): Promise<{ ok: boolean; url?: string; message?: string }> {
  await guard();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return { ok: false, message: "Choose an image." };
  if (!file.type.startsWith("image/")) return { ok: false, message: "Please upload an image file." };
  if (file.size > 10 * 1024 * 1024) return { ok: false, message: "Images must be under 10 MB." };
  return { ok: true, url: await saveUpload(file, "content") };
}
