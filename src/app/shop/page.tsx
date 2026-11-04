import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/store";
import { categories, occasions } from "@/lib/catalog";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop" };

type SP = { gender?: string; category?: string; occasion?: string; sort?: string };

function href(current: SP, patch: Partial<SP>) {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}

function Chip({ active, to, children }: { active: boolean; to: string; children: React.ReactNode }) {
  return (
    <Link href={to} scroll={false} className={`whitespace-nowrap border px-4 py-2 text-[12px] uppercase tracking-[0.12em] transition ${active ? "border-ink bg-ink text-ivory" : "border-ink/15 hover:border-ink"}`}>
      {children}
    </Link>
  );
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = (await searchParams) as SP;
  let items = await getProducts();
  if (sp.gender) items = items.filter((p) => p.gender === sp.gender);
  if (sp.category) items = items.filter((p) => p.category === sp.category);
  if (sp.occasion) items = items.filter((p) => p.occasions.includes(sp.occasion!));
  if (sp.sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sp.sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);

  const title = sp.category ? categories.find((c) => c.slug === sp.category)?.name : sp.gender === "men" ? "Men" : sp.gender === "women" ? "Women" : "The Collection";

  return (
    <div className="container-x pb-24 pt-10">
      <div className="max-w-2xl">
        <p className="eyebrow">Shop</p>
        <h1 className="display mt-3 text-[44px] sm:text-5xl">{title}</h1>
        <p className="mt-4 text-muted">Real pieces from our Benin City store, photographed on our team. Tap any item for more photos — or to see it on your size.</p>
      </div>

      <div className="sticky top-[76px] z-20 -mx-4 mt-10 space-y-3 border-y border-ink/10 bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!sp.gender && !sp.category} to={href(sp, { gender: undefined, category: undefined })}>All</Chip>
          <Chip active={sp.gender === "women"} to={href(sp, { gender: "women", category: undefined })}>Women</Chip>
          <Chip active={sp.gender === "men"} to={href(sp, { gender: "men", category: undefined })}>Men</Chip>
          <span className="mx-1 w-px shrink-0 bg-ink/10" />
          {categories.filter((c) => c.slug !== "men").map((c) => (
            <Chip key={c.slug} active={sp.category === c.slug} to={href(sp, { category: sp.category === c.slug ? undefined : c.slug, gender: undefined })}>
              {c.name}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {occasions.map((o) => (
              <Link key={o} scroll={false} href={href(sp, { occasion: sp.occasion === o ? undefined : o })} className={`whitespace-nowrap text-[13px] transition ${sp.occasion === o ? "text-wine underline underline-offset-4" : "text-muted hover:text-ink"}`}>
                {o}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[13px] text-muted">
            <span>{items.length} pieces</span>
            <span className="text-ink/20">|</span>
            <Link scroll={false} href={href(sp, { sort: undefined })} className={!sp.sort ? "text-ink" : ""}>New</Link>
            <Link scroll={false} href={href(sp, { sort: "price-asc" })} className={sp.sort === "price-asc" ? "text-ink" : ""}>Price ↑</Link>
            <Link scroll={false} href={href(sp, { sort: "price-desc" })} className={sp.sort === "price-desc" ? "text-ink" : ""}>Price ↓</Link>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="display text-4xl">Nothing here just yet</p>
          <Link href="/shop" className="btn-outline mt-6">Clear filters</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
