import Link from "next/link";
import { ArrowIcon } from "../Icons";

export function SectionHeading({ eyebrow, title, href, cta, center = false }: { eyebrow: string; title: React.ReactNode; href?: string; cta?: string; center?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 ${center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-[36px] sm:text-[52px] lg:text-[58px]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-wine">
          <span className="link-underline">{cta ?? "View all"}</span>
          <ArrowIcon className="size-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
