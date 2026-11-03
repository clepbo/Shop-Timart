import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { getRecord, updateRecord } from "./store";

const API = "https://api.paystack.co";

export function paystackEnabled() {
  return !!process.env.PAYSTACK_SECRET_KEY;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(json.message ?? `Paystack error ${res.status}`);
  return json.data as T;
}

/** Starts a Paystack checkout. Amount is in naira; Paystack expects kobo. */
export async function initializePayment(opts: { email: string; amountNaira: number; reference: string; callbackUrl: string; metadata?: Record<string, unknown> }) {
  return call<{ authorization_url: string; access_code: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: opts.email,
      amount: Math.round(opts.amountNaira * 100),
      currency: "NGN",
      reference: opts.reference,
      callback_url: opts.callbackUrl,
      metadata: opts.metadata,
    }),
  });
}

type Verified = { status: string; amount: number; currency: string; reference: string; paid_at?: string; channel?: string };

export async function verifyPayment(reference: string) {
  return call<Verified>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

export function validWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) return false;
  const expected = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

type Order = { id: string; total: number; status: string };

/**
 * Re-verifies a transaction with Paystack and marks the order paid only if the amount
 * matches what we charged. Safe to call from both the redirect and the webhook.
 */
export async function confirmOrderPayment(reference: string) {
  const order = await getRecord<Order>("orders", reference);
  if (!order) return { ok: false as const, reason: "Order not found" };
  if (order.status === "paid") return { ok: true as const, order };
  const tx = await verifyPayment(reference);
  if (tx.status === "success" && tx.currency === "NGN" && tx.amount === Math.round(order.total * 100)) {
    await updateRecord("orders", reference, { status: "paid", paidAt: tx.paid_at ?? new Date().toISOString(), paymentChannel: tx.channel });
    return { ok: true as const, order: { ...order, status: "paid" } };
  }
  if (tx.status === "failed" || tx.status === "abandoned") await updateRecord("orders", reference, { status: "payment_failed" });
  return { ok: false as const, reason: tx.status === "success" ? "Amount mismatch — please contact us." : `Payment ${tx.status}` };
}
