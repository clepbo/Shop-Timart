"use client";

import { useEffect, useRef, useState } from "react";

/** Reveals a sentence word by word when it scrolls into view. Words in `accent` get a highlight class. */
export function WordReveal({ text, accent = [], accentClass = "", className = "", step = 90, onLoad = false }: { text: string; accent?: string[]; accentClass?: string; className?: string; step?: number; onLoad?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(onLoad);
  useEffect(() => {
    if (onLoad) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onLoad]);
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span className={`${shown ? "word-in" : "inline-block opacity-0"} ${accent.includes(w) ? accentClass : ""}`} style={{ animationDelay: `${i * step}ms` }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
