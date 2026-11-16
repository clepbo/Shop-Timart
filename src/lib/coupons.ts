import "server-only";
import { deleteRecord, getRecord, listRecords, putRecord } from "./store";

export interface Coupon {
  id: string; // the code, upper-case
  code: string;
  kind: "percent" | "fixed";
  value: number; // percent (1–90) or naira
  active: boolean;
  description?: string;
  minSubtotal?: number;
  maxUses?: number;
  oncePerCustomer?: boolean;
  expiresAt?: string;
  uses: number;
  createdAt: string;
}

/** The code printed on the store's QR code. Created automatically the first time it's needed. */
export const QR_COUPON = "SCAN5";

export const normaliseCode = (code: string) => code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
const normalisePhone = (p: string) => p.replace(/\D/g, "").replace(/^234/, "0");

export async function ensureQrCoupon() {
  const existing = await getRecord<Coupon>("coupons", QR_COUPON);
  if (existing) return existing;
  return (await putRecord("coupons", QR_COUPON, {
    code: QR_COUPON,
    kind: "percent",
    value: 5,
    active: true,
    description: "QR code — 5% off any order",
    oncePerCustomer: true,
    uses: 0,
  })) as unknown as Coupon;
}

export async function listCoupons() {
  await ensureQrCoupon();
  return listRecords<Coupon>("coupons");
}

export async function saveCoupon(c: Omit<Coupon, "id" | "createdAt" | "uses"> & { uses?: number }) {
  const code = normaliseCode(c.code);
  const existing = await getRecord<Coupon>("coupons", code);
  return putRecord("coupons", code, { ...c, code, uses: c.uses ?? existing?.uses ?? 0 });
}

export async function removeCoupon(code: string) {
  await deleteRecord("coupons", normaliseCode(code));
}

export type CouponCheck = { ok: true; coupon: Coupon; discount: number; label: string } | { ok: false; message: string };

/** Validates a code against a subtotal (in naira). Pass the customer's phone to enforce once-per-customer. */
export async function checkCoupon(rawCode: string, subtotal: number, phone?: string): Promise<CouponCheck> {
  const code = normaliseCode(rawCode);
  if (!code) return { ok: false, message: "Enter a code." };
  if (code === QR_COUPON) await ensureQrCoupon();
  const c = await getRecord<Coupon>("coupons", code);
  if (!c || !c.active) return { ok: false, message: "That code isn't valid." };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { ok: false, message: "That code has expired." };
  if (c.maxUses && c.uses >= c.maxUses) return { ok: false, message: "That code has been fully used." };
  if (c.minSubtotal && subtotal < c.minSubtotal) return { ok: false, message: `This code needs a minimum order of ₦${c.minSubtotal.toLocaleString("en-NG")}.` };
  if (phone && c.oncePerCustomer) {
    const orders = await listRecords<{ couponCode?: string; status?: string; customer?: { phone?: string } }>("orders");
    const mine = normalisePhone(phone);
    const used = orders.some((o) => o.couponCode === code && o.status !== "payment_failed" && o.status !== "cancelled" && normalisePhone(o.customer?.phone ?? "") === mine);
    if (used) return { ok: false, message: "You've already used this code." };
  }
  const discount = c.kind === "percent" ? Math.round((subtotal * Math.min(90, Math.max(0, c.value))) / 100) : Math.min(subtotal, Math.max(0, c.value));
  const label = c.kind === "percent" ? `${c.value}% off` : `₦${c.value.toLocaleString("en-NG")} off`;
  return { ok: true, coupon: c, discount, label };
}

export async function recordCouponUse(code: string) {
  const c = await getRecord<Coupon>("coupons", normaliseCode(code));
  if (c) await putRecord("coupons", c.code, { ...c, uses: (c.uses ?? 0) + 1 });
}
