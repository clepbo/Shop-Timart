const quotes = [
  { q: "I wore the Adaeze suit to my board presentation and felt completely myself — covered, sharp and confident.", n: "Funmi A.", r: "Lagos" },
  { q: "The Fit Studio showed me the maxi on a body like mine. It arrived and fit exactly how I imagined.", n: "Chiamaka O.", r: "Abuja" },
  { q: "They styled my whole family for my sister's wedding. Elegant, modest, and everyone matched beautifully.", n: "Hauwa B.", r: "Kano" },
];

export function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {quotes.map((t) => (
        <figure key={t.n} className="flex flex-col rounded-[24px] bg-paper p-7 shadow-[0_1px_0_rgba(35,26,22,0.06)]">
          <div className="text-gold" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote className="mt-4 flex-1 font-display text-[23px] leading-snug">“{t.q}”</blockquote>
          <figcaption className="mt-6 text-[12px] uppercase tracking-[0.16em] text-muted">
            {t.n} · {t.r}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
