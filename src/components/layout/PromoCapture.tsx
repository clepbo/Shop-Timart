"use client";

import { useEffect, useState } from "react";
import { previewCoupon } from "@/app/actions/public";
import { setStoredPromo } from "@/lib/promo-client";
import { Monogram } from "../brand/Marks";
import { CloseIcon } from "../Icons";

/**
 * Picks up `?promo=CODE` (the store's QR code links to shop-timart.com/?promo=SCAN5),
 * checks the code, remembers it for checkout and shows a welcome message.
 */
export function PromoCapture() {
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("promo");
    if (!code) return;
    url.searchParams.delete("promo");
    window.history.replaceState(null, "", url.pathname + (url.search ? url.search : "") + url.hash);
    previewCoupon(code, 10_000_000)
      .then((r) => {
        if (r.ok) {
          setStoredPromo({ code: r.code, label: r.label });
          setToast({ ok: true, text: `${r.label} unlocked — it's applied automatically at checkout.` });
        } else {
          setToast({ ok: false, text: r.message });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 9000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  return (
    <div role="status" className="fixed inset-x-4 top-24 z-[55] mx-auto max-w-md animate-rise">
      <div className="flex items-start gap-4 bg-wine-deep p-5 text-ivory shadow-[0_24px_50px_-20px_rgba(46,31,23,0.6)]">
        <Monogram className="mt-1 h-7 w-auto shrink-0 text-camel" />
        <div className="flex-1">
          <p className="font-display text-lg font-semibold">{toast.ok ? "Welcome to Shop Timart" : "About your code"}</p>
          <p className="mt-1 text-[14px] text-ivory/80">{toast.text}</p>
        </div>
        <button onClick={() => setToast(null)} aria-label="Dismiss" className="-mr-1 -mt-1 p-1 text-ivory/70 hover:text-ivory">
          <CloseIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
