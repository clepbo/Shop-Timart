"use client";

import { brand, formatPrice } from "@/lib/brand";

export interface ReceiptData {
  id: string;
  date: string;
  lines: { name: string; colour: string; size: string; quantity: number; total: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paid?: boolean;
}

/** An order receipt that "prints" out of a slot when it mounts. */
export function Receipt({ data }: { data: ReceiptData }) {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="relative z-10 h-3 rounded-full bg-wine-deep shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]" aria-hidden />
      <div className="-mt-1.5 overflow-hidden px-3">
        <div className="receipt-edge animate-[print_2.4s_cubic-bezier(.3,.7,.2,1)_both] bg-paper px-6 pb-8 pt-6 font-mono text-[12px] text-ink shadow-[0_12px_30px_-12px_rgba(67,42,26,0.35)]">
          <div className="text-center">
            <p className="font-display text-base font-semibold tracking-[0.2em]">{brand.name.toUpperCase()}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{brand.addressShort}</p>
          </div>
          <div className="my-4 border-t border-dashed border-ink/30" />
          <div className="flex justify-between text-[11px] text-muted">
            <span>{data.id}</span>
            <span>{new Date(data.date).toLocaleDateString("en-NG")}</span>
          </div>
          <ul className="mt-3 space-y-2">
            {data.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate">{l.quantity}× {l.name}</span>
                  <span className="text-[10px] text-muted">{l.colour} · {l.size}</span>
                </span>
                <span className="shrink-0">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-dashed border-ink/30" />
          <div className="space-y-1">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatPrice(data.subtotal)}</span></div>
            <div className="flex justify-between text-muted"><span>Delivery</span><span>{data.deliveryFee ? formatPrice(data.deliveryFee) : "Free"}</span></div>
            <div className="flex justify-between pt-1 text-[14px] font-bold"><span>{data.paid ? "TOTAL PAID" : "TOTAL"}</span><span>{formatPrice(data.total)}</span></div>
          </div>
          <div className="mt-5 flex h-9 items-end justify-center gap-[2px]" aria-hidden>
            {Array.from({ length: 44 }).map((_, i) => (
              <span key={i} className="bg-ink" style={{ width: (i * 7) % 3 === 0 ? 3 : 1, height: `${70 + ((i * 13) % 30)}%` }} />
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-muted">The beauty of every outfit is you in it</p>
        </div>
      </div>
    </div>
  );
}
