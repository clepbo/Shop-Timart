"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { BagIcon, CloseIcon, MenuIcon } from "../Icons";
import { useCart } from "../cart/CartProvider";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?gender=women", label: "Women" },
  { href: "/shop?gender=men", label: "Men" },
  { href: "/fit-studio", label: "Fit Studio" },
  { href: "/styling", label: "Styling" },
  { href: "/about", label: "Our story" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "bg-ivory/90 shadow-[0_1px_0_rgba(35,26,22,0.08)] backdrop-blur-md" : "bg-ivory"}`}>
      <div className="container-x grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-7">
          <button className="-ml-2 p-2 lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.slice(0, 3).map((n) => (
              <Link key={n.href} href={n.href} className="link-underline text-[12px] uppercase tracking-[0.16em]">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <Logo />
        <div className="flex items-center justify-end gap-7">
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.slice(3).map((n) => (
              <Link key={n.href} href={n.href} className="link-underline text-[12px] uppercase tracking-[0.16em]">
                {n.label}
              </Link>
            ))}
          </nav>
          <button onClick={() => setOpen(true)} className="relative -mr-2 p-2" aria-label={`Open bag, ${count} items`}>
            <BagIcon className="size-[22px]" />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-wine text-[10px] font-medium text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
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
