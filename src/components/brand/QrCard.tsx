import { brand } from "@/lib/brand";
import { Monogram, PatternField } from "./Marks";

/** Printable QR card: brand header, QR with the monogram in the middle, the offer and the link. */
export function QrCard({ svg, code, offer, url }: { svg: string; code: string; offer: string; url: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] overflow-hidden bg-wine-deep p-8 text-center text-ivory print:max-w-none">
      <PatternField className="absolute inset-0 size-full text-wine/40" />
      <div className="relative">
        <Monogram className="mx-auto h-10 w-auto text-camel" />
        <p className="mt-4 font-display text-[28px] font-semibold uppercase leading-none tracking-[0.12em]">Shop Timart</p>
        <p className="mt-2 text-[12px] tracking-[0.14em] text-ivory/70">{brand.slogan}</p>
        <div className="relative mx-auto mt-7 w-[240px] bg-ivory p-3">
          <div className="[&_svg]:block [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
          <span className="absolute left-1/2 top-1/2 grid size-[58px] -translate-x-1/2 -translate-y-1/2 place-items-center bg-ivory">
            <Monogram className="h-8 w-auto text-wine" />
          </span>
        </div>
        <p className="mt-7 font-display text-[34px] font-semibold leading-none">{offer}</p>
        <p className="mt-2 text-[14px] text-ivory/80">Scan to shop — applied automatically at checkout</p>
        <p className="mt-5 inline-block border border-camel/60 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-camel">Code {code}</p>
        <p className="mt-4 text-[12px] tracking-[0.08em] text-ivory/60">{url.replace("https://", "")}</p>
      </div>
    </div>
  );
}
