import Link from "next/link";
import { getProducts } from "@/lib/store";
import { bodyProfiles } from "@/lib/bodies";
import { brand, formatPrice, whatsappLink } from "@/lib/brand";
import type { Product } from "@/lib/types";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductArt } from "@/components/shop/ProductArt";
import { Figure } from "@/components/figure/Figure";
import { ArrowIcon, SparkIcon, WhatsAppIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

const studio = (n: string) => `/images/studio/${n}.webp`;

const perks = [
  ["Walk-in store", "Divine Plaza, Uselu, Benin City"],
  ["Same-day delivery", "Anywhere in Benin City"],
  ["Nationwide shipping", "2–5 working days"],
  ["Styling on WhatsApp", brand.phoneDisplay],
];

function GhostTile({ p, ci = 0, swatches = true, className = "" }: { p?: Product; ci?: number; swatches?: boolean; className?: string }) {
  if (!p) return null;
  return <ProductArt garmentType={p.garmentType} gender={p.gender} colour={p.colors[ci] ?? p.colors[0]} ghost swatches={swatches ? p.colors : undefined} name={p.name} className={className} />;
}

export default async function Home() {
  const products = await getProducts();
  const by = (slug: string) => products.find((p) => p.slug === slug);
  const women = products.filter((p) => p.gender === "women");
  const newIn = women.filter((p) => p.isNew).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const timartSet = by("the-timart-set");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-[#7e0913] text-ivory">
        <div className="container-x grid grid-cols-1 items-center lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 animate-rise py-14 lg:py-24">
            <p className="eyebrow !text-butter">Modesty Arena · Benin City</p>
            <h1 className="display mt-5 text-[40px] sm:text-[56px] xl:text-[66px]">
              Corporate wear that covers you in <span className="text-butter">confidence.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ivory/80">
              Blazers, suits and sets for women and men who mean business — modest, polished and styled for global people. Shop online or visit our store in Benin City.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-light">
                Shop the collection <ArrowIcon />
              </Link>
              <a href={whatsappLink(`Hello ${brand.name}! I'd like to book a styling session.`)} target="_blank" rel="noreferrer" className="btn border border-butter/70 text-butter hover:bg-butter hover:text-wine">
                <WhatsAppIcon className="size-4" /> Book styling
              </a>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ivory/20 pt-6">
              {[
                ["4–20", "UK sizes"],
                ["₦16k+", "Sets from"],
                ["1:1", "Styling"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl font-semibold text-butter">{k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ivory/65">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative -mx-4 h-[460px] sm:mx-0 sm:h-[560px] lg:h-[640px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={studio("founder")}
              alt={`The founder of ${brand.name} in a black trouser suit, white shirt and red tie`}
              className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
            />
            <span className="absolute bottom-6 right-4 bg-butter px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-wine sm:right-0">Founder · {brand.name}</span>
          </div>
        </div>
      </section>

      {/* ---------- Perks ---------- */}
      <section className="bg-butter">
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-5 py-6 lg:grid-cols-4">
          {perks.map(([t, d]) => (
            <div key={t}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-wine">{t}</p>
              <p className="mt-0.5 text-[13px] text-wine/75">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="container-x py-16 lg:py-24">
        <SectionHeading eyebrow="Shop by category" title="Dress for the room you're walking into" href="/shop" cta="Shop all" />
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {[
            { href: "/shop?category=corporate", name: "Corporate", sub: "Suits & blazers", p: by("ivory-power-suit") },
            { href: "/shop?category=sets", name: "Sets", sub: "From ₦16,000", p: by("argyle-vest-set") },
            { href: "/shop?category=tops", name: "Tops & Blouses", sub: "Work-ready tops", p: by("gold-button-wrap-top") },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group relative block aspect-[3/4] overflow-hidden">
              <GhostTile p={c.p} className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-x-0 bottom-0 bg-paper/95 px-5 py-4">
                <p className="font-display text-lg font-semibold">{c.name}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
                  {c.sub} <ArrowIcon className="size-3.5 transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
          <Link href="/shop?gender=men" className="group relative block aspect-[3/4] overflow-hidden bg-sand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studio("men-suede-taupe")} alt="Men's taupe suede jacket with cream trousers" className="absolute inset-0 size-full object-cover object-top transition duration-700 group-hover:scale-[1.04]" />
            <div className="absolute inset-x-0 bottom-0 bg-paper/95 px-5 py-4">
              <p className="font-display text-lg font-semibold">Men</p>
              <p className="mt-0.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
                Jackets & suits <ArrowIcon className="size-3.5 transition group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------- New in ---------- */}
      <section className="container-x pb-16 lg:pb-24">
        <SectionHeading eyebrow="Just in" title="New arrivals" href="/shop" cta="View all" />
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5">
          {newIn.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Signature set: colour story ---------- */}
      {timartSet && (
        <section className="bg-sand">
          <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="grid grid-cols-2 gap-3">
              {timartSet.colors.map((c, i) => (
                <Link key={c.name} href={`/shop/${timartSet.slug}?colour=${encodeURIComponent(c.name)}`} className="group block">
                  <GhostTile p={timartSet} ci={i} swatches={false} className="aspect-[3/4] transition duration-700 group-hover:scale-[1.02]" />
                  <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.14em] text-muted">{c.name}</p>
                </Link>
              ))}
            </div>
            <div>
              <p className="eyebrow">Our signature</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">The Timart Set.</h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">
                A blend of comfort and elegance, specially curated for the working woman. One textured blazer, a camisole and wide-leg trousers — styled two ways, for the office and everywhere after.
              </p>
              <div className="mt-8 flex gap-3">
                {[
                  ["Beige", "#CDBBA0"],
                  ["Mustard", "#C0913A"],
                  ["Black", "#1E1E1E"],
                ].map(([n, hex]) => (
                  <div key={n} className="w-20">
                    <span className="block aspect-square rounded-[6px]" style={{ background: hex }} />
                    <span className="mt-2 block text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{n}</span>
                  </div>
                ))}
              </div>
              <dl className="mt-8 grid max-w-sm grid-cols-3 gap-4 border-t border-ink/10 pt-6 text-sm">
                <div>
                  <dt className="text-muted">Price</dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-wine">{formatPrice(timartSet.price)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Sizes</dt>
                  <dd className="mt-1 font-display text-xl font-semibold">6–20</dd>
                </div>
                <div>
                  <dt className="text-muted">Includes</dt>
                  <dd className="mt-1 font-display text-xl font-semibold">3 pcs</dd>
                </div>
              </dl>
              <Link href={`/shop/${timartSet.slug}`} className="btn-primary mt-9">
                Shop the set <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- For him ---------- */}
      <section className="container-x py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">For him</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Smart, relaxed, never sloppy.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted">Corduroy and suede-feel jackets that work over a shirt and tie or a simple knit — in rich, easy colours: forest, taupe, chocolate and cream.</p>
            <Link href="/shop?gender=men" className="btn-outline mt-8">
              Shop men <ArrowIcon />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["corduroy-snap-jacket", "men-corduroy-jacket", "Corduroy Snap Jacket"],
              ["suede-harrington-jacket", "men-suede-forest", "Suede Harrington"],
              ["corduroy-safari-suit", "men-safari-suit", "Corduroy Safari Suit"],
            ].map(([slug, img, name]) => (
              <Link key={slug} href={`/shop/${slug}`} className="group block">
                <div className="relative aspect-[9/14] overflow-hidden bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={studio(img)} alt={name} className="absolute inset-0 size-full object-cover object-top transition duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 text-[13px] font-medium">{name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="container-x pb-16 lg:pb-24">
        <SectionHeading eyebrow="Most loved" title="Boss lady favourites" href="/shop" />
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Styling ---------- */}
      <section className="bg-wine text-ivory">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden bg-[#7e0913]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studio("founder")} alt={`${brand.name}'s founder and lead stylist`} className="absolute inset-0 size-full object-cover object-[50%_10%]" />
          </div>
          <div>
            <p className="eyebrow !text-butter">Personal styling</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Styling for global people.</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-ivory/75">
              Seminar tomorrow? Interview on Monday? Tell us the occasion and we&apos;ll put the full look together — outfit, bag and accessories. Visit us in Benin City, or get styled remotely wherever you are.
            </p>
            <ul className="mt-7 grid max-w-lg gap-3 text-[14px] sm:grid-cols-2">
              {["In-store fittings at Divine Plaza", "Remote styling over WhatsApp", "Corporate & event wardrobes", "Delivery to any city"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="size-1.5 shrink-0 bg-butter" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/styling" className="btn-light">
                Book a session <ArrowIcon />
              </Link>
              <a href={whatsappLink(`Hello ${brand.name}! I need help styling an outfit.`)} target="_blank" rel="noreferrer" className="btn border border-butter/70 text-butter hover:bg-butter hover:text-wine">
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Fit Studio ---------- */}
      <section className="container-x py-16 lg:py-24">
        <div className="grid items-center gap-10 border border-ink/10 bg-paper p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <SparkIcon className="size-3.5" /> Fit Studio
            </p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">Not sure how it&apos;ll sit on you?</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">Preview any piece on six body types — petite to plus — and in every colour it comes in. We&apos;ll even suggest your size.</p>
            <Link href="/fit-studio" className="btn-outline mt-7">
              Try the Fit Studio
            </Link>
          </div>
          <div className="grid grid-cols-6 items-end bg-sand px-2 pt-6">
            {bodyProfiles
              .filter((b) => b.gender === "women")
              .map((b, i) => (
                <div key={b.id} className="flex flex-col items-center pb-3">
                  <Figure garment="suit" gender="women" body={b} ghost color="#CDBBA0" accent={["#C0913A", "#1E1E1E", "#24365C", "#C0913A", "#1E1E1E", "#24365C"][i]} shadow={false} className="h-[150px] w-auto sm:h-[230px]" />
                  <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.12em] text-muted sm:text-[10px]">{b.sizes}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="From our WhatsApp" title="What our customers say" center />
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* ---------- Visit ---------- */}
      <section className="bg-wine-deep text-ivory">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow !text-butter">Visit the store</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">Come try it on.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ivory/75">{brand.address}.</p>
            <p className="mt-2 text-ivory/75">{brand.hours}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Divine Plaza Uselu Lagos Road Benin City")}`} target="_blank" rel="noreferrer" className="btn-light">
              Get directions
            </a>
            <a href={`tel:+${brand.whatsapp}`} className="btn border border-butter/60 text-butter hover:bg-butter hover:text-wine">
              Call {brand.phoneDisplay}
            </a>
            <a href={brand.tiktok} target="_blank" rel="noreferrer" className="btn border border-butter/60 text-butter hover:bg-butter hover:text-wine">
              Follow {brand.tiktokHandle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
