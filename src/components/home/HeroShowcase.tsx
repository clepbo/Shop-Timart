"use client";

import { useEffect, useState } from "react";
import { Figure } from "../figure/Figure";
import { bodyProfiles, skinTones } from "@/lib/bodies";

const palettes = [
  { name: "Wine", hex: "#6B2333" },
  { name: "Sage", hex: "#8C9A7E" },
  { name: "Midnight", hex: "#1F2A44" },
  { name: "Sand", hex: "#C9B08F" },
];
const trio = ["w-petite", "w-curvy", "w-plus"].map((id) => bodyProfiles.find((b) => b.id === id)!);

/** Hero visual: one dress, three bodies, colours cycling — the Fit Studio promise at a glance. */
export function HeroShowcase() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % palettes.length), 2800);
    return () => clearInterval(t);
  }, []);
  const c = palettes[i];

  return (
    <div className="relative">
      <div className="absolute inset-x-[6%] bottom-[60px] top-[8%] rounded-t-full bg-gradient-to-b from-blush/70 to-sand" aria-hidden />
      <div className="relative flex items-end justify-center gap-0 px-2 pt-6">
        {trio.map((b, k) => (
          <div key={b.id} className={`flex flex-col items-center ${k === 1 ? "z-10 -mx-3" : ""}`}>
            <Figure
              garment="maxi-dress"
              gender="women"
              body={b}
              color={c.hex}
              skin={skinTones[k % skinTones.length].hex}
              className={`${k === 1 ? "h-[280px] sm:h-[460px]" : "h-[240px] sm:h-[400px]"} w-auto transition-all duration-700`}
              title={`Amara maxi dress in ${c.name} on ${b.label} body`}
            />
          </div>
        ))}
      </div>
      <div className="relative mx-auto mt-5 flex w-fit items-center justify-center gap-3 rounded-full bg-paper px-5 py-2.5 shadow-[0_10px_30px_-12px_rgba(35,26,22,0.25)]">
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted">One dress · every body</span>
        <span className="h-4 w-px bg-ink/15" />
        {palettes.map((p, k) => (
          <button key={p.name} onClick={() => setI(k)} aria-label={p.name} className={`size-4 rounded-full transition ${k === i ? "scale-125 ring-1 ring-ink ring-offset-2 ring-offset-ivory" : ""}`} style={{ background: p.hex }} />
        ))}
      </div>
    </div>
  );
}
