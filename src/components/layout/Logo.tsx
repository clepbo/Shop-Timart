import Link from "next/link";
import { brand } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex flex-col items-center leading-none ${className}`} aria-label={`${brand.name} home`}>
      <span className="font-display text-[30px] font-medium uppercase tracking-[0.32em] sm:text-[34px]">{brand.name}</span>
      <span className="mt-1 text-[9px] uppercase tracking-[0.42em] text-muted">Grace · Style · Decency</span>
    </Link>
  );
}
