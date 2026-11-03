import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Figure } from "@/components/figure/Figure";
import { bodyProfiles } from "@/lib/bodies";

export const metadata: Metadata = { title: "Our Story" };

const values = [
  ["Decency", "Coverage is a choice we celebrate. Every piece is cut to be modest without compromise."],
  ["Every body", "We design and preview across UK 6–22, because grace isn't a size."],
  ["Intention", "Fewer, better pieces — made to be worn to work, worship and celebration."],
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <section className="container-x pt-14 text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="display mx-auto mt-4 max-w-5xl text-6xl sm:text-8xl">
          Modesty, made <em className="text-wine">magnificent</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
          {brand.name} began with a simple belief: that you should never have to choose between dressing decently and dressing beautifully. Today we dress women and men across Nigeria for boardrooms, weddings, church and everything in between — and style them for the moments that matter.
        </p>
      </section>
      <section className="container-x mt-16">
        <div className="flex items-end justify-center gap-0 overflow-hidden rounded-[32px] bg-gradient-to-b from-sand to-linen px-4 pt-12">
          {bodyProfiles.filter((b) => b.gender === "women").map((b, i) => (
            <Figure key={b.id} garment={(["maxi-dress", "suit", "kaftan", "two-piece", "midi-dress", "jumpsuit"] as const)[i]} gender="women" body={b} color={["#6B2333", "#1E2B47", "#6B4F3F", "#A99BC4", "#1F5A4A", "#A4553B"][i]} className="h-[220px] w-auto sm:h-[380px]" />
          ))}
        </div>
      </section>
      <section className="container-x mt-20 grid gap-10 md:grid-cols-3">
        {values.map(([t, d]) => (
          <div key={t} className="border-t border-ink/15 pt-6">
            <p className="font-display text-4xl">{t}</p>
            <p className="mt-3 leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </section>
      <section className="container-x mt-20 text-center">
        <Link href="/shop" className="btn-primary">Shop the collection</Link>
      </section>
    </div>
  );
}
