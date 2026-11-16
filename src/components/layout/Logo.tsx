import Link from "next/link";
import { brand } from "@/lib/brand";
import { Monogram } from "../brand/Marks";

/**
 * Monogram + wordmark lock-up, set from the brand guidelines (Alyamama wordmark,
 * "Confidence in style" tagline). Swap for the official logo files when they arrive.
 */
export function Logo({ className = "", tone = "wine" }: { className?: string; tone?: "wine" | "light" }) {
  const light = tone === "light";
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 leading-none ${className}`} aria-label={`${brand.fullName} home`}>
      <Monogram className={`h-8 w-auto transition-transform duration-500 group-hover:-rotate-6 ${light ? "text-ivory" : "text-wine"}`} />
      <span className="flex flex-col">
        <span className={`font-display text-[18px] font-semibold uppercase leading-none tracking-[0.12em] ${light ? "text-ivory" : "text-ink"}`}>Shop Timart</span>
        <span className={`mt-1.5 text-[10px] tracking-[0.12em] ${light ? "text-ivory/65" : "text-muted"}`}>{brand.slogan}</span>
      </span>
    </Link>
  );
}
