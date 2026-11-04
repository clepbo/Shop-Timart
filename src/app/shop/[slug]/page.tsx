import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/store";
import { categories } from "@/lib/catalog";
import { ProductExperience } from "@/components/shop/ProductExperience";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage({ params, searchParams }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProducts()).filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)).slice(0, 4);
  const cat = categories.find((c) => c.slug === product.category);

  return (
    <div className="container-x pb-24 pt-6">
      <nav className="mb-6 text-[12px] uppercase tracking-[0.14em] text-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        {cat && (
          <>
            {" / "}
            <Link href={`/shop?category=${cat.slug}`} className="hover:text-ink">{cat.name}</Link>
          </>
        )}
        {" / "}
        <span className="text-ink">{product.name}</span>
      </nav>
      <ProductExperience product={product} initialColour={typeof sp.colour === "string" ? sp.colour : undefined} />

      {related.length > 0 && (
        <section className="mt-24">
          <p className="eyebrow">Complete the wardrobe</p>
          <h2 className="display mt-3 text-[36px] sm:text-[52px]">You may also <span className="accent text-camel">love</span></h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
