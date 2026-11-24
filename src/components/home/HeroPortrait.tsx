"use client";

import { useRef, useState } from "react";

/** The hero image with soft parallax and floating tags: either a framed photo
 *  (default) or a transparent cut-out on a slowly turning ring. */
export function HeroPortrait({ src, alt, badge, variant = "photo" }: { src: string; alt: string; badge: string; variant?: "photo" | "cutout" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setP({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  const layer = (depth: number) => ({
    transform: `translate3d(${p.x * depth}px, ${p.y * depth}px, 0)`,
    transition: "transform 0.6s cubic-bezier(.22,1,.36,1)",
  });

  const tags = [
    { t: "Blazers & suits", c: "left-[2%] top-[30%]", d: "0s" },
    { t: "Sizes UK 4–20", c: "right-[0%] top-[18%]", d: "1.2s" },
    { t: "Styled in Benin City", c: "left-[6%] top-[62%]", d: "2.1s" },
  ];

  // Around a photo the chips sit off its edges so they don't cover the picture.
  const photoTags = [
    { c: "left-[-16%] top-[16%]" },
    { c: "right-[-14%] top-[46%]" },
    { c: "left-[-20%] top-[72%]" },
  ];

  const chips = tags.map((tag, i) => ({ ...tag, c: variant === "photo" ? photoTags[i].c : tag.c })).map((tag) => (
    <div key={tag.t} className={`absolute z-10 hidden sm:block ${tag.c}`} style={layer(26)}>
      <span className="block animate-[bob_4s_ease-in-out_infinite] rounded-full bg-paper/90 px-4 py-2 text-[12px] font-medium text-wine-deep shadow-[0_8px_24px_-10px_rgba(67,42,26,0.4)] backdrop-blur" style={{ animationDelay: tag.d }}>
        {tag.t}
      </span>
    </div>
  ));

  if (variant === "photo")
    return (
      <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setP({ x: 0, y: 0 })} className="relative mx-auto mb-14 w-full max-w-[480px] px-6 sm:px-10 lg:my-16">
        <div className="relative aspect-[4/5]">
          <div className="absolute inset-0 translate-x-5 translate-y-5 bg-sand" style={layer(-12)} aria-hidden />
          <div className="absolute inset-0 animate-rise overflow-hidden bg-wine-deep shadow-[0_30px_60px_-30px_rgba(46,31,23,0.6)]" style={{ ...layer(8), animationDelay: "250ms" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} fetchPriority="high" className="size-full object-cover" />
          </div>
        </div>
        {chips}
        <span className="absolute -bottom-3 right-0 bg-wine px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-butter">{badge}</span>
      </div>
    );

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => setP({ x: 0, y: 0 })} className="relative mx-auto h-[440px] w-full max-w-[520px] sm:h-[560px] lg:h-[640px]">
      <div className="absolute bottom-0 left-1/2 aspect-square w-[88%] -translate-x-1/2 translate-y-[18%]" style={layer(-14)} aria-hidden>
        <div className="size-full rounded-full bg-sand" />
      </div>
      <div className="absolute bottom-0 left-1/2 aspect-square w-[66%] -translate-x-1/2 translate-y-[8%]" style={layer(-24)} aria-hidden>
        <div className="size-full animate-[spin-slow_40s_linear_infinite] rounded-full border border-dashed border-wine/30" />
      </div>
      <div className="absolute inset-0 animate-rise" style={{ animationDelay: "250ms" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={layer(10)} className="absolute bottom-0 left-1/2 h-[96%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_20px_30px_rgba(67,42,26,0.18)]" />
      </div>
      {chips}
      <span className="absolute bottom-8 right-0 bg-wine px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-butter">{badge}</span>
    </div>
  );
}
