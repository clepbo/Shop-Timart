import Link from "next/link";
import { getProducts } from "@/lib/store";
import { categories } from "@/lib/catalog";
import { bodyProfiles, defaultBody } from "@/lib/bodies";
import { brand } from "@/lib/brand";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductArt } from "@/components/shop/ProductArt";
import { Figure } from "@/components/figure/Figure";
import { ArrowIcon, SparkIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

const categoryArt: Record<string, { pid: string; ci: number }> = {
  dresses: { pid: "amara-pleated-maxi", ci: 1 },
  corporate: { pid: "moyo-skirt-suit", ci: 0 },
  sets: { pid: "kemi-two-piece", ci: 0 },
  "abayas-kaftans": { pid: "noor-flow-abaya", ci: 0 },
  men: { pid: "femi-classic-suit", ci: 1 },
};

const styleTiles = [
  { tag: "Corporate", text: "Boardroom-ready, built around you.", cls: "bg-wine text-ivory", dark: true, g: "suit" as const, c: "#E6DFD1", a: undefined, b: 3 },
  { tag: "Weddings & Owambe", text: "Coordinated looks for your whole party.", cls: "bg-sand", dark: false, g: "kaftan" as const, c: "#C29A45", a: "#5B2A1E", b: 4 },
  { tag: "Church & Faith", text: "Reverent, radiant Sunday best.", cls: "bg-paper", dark: false, g: "maxi-dress" as const, c: "#8C9A7E", a: undefined, b: 1 },
  { tag: "Evening", text: "Galas and dinners, gracefully covered.", cls: "bg-ink text-ivory", dark: true, g: "two-piece" as const, c: "#24438A", a: "#162B5C", b: 2 },
];

export default async function Home() {
  const products = await getProducts();
  const newIn = products.filter((p) => p.isNew).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const suit = bySlug["adaeze-power-suit"];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="container-x grid grid-cols-1 items-center gap-10 pb-16 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pb-24 lg:pt-14">
          <div className="animate-rise">
            <p className="eyebrow">Corporate · Modest · Intentional</p>
            <h1 className="display mt-5 text-[56px] sm:text-[80px] xl:text-[96px]">
              Power dressing, <em className="font-normal text-wine">covered</em> in <em className="font-normal text-wine">grace</em>.
            </h1>
            <p className="mt-7 max-w-md text-[17px] leading-relaxed text-muted">
              Modest corporate wear for women and men who lead with confidence. See every suit, skirt and dress on a body like yours — in every colour — before you buy.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop the collection <ArrowIcon />
              </Link>
              <Link href="/fit-studio" className="btn-outline">
                <SparkIcon /> Try the Fit Studio
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-6">
              {[
                ["6", "body profiles"],
                ["UK 6–22", "inclusive sizing"],
                ["1:1", "styling sessions"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-3xl">{k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroShowcase />
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="container-x py-16 lg:py-24">
        <SectionHeading eyebrow="Shop by category" title={<>Find your <em className="text-wine">moment</em></>} href="/shop" cta="Shop all" />
        <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {categories.map((c) => {
            const art = categoryArt[c.slug];
            const p = art && bySlug[art.pid];
            return (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group w-[62%] shrink-0 snap-start sm:w-auto">
                <div className="overflow-hidden rounded-[22px]">
                  {p && (
                    <ProductArt
                      garmentType={p.garmentType}
                      gender={p.gender}
                      colour={p.colors[art.ci] ?? p.colors[0]}
                      body={defaultBody(p.gender)}
                      className="aspect-[3/4] transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <p className="mt-4 font-display text-2xl">{c.name}</p>
                <p className="text-[13px] text-muted">{c.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- New in ---------- */}
      <section className="container-x py-8 lg:py-12">
        <SectionHeading eyebrow="Just in" title="New arrivals" href="/shop?sort=new" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {newIn.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* ---------- Fit Studio feature ---------- */}
      <section className="py-16 lg:py-28">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[32px] bg-ink text-ivory">
            <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:p-16">
              <div>
                <p className="eyebrow">The Fit Studio</p>
                <h2 className="display mt-4 text-5xl sm:text-7xl">
                  See it on <em className="text-gold">your</em> body — before it&apos;s in your bag.
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
                  Every piece in our store can be previewed across six body profiles and every colour it comes in. Choose the shape closest to yours, switch shades instantly, and shop with confidence.
                </p>
                <ol className="mt-8 space-y-4 text-sm text-ivory/80">
                  {["Pick the body profile closest to yours", "Switch colours and compare sizes side by side", "Get a size suggestion and add to bag"].map((s, i) => (
                    <li key={s} className="flex items-center gap-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-ivory/25 font-display text-lg">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <Link href="/fit-studio" className="btn-light mt-10">
                  Open the Fit Studio <ArrowIcon />
                </Link>
              </div>
              <div className="grid grid-cols-6 items-end gap-0 rounded-[24px] bg-gradient-to-b from-ivory/[0.06] to-ivory/[0.12] px-2 pt-8">
                {bodyProfiles
                  .filter((b) => b.gender === "women")
                  .map((b, i) => (
                    <div key={b.id} className="flex flex-col items-center pb-4">
                      {suit && (
                        <Figure garment="suit" gender="women" body={b} color={suit.colors[i % suit.colors.length].hex} shadow={false} className="h-[180px] w-auto sm:h-[300px]" />
                      )}
                      <span className="mt-2 text-[9px] uppercase tracking-[0.14em] text-ivory/60 sm:text-[10px]">{b.sizes}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Styling services ---------- */}
      <section className="container-x pb-16 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {styleTiles.map((t, i) => (
              <div key={t.tag} className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-[24px] p-5 sm:p-6 ${t.cls} ${i === 1 ? "mt-10" : i === 2 ? "-mt-10" : ""}`}>
                <span className={`eyebrow ${t.dark ? "!text-blush" : ""}`}>{t.tag}</span>
                <p className="relative z-10 mt-3 max-w-[85%] font-display text-xl leading-tight sm:text-3xl">{t.text}</p>
                <Figure garment={t.g} gender="women" body={bodyProfiles[t.b]} color={t.c} accent={t.a} shadow={false} className="absolute -bottom-2 right-1 h-[48%] w-auto sm:right-4 sm:h-[62%]" />
              </div>
            ))}
          </div>
          <div>
            <p className="eyebrow">Personal styling</p>
            <h2 className="display mt-4 text-5xl sm:text-7xl">
              More than clothes — we <em className="text-wine">style</em> you.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted">
              From a single corporate event to a full wedding weekend, our stylists build complete looks that honour your body, your faith and the occasion. In-studio in Lagos or virtually anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/styling" className="btn-primary">
                Book a session <ArrowIcon />
              </Link>
              <Link href="/styling#services" className="btn-outline">
                See services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Quote ---------- */}
      <section className="bg-sand/60 py-20 lg:py-28">
        <div className="container-x text-center">
          <p className="text-gold">✦</p>
          <blockquote className="display mx-auto mt-6 max-w-4xl text-[40px] italic sm:text-6xl">
            “Decency is not the absence of style. It is style with intention.”
          </blockquote>
          <p className="mt-8 text-[12px] uppercase tracking-[0.2em] text-muted">The {brand.name} philosophy</p>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="container-x py-16 lg:py-24">
        <SectionHeading eyebrow="Most loved" title="Signature pieces" href="/shop" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="container-x pb-20 lg:pb-28">
        <SectionHeading eyebrow="Kind words" title="Worn with confidence" center />
        <div className="mt-10">
          <Testimonials />
        </div>
      </section>
    </>
  );
}
