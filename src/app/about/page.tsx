import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "About" };

const look = (n: string) => `/images/looks/${n}.webp`;

const values = [
  ["Modesty", "Coverage is a choice we celebrate. Every piece is chosen to be decent without being dull."],
  ["Quality", "We're known for delivering quality — fabrics that hold their shape from Monday to Friday."],
  ["Every body", "Sizes from UK 4 to 20, and styling that works with your shape, not against it."],
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <section className="container-x pt-12 text-center">
        <p className="eyebrow">About {brand.fullName}</p>
        <h1 className="display mx-auto mt-4 max-w-3xl text-[38px] sm:text-[52px]">
          A modesty arena for women who <span className="text-wine">lead</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-muted">
          {brand.fullName} is a modest corporate wear store and styling service in Benin City. We dress women — and men — for offices, seminars, interviews and every moment in between, in our walk-in store at Divine Plaza and online across Nigeria.
        </p>
      </section>
      <section className="container-x mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {["cream-suit-2", "blazer-mustard-3", "black-suit", "store"].map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={n} src={look(n)} alt="" className="aspect-[3/4] w-full object-cover object-[50%_32%]" />
        ))}
      </section>
      <section className="container-x mt-16 grid gap-10 md:grid-cols-3">
        {values.map(([t, d]) => (
          <div key={t} className="border-t-2 border-wine pt-6">
            <p className="font-display text-xl font-semibold">{t}</p>
            <p className="mt-3 leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </section>
      <section className="container-x mt-16 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-primary">Shop the collection</Link>
        <a href={brand.tiktok} target="_blank" rel="noreferrer" className="btn-outline">Follow {brand.tiktokHandle}</a>
      </section>
    </div>
  );
}
