import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Studio", robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-ink/10 bg-paper">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/admin" className="font-display text-2xl uppercase tracking-[0.28em]">
            {brand.name} <span className="ml-2 align-middle text-[10px] tracking-[0.2em] text-gold">Studio</span>
          </Link>
          <Link href="/" className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">View store ↗</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
