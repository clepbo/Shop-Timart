import Link from "next/link";
import { brand } from "@/lib/brand";

/** Placeholder brand mark (ST monogram + wordmark) until the brand has a final logo. */
export function Logo({ className = "", tone = "wine" }: { className?: string; tone?: "wine" | "light" }) {
  const light = tone === "light";
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 leading-none ${className}`} aria-label={`${brand.fullName} home`}>
      <span className={`grid size-10 place-items-center font-display text-[15px] font-semibold tracking-[-0.04em] ${light ? "bg-butter text-wine" : "bg-wine text-butter"}`}>ST</span>
      <span className="flex flex-col">
        <span className={`font-display text-[19px] font-semibold uppercase tracking-[0.2em] ${light ? "text-ivory" : "text-wine"}`}>{brand.name}</span>
        <span className={`mt-1 text-[8.5px] font-medium uppercase tracking-[0.34em] ${light ? "text-ivory/60" : "text-muted"}`}>Modesty Arena</span>
      </span>
    </Link>
  );
}
