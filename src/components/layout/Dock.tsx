"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart/CartProvider";
import { BagIcon, HangerIcon, HomeIcon, ScissorsIcon, WhatsAppIcon } from "../Icons";
import { brand, whatsappLink } from "@/lib/brand";

/** Floating dock that slides up once you scroll — quick access to shop, styling, WhatsApp and the bag. */
export function Dock() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [bubble, setBubble] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const on = () => setVisible(window.scrollY > 560);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const items = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Shop", href: "/shop", icon: <HangerIcon /> },
    { label: "Styling", href: "/styling", icon: <ScissorsIcon /> },
    { label: "WhatsApp", href: whatsappLink(`Hello ${brand.name}!`), icon: <WhatsAppIcon />, external: true },
    { label: "Bag", icon: <BagIcon />, onClick: () => setOpen(true), badge: count },
  ];
  const activeIdx = items.findIndex((i) => i.href && !i.external && (i.href === "/" ? pathname === "/" : pathname.startsWith(i.href)));
  const target = hover ?? (activeIdx >= 0 ? activeIdx : null);

  useEffect(() => {
    const el = target != null ? refs.current[target] : null;
     
    setBubble(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [target, visible]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  return (
    <nav
      aria-label="Quick actions"
      className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"}`}
      onMouseLeave={() => setHover(null)}
    >
      <div className="relative flex items-center gap-1 rounded-full bg-wine-deep/95 p-1.5 shadow-[0_18px_40px_-12px_rgba(43,30,22,0.55)] ring-1 ring-butter/10 backdrop-blur">
        {bubble && <span className="absolute top-1.5 h-[calc(100%-12px)] rounded-full bg-butter/15 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]" style={{ left: bubble.left, width: bubble.width }} aria-hidden />}
        {items.map((it, i) => {
          const cls = "group relative grid size-11 place-items-center rounded-full text-butter transition hover:-translate-y-0.5";
          const body = (
            <>
              {it.icon}
              {!!it.badge && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-butter text-[9px] font-bold text-wine-deep">{it.badge}</span>}
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] text-ivory opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">{it.label}</span>
            </>
          );
          const common = { ref: (el: HTMLElement | null) => { refs.current[i] = el; }, onMouseEnter: () => setHover(i), "aria-label": it.label, className: cls };
          if (it.onClick) return <button key={it.label} type="button" onClick={it.onClick} {...common}>{body}</button>;
          if (it.external) return <a key={it.label} href={it.href} target="_blank" rel="noreferrer" {...common}>{body}</a>;
          return <Link key={it.label} href={it.href!} {...common}>{body}</Link>;
        })}
      </div>
    </nav>
  );
}
