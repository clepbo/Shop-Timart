"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductArt } from "@/components/shop/ProductArt";
import { formatPrice } from "@/lib/brand";
import { deliveryOptions } from "@/lib/delivery";
import { placeOrder, type OrderResult } from "../actions/public";
import { WhatsAppIcon } from "@/components/Icons";
import { Receipt } from "@/components/shop/Receipt";

export function CheckoutForm({ paystack }: { paystack: boolean }) {
  const { items, subtotal, clear } = useCart();
  const [delivery, setDelivery] = useState(deliveryOptions[0].id);
  const [result, setResult] = useState<OrderResult>(null);
  const [pending, start] = useTransition();
  const opt = deliveryOptions.find((d) => d.id === delivery)!;
  const fee = opt.fee(subtotal);

  if (result?.ok && !result.redirect)
    return (
      <div className="mx-auto mt-12 grid max-w-3xl items-start gap-10 md:grid-cols-2">
        {result.receipt && <Receipt data={result.receipt} />}
        <div className={`rounded-md bg-paper p-8 text-center ${result.receipt ? "md:text-left" : "md:col-span-2"}`}>
        <p className="text-3xl text-gold">✦</p>
        <p className="display mt-3 text-4xl">Thank you!</p>
        <p className="mt-3 text-muted">{result.message} Send it to us on WhatsApp to confirm payment and delivery.</p>
        {result.link && (
          <a href={result.link} target="_blank" rel="noreferrer" className="btn-primary mt-6">
            <WhatsAppIcon className="size-4" /> Confirm on WhatsApp
          </a>
        )}
        <Link href="/shop" className="mt-4 block text-[12px] uppercase tracking-[0.16em] text-muted">Continue shopping</Link>
      </div>
      </div>
    );

  if (!items.length)
    return (
      <div className="mt-12 text-center">
        <p className="text-muted">Your bag is empty.</p>
        <Link href="/shop" className="btn-primary mt-6">Shop the collection</Link>
      </div>
    );

  const submit = (form: FormData) => {
    const get = (k: string) => String(form.get(k) ?? "").trim();
    start(async () => {
      const res = await placeOrder({
        customer: { name: get("name"), phone: get("phone"), email: get("email"), address: get("address"), city: get("city"), state: get("state"), notes: get("notes") },
        delivery,
        items: items.map((i) => ({ productId: i.productId, name: i.name, colour: i.colour, size: i.size, quantity: i.quantity })),
      }).catch((e: Error): OrderResult => ({ ok: false, message: e.message }));
      setResult(res);
      if (res?.ok && res.redirect) {
        window.location.assign(res.redirect); // Paystack hosted checkout; cart clears on confirmation
        return;
      }
      if (res?.ok) clear();
    });
  };

  return (
    <form action={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-8">
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 font-display text-3xl">Contact</legend>
          <label><span className="label">Full name *</span><input name="name" required className="field" autoComplete="name" /></label>
          <label><span className="label">Phone *</span><input name="phone" required type="tel" className="field" autoComplete="tel" placeholder="+234" /></label>
          <label className="sm:col-span-2"><span className="label">Email{paystack ? " * (for your receipt)" : ""}</span><input name="email" type="email" required={paystack} className="field" autoComplete="email" /></label>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 font-display text-3xl">Delivery</legend>
          <label className="sm:col-span-2"><span className="label">Address *</span><input name="address" required className="field" autoComplete="street-address" /></label>
          <label><span className="label">City *</span><input name="city" required className="field" autoComplete="address-level2" /></label>
          <label><span className="label">State *</span><input name="state" required className="field" autoComplete="address-level1" defaultValue="Edo" /></label>
          <div className="space-y-2 sm:col-span-2">
            {deliveryOptions.map((d) => (
              <label key={d.id} className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3.5 transition ${delivery === d.id ? "border-ink bg-paper" : "border-ink/15"}`}>
                <span className="flex items-center gap-3 text-sm">
                  <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} className="accent-wine" />
                  {d.label}
                </span>
                <span className="text-sm">{d.fee(subtotal) === 0 ? "Free" : formatPrice(d.fee(subtotal))}</span>
              </label>
            ))}
          </div>
          <label className="sm:col-span-2"><span className="label">Order notes</span><textarea name="notes" rows={3} className="field" placeholder="Tailoring requests, delivery instructions…" /></label>
        </fieldset>
      </div>

      <aside className="h-fit rounded-md bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
        <p className="font-display text-3xl">Order summary</p>
        <ul className="mt-6 space-y-4">
          {items.map((i) => (
            <li key={`${i.productId}${i.colour}${i.size}`} className="flex gap-4">
              <ProductArt garmentType={i.garmentType} gender={i.gender} colour={{ name: i.colour, hex: i.hex, accent: i.accent }}
                      photo={i.image} className="h-20 w-16 shrink-0 rounded-lg" />
              <div className="flex-1 text-sm">
                <p className="font-display text-lg leading-tight">{i.name}</p>
                <p className="text-muted">{i.colour} · {i.size} · ×{i.quantity}</p>
              </div>
              <p className="text-sm">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{fee === 0 ? "Free" : formatPrice(fee)}</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-lg"><dt>Total</dt><dd>{formatPrice(subtotal + fee)}</dd></div>
        </dl>
        {result && !result.ok && <p className="mt-4 text-sm text-red-700">{result.message}</p>}
        <button disabled={pending || !!result?.redirect} className="btn-primary mt-6 w-full">
          {result?.redirect ? "Redirecting to Paystack…" : pending ? "Placing order…" : paystack ? `Pay ${formatPrice(subtotal + fee)} securely` : "Place order"}
        </button>
        <p className="mt-3 text-center text-[12px] text-muted">
          {paystack ? "Card, bank transfer & USSD via Paystack. Payments are in Naira (₦)." : "We'll confirm payment and delivery with you on WhatsApp."}
        </p>
      </aside>
    </form>
  );
}
