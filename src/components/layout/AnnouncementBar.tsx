"use client";

import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

export function AnnouncementBar() {
  const pathname = usePathname();
  const items = [...brand.announcements, ...brand.announcements];
  if (pathname.startsWith("/admin")) return null;
  return (
    <div className="overflow-hidden bg-wine-deep text-ivory">
      <div className="flex w-max animate-marquee gap-16 py-2.5 text-[11px] uppercase tracking-[0.2em]">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-16 whitespace-nowrap">
            {t}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
