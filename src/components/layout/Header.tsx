"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { BagIcon, CloseIcon, MenuIcon } from "../Icons";
import { useCart } from "../cart/CartProvider";

const shopMenu = [
  { href: "/shop", label: "Shop all", note: "Every piece in store" },
  { href: "/shop?category=corporate", label: "Corporate", note: "Suits & blazers" },
  { href: "/shop?category=sets", label: "Sets", note: "Ready-to-wear looks" },
  { href: "/shop?category=tops", label: "Tops & Blouses", note: "Work-ready tops" },
  { href: "/shop?gender=men", label: "Men", note: "Jackets & suits" },
];

const nav = [
  { href: "/styling", label: "Styling" },
  { href: "/fit-studio", label: "Fit Studio" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) {
       
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu on navigation
  useEffect(() => setMenu(false), [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "bg-paper/95 shadow-[0_1px_0_rgba(20,17,17,0.08)] backdrop-blur-md" : "bg-paper"}`}>
      <div className="container-x flex h-[76px] items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button className="-ml-2 p-2 lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <Logo />
        </div>
        <nav className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <Link href="/shop" className={`flex items-center gap-1.5 border-b pb-1 text-[12px] font-medium uppercase tracking-[0.14em] transition ${pathname.startsWith("/shop") ? "border-wine text-wine" : "border-transparent hover:text-wine"}`} aria-haspopup="true">
              Shop
              <svg viewBox="0 0 12 12" className="size-2.5 transition duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden>
                <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="invisible absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="border border-wine/10 bg-paper p-2 shadow-[0_24px_50px_-20px_rgba(67,42,26,0.4)]">
                {shopMenu.map((m) => (
                  <Link key={m.href} href={m.href} className="group/item flex items-center justify-between px-4 py-3 transition hover:bg-sand">
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">{m.label}</span>
                      <span className="block text-[12px] text-muted">{m.note}</span>
                    </span>
                    <span className="text-wine opacity-0 transition duration-300 group-hover/item:translate-x-1 group-hover/item:opacity-100">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`border-b pb-1 text-[12px] font-medium uppercase tracking-[0.14em] transition ${active ? "border-wine text-wine" : "border-transparent hover:text-wine"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={() => setOpen(true)} className="relative -mr-2 p-2 text-ink hover:text-wine" aria-label={`Open bag, ${count} items`}>
          <BagIcon className={`size-[22px] ${bump ? "animate-[bump_.5s_ease]" : ""}`} />
          {count > 0 && (
            <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-wine text-[10px] font-semibold text-butter">{count}</span>
          )}
        </button>
      </div>

      {/* mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${menu ? "opacity-100" : "opacity-0"}`} onClick={() => setMenu(false)} />
        <div className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-ivory p-6 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${menu ? "translate-x-0" : "invisible -translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <span className="eyebrow">Menu</span>
            <button onClick={() => setMenu(false)} aria-label="Close menu" className="-mr-2 p-2">
              <CloseIcon />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-5">
            <div>
              <Link href="/shop" className="display text-4xl">
                Shop
              </Link>
              <div className="mt-3 flex flex-col gap-2.5 border-l border-wine/20 pl-4">
                {shopMenu.slice(1).map((m) => (
                  <Link key={m.href} href={m.href} className="text-[15px] text-muted hover:text-wine">
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="display text-4xl">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-ink/10 pt-6 text-sm text-muted">Need help choosing? Book a styling session and we&apos;ll dress you for the moment.</div>
        </div>
      </div>
    </header>
  );
}
