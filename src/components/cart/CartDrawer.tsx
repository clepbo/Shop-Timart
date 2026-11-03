"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart, itemKey } from "./CartProvider";
import { CloseIcon, MinusIcon, PlusIcon } from "../Icons";
import { brand, formatPrice } from "@/lib/brand";
import { ProductArt } from "../shop/ProductArt";

export function CartDrawer() {
  const { items, open, setOpen, subtotal, update, remove } = useCart();
  const toFree = Math.max(0, brand.freeDeliveryThreshold - subtotal);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-ivory transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${open ? "translate-x-0 shadow-2xl" : "invisible translate-x-full"}`}
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="display text-3xl">Your bag</h2>
          <button onClick={() => setOpen(false)} className="-mr-2 p-2" aria-label="Close bag">
            <CloseIcon />
          </button>
        </div>
        {items.length > 0 && (
          <div className="border-b border-ink/10 px-6 py-3 text-[13px] text-muted">
            {toFree > 0 ? <>You&apos;re {formatPrice(toFree)} away from free Benin City delivery.</> : <>You&apos;ve unlocked free Benin City delivery</>}
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
              <div className="h-full bg-wine transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / brand.freeDeliveryThreshold) * 100)}%` }} />
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="display text-3xl">Your bag is empty</p>
              <p className="mt-2 max-w-[260px] text-sm text-muted">Find something graceful — and see it on your body size before you buy.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary mt-6">
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {items.map((i) => {
                const k = itemKey(i);
                return (
                  <li key={k} className="flex gap-4 py-5">
                    <ProductArt
                      garmentType={i.garmentType}
                      gender={i.gender}
                      colour={{ name: i.colour, hex: i.hex, accent: i.accent }}
                      photo={i.image}
                      className="h-28 w-[88px] shrink-0 rounded-md"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link href={`/shop/${i.slug}`} onClick={() => setOpen(false)} className="font-display text-xl leading-tight">
                          {i.name}
                        </Link>
                        <button onClick={() => remove(k)} className="text-muted hover:text-ink" aria-label={`Remove ${i.name}`}>
                          <CloseIcon className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-[13px] text-muted">
                        {i.colour} · {i.size}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-ink/15">
                          <button className="p-2" onClick={() => update(k, i.quantity - 1)} aria-label="Decrease quantity">
                            <MinusIcon className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm">{i.quantity}</span>
                          <button className="p-2" onClick={() => update(k, i.quantity + 1)} aria-label="Increase quantity">
                            <PlusIcon className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm">{formatPrice(i.price * i.quantity)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="flex justify-between text-[15px]">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[12px] text-muted">Delivery calculated at checkout.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
