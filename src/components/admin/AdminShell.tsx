"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Monogram } from "../brand/Marks";

const nav = [
  { href: "/admin", label: "Products", icon: "M4 7h16l-1.5 12h-13L4 7Zm4 0V5a4 4 0 0 1 8 0v2", exact: true },
  { href: "/admin/orders", label: "Orders & styling", icon: "M6 4h12v16l-3-2-3 2-3-2-3 2V4Zm3 5h6M9 13h6" },
  { href: "/admin/sales", label: "Sales", icon: "M4 12 12 4h8v8l-8 8-8-8Zm11-4h.01" },
  { href: "/admin/coupons", label: "Discount codes & QR", icon: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h3m0 3h3m-3-6h3" },
  { href: "/admin/content", label: "Site content", icon: "M4 5h16M4 10h10M4 15h16M4 20h8" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const KEY = "timart.admin.sidebar";

export function AdminShell({ children, logout }: { children: React.ReactNode; logout: () => Promise<void> }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the saved preference once
      setCollapsed(localStorage.getItem(KEY) === "collapsed");
    } catch {}
  }, []);
  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(KEY, c ? "open" : "collapsed");
      } catch {}
      return !c;
    });
  if (pathname.startsWith("/admin/login")) return <div className="min-h-screen bg-ivory">{children}</div>;
  const active = (href: string, exact?: boolean) => (exact ? pathname === href || pathname.startsWith("/admin/products") : pathname.startsWith(href));

  return (
    <div className={`min-h-screen bg-ivory lg:grid lg:transition-[grid-template-columns] lg:duration-300 ${collapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[248px_1fr]"}`}>
      <aside className="sticky top-0 z-30 border-b border-ink/10 bg-wine-deep text-ivory lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:border-b-0 lg:border-r">
        <div className={`flex items-center justify-between gap-3 px-4 py-3 lg:block lg:py-7 ${collapsed ? "lg:px-0 lg:text-center" : "lg:px-6"}`}>
          <Link href="/admin" className={`flex items-center gap-2.5 ${collapsed ? "lg:justify-center" : ""}`} title="Shop Timart Studio">
            <Monogram className="h-6 w-auto shrink-0 text-camel" />
            <span className={`leading-none ${collapsed ? "lg:hidden" : ""}`}>
              <span className="block font-display text-[15px] font-semibold uppercase tracking-[0.14em]">Shop Timart</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-ivory/55">Studio</span>
            </span>
          </Link>
          <Link href="/" target="_blank" className="text-[11px] uppercase tracking-[0.14em] text-ivory/70 hover:text-ivory lg:hidden">
            View store ↗
          </Link>
        </div>
        <nav className={`flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0 ${collapsed ? "lg:px-2" : "lg:px-3"}`} aria-label="Admin">
          {nav.map((n) => {
            const on = active(n.href, n.exact);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                title={collapsed ? n.label : undefined}
                className={`group/nav relative flex shrink-0 items-center gap-3 whitespace-nowrap px-3 py-2.5 text-[13px] transition ${collapsed ? "lg:justify-center lg:px-0" : ""} ${on ? "bg-ivory/12 text-ivory" : "text-ivory/65 hover:bg-ivory/6 hover:text-ivory"}`}
              >
                <Icon d={n.icon} />
                <span className={collapsed ? "lg:sr-only" : ""}>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={`hidden pt-8 lg:block ${collapsed ? "px-2" : "px-6"}`}>
          <div className={`space-y-3 border-t border-ivory/10 pt-6 text-[12px] uppercase tracking-[0.14em] ${collapsed ? "text-center" : ""}`}>
            <Link href="/" target="_blank" title="View store" className="block text-ivory/70 hover:text-ivory">{collapsed ? "↗" : "View store ↗"}</Link>
            <form action={logout}>
              <button title="Sign out" className="text-ivory/70 hover:text-ivory">
                {collapsed ? (
                  <svg viewBox="0 0 24 24" className="mx-auto size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-label="Sign out"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></svg>
                ) : (
                  "Sign out"
                )}
              </button>
            </form>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mt-auto hidden items-center gap-3 border-t border-ivory/10 py-4 text-[12px] uppercase tracking-[0.14em] text-ivory/60 transition hover:text-ivory lg:flex ${collapsed ? "justify-center" : "px-6"}`}
        >
          <svg viewBox="0 0 24 24" className={`size-[18px] transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 4v16M15 7l-5 5 5 5M10 12h10" />
          </svg>
          {!collapsed && "Collapse"}
        </button>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}

/** Page header used on every admin screen: optional back link, title, description and actions. */
export function AdminHeader({ back, title, description, children }: { back?: { href: string; label: string }; title: string; description?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="display mt-2 text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
