"use server";

import { appendRecord } from "@/lib/store";

export type FormState = { ok: boolean; message: string; link?: string } | null;

export async function subscribe(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Please enter a valid email." };
  await appendRecord("subscribers", { email });
  return { ok: true, message: "Welcome to the Grace List ✦" };
}

export async function bookStyling(_: FormState, form: FormData): Promise<FormState> {
  const data = Object.fromEntries(["name", "phone", "email", "service", "occasion", "date", "mode", "budget", "notes"].map((k) => [k, String(form.get(k) ?? "").trim()]));
  if (!data.name || !data.phone || !data.service) return { ok: false, message: "Please add your name, phone number and the service you need." };
  const rec = await appendRecord("bookings", data);
  const { brand, whatsappLink } = await import("@/lib/brand");
  const msg = `Hello ${brand.name}! I just booked a styling session (ref ${rec.id}).\nService: ${data.service}\nOccasion: ${data.occasion || "-"}\nDate: ${data.date || "flexible"}\nMode: ${data.mode || "-"}\nName: ${data.name}`;
  return { ok: true, message: "Thank you — your request is in. A stylist will reach out within 24 hours.", link: whatsappLink(msg) };
}

export interface OrderPayload {
  customer: { name: string; phone: string; email: string; address: string; city: string; state: string; notes?: string };
  delivery: string;
  items: { productId: string; name: string; colour: string; size: string; quantity: number }[];
}

export async function placeOrder(payload: OrderPayload): Promise<FormState> {
  const { getProducts } = await import("@/lib/store");
  const { brand, formatPrice, whatsappLink } = await import("@/lib/brand");
  const { deliveryOptions } = await import("@/lib/delivery");
  const c = payload.customer;
  if (!c.name || !c.phone || !c.address || !payload.items.length) return { ok: false, message: "Please complete your delivery details." };

  // Prices are always recomputed on the server — never trust the client.
  const catalog = await getProducts();
  const lines = payload.items.map((i) => {
    const p = catalog.find((x) => x.id === i.productId);
    if (!p) throw new Error("A product in your bag is no longer available.");
    return { ...i, unitPrice: p.price, total: p.price * i.quantity };
  });
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const opt = deliveryOptions.find((d) => d.id === payload.delivery) ?? deliveryOptions[0];
  const deliveryFee = opt.fee(subtotal);
  const total = subtotal + deliveryFee;
  const order = await appendRecord("orders", { customer: c, delivery: opt.id, lines, subtotal, deliveryFee, total, status: "awaiting_payment" });

  const msg =
    `Hello ${brand.name}! New order ${order.id}\n` +
    lines.map((l) => `• ${l.name} — ${l.colour}, ${l.size} × ${l.quantity} (${formatPrice(l.total)})`).join("\n") +
    `\nDelivery: ${opt.label} (${formatPrice(deliveryFee)})\nTotal: ${formatPrice(total)}\n\n${c.name} · ${c.phone}\n${c.address}, ${c.city}, ${c.state}`;
  return { ok: true, message: `Order ${order.id} received — total ${formatPrice(total)}.`, link: whatsappLink(msg) };
}
