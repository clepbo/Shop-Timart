import type { Metadata } from "next";
import { brand, formatPrice, whatsappLink } from "@/lib/brand";

export const metadata: Metadata = { title: "Help & FAQs" };

// NOTE: policies below are sensible defaults — confirm the details with the store owner.
const faqs = [
  ["Can I see a piece before I buy?", "Yes — visit our walk-in store at Divine Plaza, Uselu, Benin City, or ask on WhatsApp for live photos and videos of any item."],
  ["Do you style clients outside Benin City?", "Absolutely. Send your size, occasion and budget on WhatsApp and we'll style you remotely and deliver to your city."],
  ["How do I pay?", "Pay securely online with card, bank transfer or USSD through Paystack at checkout, or confirm your order with us on WhatsApp."],
  ["Do your sets come complete?", "Each product page lists exactly what's included — for example, the Timart Set comes with blazer, camisole and trousers."],
];

const uk = [
  ["UK 6", "32", "25", "35"],
  ["UK 8", "34", "27", "37"],
  ["UK 10", "36", "29", "39"],
  ["UK 12", "38", "31", "41"],
  ["UK 14", "40", "33", "43"],
  ["UK 16", "42", "35", "45"],
  ["UK 18", "44", "37", "47"],
  ["UK 20", "46", "39", "49"],
];

export default function HelpPage() {
  return (
    <div className="container-x max-w-4xl pb-24 pt-12">
      <p className="eyebrow">Customer care</p>
      <h1 className="display mt-3 text-[46px] sm:text-[64px]">How can we <span className="accent text-camel">help?</span></h1>
      <p className="mt-4 max-w-xl text-muted">
        Can&apos;t find what you need? Chat with us on{" "}
        <a className="text-wine underline underline-offset-4" href={whatsappLink(`Hello ${brand.name}! I have a question.`)} target="_blank" rel="noreferrer">
          WhatsApp ({brand.phoneDisplay})
        </a>
        .
      </p>

      <section id="faqs" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-2xl font-semibold">FAQs</h2>
        <div className="mt-5 divide-y divide-wine/10 border-y border-wine/10">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q} <span className="text-wine transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="delivery" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-2xl font-semibold">Shipping & delivery</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Benin City", "Same day", `Free over ${formatPrice(brand.freeDeliveryThreshold)}`],
            ["Nationwide", "2–5 working days", "Flat rate at checkout"],
            ["Store pickup", "Ready same day", "Divine Plaza, Uselu"],
          ].map(([t, d, n]) => (
            <li key={t} className="border border-wine/15 bg-paper p-5">
              <p className="font-display font-semibold">{t}</p>
              <p className="mt-1 text-[14px] text-wine">{d}</p>
              <p className="mt-1 text-[13px] text-muted">{n}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="sizes" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-2xl font-semibold">Size & care guide</h2>
        <p className="mt-3 text-[14px] text-muted">Body measurements in inches. Between sizes? Size up for a relaxed, modest fit — or try the Fit Studio on any product page.</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-[14px]">
            <thead className="bg-sand text-[12px] uppercase tracking-[0.12em] text-muted">
              <tr>
                {["Size", "Bust", "Waist", "Hip"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uk.map((r) => (
                <tr key={r[0]} className="border-b border-wine/10">
                  {r.map((c, i) => (
                    <td key={i} className={`px-4 py-3 ${i === 0 ? "font-medium" : "text-muted"}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[14px] text-muted">Care: follow the label on each piece. Most suiting is best dry cleaned or hand washed cold; steam blazers rather than ironing directly.</p>
      </section>

      <section id="returns" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-2xl font-semibold">Returns & exchanges</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">Wrong size? Contact us on WhatsApp within 7 days of delivery to arrange an exchange. Items must be unworn, unwashed and have their tags attached.</p>
      </section>
    </div>
  );
}
