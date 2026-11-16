import Link from "next/link";
import type { Metadata } from "next";
import { careGuides, stainTips, storageTips } from "@/lib/care";
import { getContent } from "@/lib/content";
import { brand, whatsappLink } from "@/lib/brand";
import { Monogram, PatternField } from "@/components/brand/Marks";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Care guide", description: "How to care for your Shop Timart pieces: suits, satin, knits, everyday fabrics and bags." };

const icons: Record<string, React.ReactNode> = {
  blazer: <path d="M8 4 4 7v13h16V7l-4-3M8 4l4 6 4-6M12 10v10" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  knit: <path d="M5 6c2 2 4 2 7 0s5-2 7 0M5 12c2 2 4 2 7 0s5-2 7 0M5 18c2 2 4 2 7 0s5-2 7 0" />,
  shirt: <path d="m8 3-5 3 2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0Z" />,
  bag: <path d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2" />,
};

export default async function CarePage() {
  const c = await getContent();
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden bg-wine-deep text-ivory">
        <PatternField className="absolute inset-0 size-full text-wine/35" />
        <div className="container-x relative py-16 text-center sm:py-24">
          <Monogram className="mx-auto h-10 w-auto text-camel" />
          <p className="eyebrow mt-6 !text-camel">Care guide</p>
          <h1 className="display mx-auto mt-4 max-w-3xl text-[46px] sm:text-[68px]">
            Love it, <span className="accent text-camel">keep it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-ivory/80">{c.care.intro}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {careGuides.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="border border-ivory/25 px-4 py-2 text-[12px] uppercase tracking-[0.14em] transition hover:border-camel hover:text-camel">
                {g.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x mt-16 grid gap-5 md:grid-cols-2">
        {careGuides.map((g, i) => (
          <Reveal key={g.id} delay={(i % 2) * 90}>
            <article id={g.id} className="h-full scroll-mt-28 border-t-2 border-wine bg-paper p-7">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-sand text-wine">
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    {icons[g.icon]}
                  </svg>
                </span>
                <h2 className="font-display text-2xl font-semibold">{g.title}</h2>
              </div>
              <ol className="mt-5 space-y-3">
                {g.steps.map((s, n) => (
                  <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span className="font-display text-lg font-semibold leading-6 text-camel">{n + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        ))}
        <Reveal delay={90}>
          <article className="h-full bg-sand p-7">
            <h2 className="font-display text-2xl font-semibold">Storing your pieces</h2>
            <ul className="mt-5 space-y-3">
              {storageTips.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-camel" />
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </section>

      <section className="container-x mt-5">
        <Reveal>
          <div className="grid gap-8 bg-wine p-8 text-ivory sm:p-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow !text-camel">Stain first-aid</p>
              <h2 className="display mt-3 text-[34px] sm:text-[44px]">Spilled something?</h2>
              <p className="mt-4 text-ivory/75">Don&apos;t panic. Most marks come out if you treat them quickly and gently.</p>
              <a href={whatsappLink(`Hello ${brand.name}! I need care advice for a piece I bought.`)} target="_blank" rel="noreferrer" className="btn-light mt-7">
                Ask us on WhatsApp
              </a>
            </div>
            <ul className="space-y-4">
              {stainTips.map((s, n) => (
                <li key={s} className="flex gap-4 border-b border-ivory/15 pb-4 text-[15px] leading-relaxed text-ivory/85">
                  <span className="font-display text-xl font-semibold text-camel">0{n + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <p className="container-x mt-10 text-center text-sm text-muted">
        Always check the care label inside each piece first — it has the final word. <Link href="/shop" className="text-wine underline underline-offset-4">Back to the shop</Link>
      </p>
    </div>
  );
}
