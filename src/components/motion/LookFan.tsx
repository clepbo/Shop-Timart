"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export interface FanCard {
  href: string;
  label: string;
  sub?: string;
  content: ReactNode;
}

/**
 * A hand of lookbook cards. Hover (or tap "shuffle") to fan them out; click a card at the back to
 * bring it to the front, click the front card to open it.
 */
export function LookFan({ cards }: { cards: FanCard[] }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [open, setOpen] = useState(false);
  const n = cards.length;
  const front = order[n - 1];

  const bringToFront = (idx: number) => setOrder((o) => [...o.filter((x) => x !== idx), idx]);
  const shuffle = () => setOrder((o) => [o[n - 1], ...o.slice(0, n - 1)]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-[380px] w-full max-w-[560px] sm:h-[460px]"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {order.map((idx, depth) => {
          const card = cards[idx];
          const pos = depth - (n - 1) / 2;
          const spread = open ? 1 : 0.32;
          const isFront = idx === front;
          const style = {
            transform: `translateX(calc(-50% + ${pos * (open ? 128 : 26)}px)) translateY(${Math.abs(pos) * (open ? 18 : 6)}px) rotate(${pos * 9 * spread}deg)`,
            zIndex: depth + 1,
          };
          const inner = (
            <div className="h-full overflow-hidden bg-paper shadow-[0_18px_40px_-18px_rgba(67,42,26,0.45)] ring-1 ring-wine/10">
              <div className="relative h-[82%] overflow-hidden bg-sand">{card.content}</div>
              <div className="flex h-[18%] flex-col justify-center px-4">
                <p className="truncate text-[13px] font-semibold">{card.label}</p>
                {card.sub && <p className="text-[12px] font-medium text-wine">{card.sub}</p>}
              </div>
            </div>
          );
          return (
            <div
              key={idx}
              className="absolute left-1/2 top-0 h-[330px] w-[220px] origin-bottom transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:!-translate-y-3 sm:h-[400px] sm:w-[264px]"
              style={style}
            >
              {isFront ? (
                <Link href={card.href} className="block h-full" aria-label={card.label}>
                  {inner}
                </Link>
              ) : (
                <button type="button" onClick={() => bringToFront(idx)} className="block h-full w-full text-left" aria-label={`Show ${card.label}`}>
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => { shuffle(); setOpen(true); setTimeout(() => setOpen(false), 900); }} className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-wine underline-offset-4 hover:underline">
        Shuffle the looks ↻
      </button>
    </div>
  );
}
