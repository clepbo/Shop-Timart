import type { Metadata } from "next";
import { BookingForm } from "./BookingForm";
import { brand, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Personal Styling" };

const studio = (n: string) => `/images/studio/${n}.webp`;

const services = [
  { name: "In-store styling", text: "Walk into our Benin City store and we'll pull, fit and style complete looks for you — blazer, trousers, bag and accessories." },
  { name: "Remote styling", text: "Not in Benin City? Send your size, occasion and budget on WhatsApp. We style you over video and deliver anywhere in Nigeria." },
  { name: "Event & seminar looks", text: "Conferences, interviews, seminars and church programmes — one coordinated outfit, ready to wear on the day." },
  { name: "Corporate wardrobe", text: "A capsule of modest workwear that mixes and matches for weeks. Ideal for new jobs and promotions." },
];

const steps = [
  ["Tell us", "Your occasion, size, colours you love and your budget."],
  ["We curate", "We pull options from the store and send you looks."],
  ["Try on", "In store, or delivered to you with free exchange on size."],
  ["Show up", "Walk in dressed with intention — we handle the details."],
];

export default function StylingPage() {
  return (
    <div className="pb-24">
      <section className="bg-paper">
        <div className="container-x grid items-stretch gap-6 pb-12 pt-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center bg-sand px-6 py-10 sm:px-10">
            <p className="eyebrow">Personal styling</p>
            <h1 className="display mt-4 text-[38px] sm:text-[52px]">
              Styling for <span className="text-wine">global people.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
              Whether you&apos;re in Benin City or miles away, we&apos;ll put together the full look for your next corporate event, seminar or special day — modest, polished and true to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="btn-primary">Book a session</a>
              <a href={whatsappLink(`Hello ${brand.name}! I'd like to book a styling session.`)} target="_blank" rel="noreferrer" className="btn-outline">
                <WhatsAppIcon className="size-4" /> WhatsApp {brand.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden bg-[#7e0913]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studio("founder")} alt={`${brand.name}'s founder and lead stylist`} className="absolute inset-0 size-full object-cover object-[50%_15%]" />
            <span className="absolute bottom-0 left-0 bg-butter px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wine">Your stylist · Founder, {brand.name}</span>
          </div>
        </div>
      </section>

      <section id="services" className="container-x scroll-mt-28 pt-16">
        <p className="eyebrow">How we can help</p>
        <h2 className="display mt-3 text-[28px] sm:text-[38px]">Styling services</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article key={s.name} className="border-t-2 border-wine bg-paper">
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">Sessions are confirmed on WhatsApp. Card payment for styling sessions is coming soon.</p>
      </section>

      <section className="container-x pt-16">
        <div className="grid gap-8 bg-wine p-8 text-ivory sm:p-12 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <div key={t}>
              <p className="font-display text-3xl font-semibold text-butter">0{i + 1}</p>
              <p className="mt-3 font-display text-xl font-semibold">{t}</p>
              <p className="mt-2 text-sm text-ivory/70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="book" className="container-x grid scroll-mt-28 gap-10 pt-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Book</p>
          <h2 className="display mt-3 text-[28px] sm:text-[38px]">Let&apos;s dress your next moment.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">Send a request and we&apos;ll confirm your session on WhatsApp within 24 hours.</p>
        </div>
        <BookingForm services={services.map((s) => s.name)} />
      </section>
    </div>
  );
}
