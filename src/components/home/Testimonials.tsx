// Messages customers sent the store on WhatsApp (shared publicly on the brand's TikTok).


export function Testimonials({ quotes }: { quotes: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {quotes.map((q, i) => (
        <figure key={i} className="flex flex-col border border-ink/10 bg-ivory p-7">
          <div className="text-[13px] tracking-[0.2em] text-wine" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-ink">“{q}”</blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-[12px] text-muted">
            <span className="grid size-8 place-items-center bg-butter font-display text-[12px] font-semibold text-wine">✓</span>
            <span>
              <span className="block font-semibold uppercase tracking-[0.12em] text-ink">Customer</span>
              Sent via WhatsApp
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
