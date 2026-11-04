import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/store";
import { ProductExperience } from "@/components/shop/ProductExperience";
import { ProductArt } from "@/components/shop/ProductArt";
import { defaultBody } from "@/lib/bodies";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fit Studio", description: "Preview any piece on a body like yours, in every colour." };

export default async function FitStudioPage({ searchParams }: PageProps<"/fit-studio">) {
  const sp = await searchParams;
  const products = await getProducts();
  const current = products.find((p) => p.slug === sp.p) ?? products.find((p) => p.featured) ?? products[0];

  return (
    <div className="pb-24">
      <section className="container-x pb-10 pt-10 text-center">
        <p className="eyebrow">The Fit Studio</p>
        <h1 className="display mx-auto mt-4 max-w-4xl text-[52px] sm:text-[80px]">
          See it on <span className="accent text-camel">you.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted">Choose a piece, pick the body closest to yours and switch colours instantly. Compare all sizes side by side, then shop the size we suggest.</p>
      </section>

      <section className="container-x">
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {products.map((p) => {
            const active = p.id === current?.id;
            return (
              <Link key={p.id} href={`/fit-studio?p=${p.slug}`} scroll={false} className={`group w-[108px] shrink-0 rounded-md border p-1.5 transition ${active ? "border-ink bg-paper" : "border-transparent hover:border-ink/20"}`} aria-current={active ? "true" : undefined}>
                <ProductArt garmentType={p.garmentType} gender={p.gender} colour={p.colors[0]} body={defaultBody(p.gender)} className="aspect-[4/5] rounded-md" />
                <p className="mt-1.5 truncate px-1 text-[11px]">{p.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {current && (
        <section className="container-x mt-10">
          <ProductExperience key={current.id} product={current} />
        </section>
      )}
    </div>
  );
}
