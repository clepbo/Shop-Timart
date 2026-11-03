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

export type OrderResult = { ok: boolean; message: string; link?: string; redirect?: string } | null;

export async function placeOrder(payload: OrderPayload): Promise<OrderResult> {
  const { getProducts } = await import("@/lib/store");
  const { brand, formatPrice, whatsappLink } = await import("@/lib/brand");
  const { deliveryOptions } = await import("@/lib/delivery");
  const { paystackEnabled, initializePayment } = await import("@/lib/paystack");
  const { siteUrl } = await import("@/lib/site");
  const c = payload.customer;
  if (!c.name || !c.phone || !c.address || !payload.items.length) return { ok: false, message: "Please complete your delivery details." };
  if (paystackEnabled() && !/^\S+@\S+\.\S+$/.test(c.email)) return { ok: false, message: "Please enter a valid email for your payment receipt." };

  // Prices are always recomputed on the server — never trust the client.
  const catalog = await getProducts();
  const lines = [];
  for (const i of payload.items) {
    const p = catalog.find((x) => x.id === i.productId);
    if (!p) return { ok: false, message: `${i.name} is no longer available — please remove it from your bag.` };
    const quantity = Math.max(1, Math.min(20, Math.floor(i.quantity)));
    lines.push({ productId: p.id, name: p.name, colour: i.colour, size: i.size, quantity, unitPrice: p.price, total: p.price * quantity });
  }
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const opt = deliveryOptions.find((d) => d.id === payload.delivery) ?? deliveryOptions[0];
  const deliveryFee = opt.fee(subtotal);
  const total = subtotal + deliveryFee;
  const method = paystackEnabled() ? "paystack" : "whatsapp";
  const order = await appendRecord("orders", { customer: c, delivery: opt.id, lines, subtotal, deliveryFee, total, status: "awaiting_payment", method });

  if (method === "paystack") {
    try {
      const tx = await initializePayment({
        email: c.email,
        amountNaira: total,
        reference: order.id,
        callbackUrl: `${siteUrl()}/checkout/confirm`,
        metadata: { customer: c.name, phone: c.phone, items: lines.length },
      });
      return { ok: true, message: "Redirecting to secure payment…", redirect: tx.authorization_url };
    } catch (e) {
      return { ok: false, message: `We couldn't start the payment (${e instanceof Error ? e.message : "error"}). Please try again.` };
    }
  }

  const msg =
    `Hello ${brand.name}! New order ${order.id}\n` +
    lines.map((l) => `• ${l.name} — ${l.colour}, ${l.size} × ${l.quantity} (${formatPrice(l.total)})`).join("\n") +
    `\nDelivery: ${opt.label} (${formatPrice(deliveryFee)})\nTotal: ${formatPrice(total)}\n\n${c.name} · ${c.phone}\n${c.address}, ${c.city}, ${c.state}`;
  return { ok: true, message: `Order ${order.id} received — total ${formatPrice(total)}.`, link: whatsappLink(msg) };
}

