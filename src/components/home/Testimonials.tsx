// Messages customers sent the store on WhatsApp (shared publicly on the brand's TikTok).
const quotes = [
  { q: "Received and I love them so much ❤️", n: "Customer" },
  { q: "Good morning babes. Just opened my package this morning — quality is 🔥", n: "Customer" },
  { q: "Good morning dear, I've picked it up. Perfect fit 👌 Thank you!", n: "Customer" },
];

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {quotes.map((t, i) => (
        <figure key={i} className="flex flex-col border border-ink/10 bg-ivory p-7">
          <div className="text-[13px] tracking-[0.2em] text-wine" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-ink">“{t.q}”</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-[12px] text-muted">
            <span className="grid size-8 place-items-center bg-butter font-display text-[12px] font-semibold text-wine">✓</span>
            <span>
              <span className="block font-semibold uppercase tracking-[0.12em] text-ink">{t.n}</span>
              Sent via WhatsApp
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
