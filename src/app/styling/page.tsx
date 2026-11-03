import type { Metadata } from "next";
import { BookingForm } from "./BookingForm";
import { Figure } from "@/components/figure/Figure";
import { bodyProfiles } from "@/lib/bodies";

export const metadata: Metadata = { title: "Personal Styling" };

const services = [
  { name: "Personal Styling Session", price: "From ₦35,000", text: "A 90-minute one-on-one to understand your body, lifestyle and faith — and build looks that feel like you.", g: "midi-dress" as const, c: "#8C9A7E" },
  { name: "Occasion Styling", price: "From ₦50,000", text: "Weddings, owambe, galas, dedications. We source, fit and accessorise your complete look — gele included.", g: "kaftan" as const, c: "#C29A45" },
  { name: "Corporate Wardrobe Edit", price: "From ₦80,000", text: "A capsule of polished, modest workwear for interviews, boardrooms and conferences.", g: "suit" as const, c: "#1E2B47" },
  { name: "Bridal & Family Coordination", price: "Custom quote", text: "Aso-ebi direction and coordinated styling for the couple, family and bridal party.", g: "two-piece" as const, c: "#A99BC4" },
];

const steps = [
  ["Consult", "We learn your shape, style, coverage preferences and the occasion."],
  ["Curate", "Your stylist builds a lookbook from our collection and trusted partners."],
  ["Fit", "Try everything on in-studio or at home, with tailoring as needed."],
  ["Shine", "Show up dressed with intention — we handle the details."],
];

export default function StylingPage() {
  const body = bodyProfiles.find((b) => b.id === "w-curvy")!;
  return (
    <div className="pb-24">
      <section className="container-x grid items-end gap-10 pt-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="pb-6">
          <p className="eyebrow">Personal styling</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            Styled for the <em className="text-wine">moment</em>, true to <em className="text-wine">you</em>.
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted">From corporate events to weddings and Sunday service — our stylists create complete, modest looks that let you walk in with grace.</p>
          <a href="#book" className="btn-primary mt-8">Book a session</a>
        </div>
        <div className="flex items-end justify-center gap-0 rounded-t-[200px] bg-gradient-to-b from-blush/60 to-sand pt-10">
          {(["suit", "kaftan", "maxi-dress"] as const).map((g, i) => (
            <Figure key={g} garment={g} gender="women" body={body} color={["#4E2A45", "#C29A45", "#1F5A4A"][i]} className={`${i === 1 ? "h-[380px]" : "h-[330px]"} w-auto`} />
          ))}
        </div>
      </section>

      <section id="services" className="container-x scroll-mt-28 pt-24">
        <p className="eyebrow">Services</p>
        <h2 className="display mt-3 text-5xl sm:text-6xl">How we can help</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <article key={s.name} className="flex gap-6 overflow-hidden rounded-[24px] bg-paper p-6 sm:p-8">
              <div className="flex-1">
                <p className="text-[12px] uppercase tracking-[0.16em] text-gold">{s.price}</p>
                <h3 className="mt-2 font-display text-3xl">{s.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
              <Figure garment={s.g} gender="women" body={body} color={s.c} shadow={false} className="hidden h-40 w-auto shrink-0 sm:block" />
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pt-24">
        <div className="grid gap-8 rounded-[32px] bg-ink p-8 text-ivory sm:p-12 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <div key={t}>
              <p className="font-display text-5xl text-gold">0{i + 1}</p>
              <p className="mt-3 font-display text-3xl">{t}</p>
              <p className="mt-2 text-sm text-ivory/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="book" className="container-x grid scroll-mt-28 gap-10 pt-24 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Book</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl">Let&apos;s dress your next moment.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">Send a request and a stylist will confirm your session within 24 hours. Prefer to chat? Continue on WhatsApp after booking.</p>
        </div>
        <BookingForm services={services.map((s) => s.name)} />
      </section>
    </div>
  );
}
