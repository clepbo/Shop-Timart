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
