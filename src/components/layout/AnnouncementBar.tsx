"use client";

import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

export function AnnouncementBar() {
  const pathname = usePathname();
  const items = [...brand.announcements, ...brand.announcements];
  if (pathname.startsWith("/admin")) return null;
  return (
    <div className="overflow-hidden border-b border-wine/10 bg-butter text-wine">
      <div className="flex w-max animate-marquee gap-16 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-16 whitespace-nowrap">
            {t}
            <span className="text-wine/40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
