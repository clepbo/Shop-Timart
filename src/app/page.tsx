import Link from "next/link";
import { getProducts } from "@/lib/store";
import { bodyProfiles } from "@/lib/bodies";
import { brand, whatsappLink } from "@/lib/brand";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductArt } from "@/components/shop/ProductArt";
import { Figure } from "@/components/figure/Figure";
import { ArrowIcon, SparkIcon, WhatsAppIcon, TikTokIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

const look = (n: string) => `/images/looks/${n}.webp`;

const perks = [
  ["Walk-in store", "Divine Plaza, Uselu, Benin City"],
  ["Same-day delivery", "Anywhere in Benin City"],
  ["Nationwide shipping", "2–5 working days"],
  ["Styling on WhatsApp", brand.phoneDisplay],
];

const tiktokLooks = ["cream-suit-2", "blazer-mustard-2", "black-suit", "denim-blazer", "mustard-suit", "vest-burgundy"];

export default async function Home() {
  const products = await getProducts();
  const newIn = products.filter((p) => p.isNew).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const men = products.find((p) => p.gender === "men");
  const timartSet = products.find((p) => p.slug === "the-timart-set");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-paper">
        <div className="container-x grid grid-cols-1 gap-8 pb-14 pt-8 lg:grid-cols-[1.15fr_0.85fr_0.85fr] lg:gap-5 lg:pb-20">
          <div className="flex animate-rise flex-col justify-center bg-sand px-6 py-10 sm:px-10 lg:py-14">
            <p className="eyebrow">Modesty Arena · Benin City</p>
            <h1 className="display mt-5 text-[40px] text-ink sm:text-[54px] xl:text-[62px]">
              Corporate wear that covers you in <span className="text-wine">confidence.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
              Blazers, suits and sets for women who mean business — modest, polished and styled for global people. Shop online or walk into our store.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop the collection <ArrowIcon />
              </Link>
              <a href={whatsappLink(`Hello ${brand.name}! I'd like to book a styling session.`)} target="_blank" rel="noreferrer" className="btn-outline">
                <WhatsAppIcon className="size-4" /> Book styling
              </a>
            </div>
            <p className="mt-8 text-[12px] text-muted">
              Sizes UK 4–20 · From <span className="font-semibold text-wine">₦16,000</span>
            </p>
          </div>

          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:contents">
            <Link href="/shop/ivory-power-suit" className="group relative block aspect-[3/5] w-[72%] shrink-0 overflow-hidden bg-sand sm:w-auto lg:aspect-auto">
              <video src="/video/cream-suit.mp4" poster={look("cream-suit")} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover object-[50%_32%]" aria-label="Ivory Power Suit being worn in our store" />
              <span className="absolute bottom-0 left-0 bg-paper px-4 py-3 text-[13px] font-medium">
                Ivory Power Suit <span className="ml-1 font-semibold text-wine">₦54,000</span>
              </span>
            </Link>
            <div className="grid w-[72%] shrink-0 grid-rows-2 gap-3 sm:w-auto lg:gap-5">
              <Link href="/shop/the-timart-set" className="group relative block min-h-[220px] overflow-hidden bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={look("blazer-mustard")} alt="The Timart Set — beige blazer with mustard trousers" className="absolute inset-0 size-full object-cover object-[50%_20%] transition duration-700 group-hover:scale-105" />
                <span className="absolute bottom-0 left-0 bg-paper px-4 py-2.5 text-[12px] font-medium">The Timart Set</span>
              </Link>
              <Link href="/shop/boss-lady-black-suit" className="group relative block min-h-[220px] overflow-hidden bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={look("black-suit")} alt="Boss Lady Black Suit with silk scarf" className="absolute inset-0 size-full object-cover object-[50%_25%] transition duration-700 group-hover:scale-105" />
                <span className="absolute bottom-0 left-0 bg-paper px-4 py-2.5 text-[12px] font-medium">Boss Lady Suit</span>
              </Link>
            </div>
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
            { href: "/shop?category=corporate", name: "Corporate", sub: "Suits & blazers", img: look("cream-suit-3") },
            { href: "/shop?category=sets", name: "Sets", sub: "Ready-to-wear looks", img: look("denim-blazer") },
            { href: "/shop?category=tops", name: "Tops & Blouses", sub: "From ₦18,000", img: look("orange-top") },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group relative block aspect-[3/4] overflow-hidden bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt="" className="absolute inset-0 size-full object-cover object-[50%_32%] transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 text-white">
                <p className="font-display text-xl font-semibold">{c.name}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/80">
                  {c.sub} <ArrowIcon className="size-3.5 transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
          <Link href="/shop?gender=men" className="group relative block aspect-[3/4] overflow-hidden bg-wine">
            {men && (
              <ProductArt garmentType={men.garmentType} gender="men" colour={men.colors[1] ?? men.colors[0]} tinted={false} className="absolute inset-0 pt-6 opacity-90 transition duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-5 text-butter">
              <p className="font-display text-xl font-semibold">Men</p>
              <p className="mt-0.5 flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-butter/80">
                Suits & shirts <ArrowIcon className="size-3.5 transition group-hover:translate-x-1" />
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

      {/* ---------- Signature set ---------- */}
      {timartSet && (
        <section className="bg-wine text-ivory">
          <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3">
              <div className="relative col-span-1 row-span-2 aspect-[9/16] overflow-hidden bg-wine-deep">
                <video src="/video/timart-set.mp4" poster={look("blazer-black")} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" aria-label="The Timart Set styled two ways" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={look("blazer-mustard-2")} alt="" className="aspect-[9/8] size-full object-cover object-[50%_32%]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={look("blazer-black")} alt="" className="aspect-[9/8] size-full object-cover object-[50%_15%]" />
            </div>
            <div>
              <p className="eyebrow !text-butter">Our signature</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">Introducing the Timart Set.</h2>
              <p className="mt-5 max-w-md leading-relaxed text-ivory/75">
                A blend of comfort and elegance, specially curated for you. One textured blazer, a camisole and wide-leg trousers — styled two ways, for the office and everywhere after.
              </p>
              <dl className="mt-8 grid max-w-sm grid-cols-3 gap-4 border-t border-ivory/15 pt-6 text-sm">
                <div>
                  <dt className="text-ivory/60">Price</dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-butter">₦35,000</dd>
                </div>
                <div>
                  <dt className="text-ivory/60">Sizes</dt>
                  <dd className="mt-1 font-display text-xl font-semibold">6–20</dd>
                </div>
                <div>
                  <dt className="text-ivory/60">Includes</dt>
                  <dd className="mt-1 font-display text-xl font-semibold">3 pcs</dd>
                </div>
              </dl>
              <Link href={`/shop/${timartSet.slug}`} className="btn-light mt-9">
                Shop the set <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Featured ---------- */}
      <section className="container-x py-16 lg:py-24">
        <SectionHeading eyebrow="Most loved" title="Boss lady favourites" href="/shop" />
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Styling ---------- */}
      <section className="bg-sand">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={look("cream-suit-3")} alt="A client styled in the Ivory Power Suit" className="absolute inset-0 size-full object-cover object-[50%_32%]" />
          </div>
          <div>
            <p className="eyebrow">Personal styling</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Styling for global people.</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted">
              Seminar tomorrow? Interview on Monday? Tell us the occasion and we&apos;ll put the full look together — outfit, bag and accessories. Visit us in Benin City, or get styled remotely wherever you are.
            </p>
            <ul className="mt-7 grid max-w-lg gap-3 text-[14px] sm:grid-cols-2">
              {["In-store fittings at Divine Plaza", "Remote styling over WhatsApp", "Corporate & event wardrobes", "Delivery to any city"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="size-1.5 shrink-0 bg-wine" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/styling" className="btn-primary">
                Book a session <ArrowIcon />
              </Link>
              <a href={whatsappLink(`Hello ${brand.name}! I need help styling an outfit.`)} target="_blank" rel="noreferrer" className="btn-outline">
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Fit Studio ---------- */}
      <section className="container-x py-16 lg:py-24">
        <div className="grid items-center gap-10 border border-ink/10 p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr]">
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
                  <Figure garment="suit" gender="women" body={b} color="#CDBBA0" accent={["#C0913A", "#1E1E1E", "#24365C", "#C0913A", "#1E1E1E", "#24365C"][i]} shadow={false} className="h-[150px] w-auto sm:h-[230px]" />
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

      {/* ---------- TikTok ---------- */}
      <section className="container-x py-16 lg:py-24">
        <SectionHeading eyebrow={brand.tiktokHandle} title="Outfit of the day, every day" href={brand.tiktok} cta="Follow on TikTok" />
        <div className="mt-10 grid grid-cols-3 gap-2 lg:grid-cols-6 lg:gap-3">
          {tiktokLooks.map((n) => (
            <a key={n} href={brand.tiktok} target="_blank" rel="noreferrer" className="group relative block aspect-[9/14] overflow-hidden bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={look(n)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_32%] transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-wine/0 text-transparent transition group-hover:bg-wine/50 group-hover:text-butter">
                <TikTokIcon className="size-7" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- Visit ---------- */}
      <section className="bg-wine-deep text-ivory">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="eyebrow !text-butter">Visit the store</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">Come try it on.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ivory/75">{brand.address}.</p>
            <p className="mt-2 text-ivory/75">{brand.hours}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Divine Plaza Uselu Lagos Road Benin City")}`} target="_blank" rel="noreferrer" className="btn-light">
                Get directions
              </a>
              <a href={`tel:+${brand.whatsapp}`} className="btn border border-butter/60 text-butter hover:bg-butter hover:text-wine">
                Call {brand.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={look("store")} alt="Inside the Timart store" className="aspect-[4/5] size-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={look("blazer-mustard-3")} alt="" className="aspect-[4/5] size-full object-cover object-[50%_32%]" />
          </div>
        </div>
      </section>
    </>
  );
}
