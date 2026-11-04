"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, whatsappLink } from "@/lib/brand";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "../Icons";
import { NewsletterForm } from "./NewsletterForm";
import { Logo } from "./Logo";
import { FashionFrieze } from "./FashionFrieze";

const columns: { title: string; links: [string, string][] }[] = [
  { title: "Quick links", links: [["Home", "/"], ["Shop all", "/shop"], ["Corporate", "/shop?category=corporate"], ["Men", "/shop?gender=men"], ["About us", "/about"]] },
  { title: "Customer care", links: [["FAQs", "/help#faqs"], ["Shipping & delivery", "/help#delivery"], ["Size & care guide", "/help#sizes"], ["Track your order", whatsappLink(`Hello ${brand.name}! I'd like to track my order.`)]] },
  { title: "Services", links: [["Personal styling", "/styling"], ["Remote styling", "/styling#services"], ["Fit Studio", "/fit-studio"], ["Returns & exchanges", "/help#returns"]] },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="mt-auto bg-wine-deep px-0 pt-0 sm:p-6 lg:p-10">
      <div className="overflow-hidden bg-sand text-ink">
        <div className="container-x pt-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <Logo />
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-muted">
                {brand.name} is a modest corporate wear store and styling service in Benin City. <span className="font-medium text-wine">The beauty of every outfit is you</span> — we simply help it show.
              </p>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-wine-deep">Newsletter</p>
              <NewsletterForm tone="light" />
              <p className="mt-3 text-[13px] leading-relaxed text-muted">New arrivals, styling notes and exclusive offers — once a week, never more.</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-10 border-t border-wine/15 pt-10 lg:grid-cols-4">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="font-display text-[15px] font-semibold text-wine-deep">{c.title}</p>
                <ul className="mt-4 space-y-2.5 text-[14px] text-muted">
                  {c.links.map(([l, h]) => (
                    <li key={l}>
                      {h.startsWith("http") ? (
                        <a href={h} target="_blank" rel="noreferrer" className="transition hover:text-wine">
                          {l}
                        </a>
                      ) : (
                        <Link href={h} className="transition hover:text-wine">
                          {l}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 lg:col-span-1">
              <p className="font-display text-[15px] font-semibold text-wine-deep">Connect with us</p>
              <ul className="mt-4 space-y-2.5 text-[14px] text-muted">
                <li>
                  <a href={`mailto:${brand.email}`} className="hover:text-wine">
                    {brand.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:+${brand.whatsapp}`} className="hover:text-wine">
                    {brand.phoneDisplay}
                  </a>
                </li>
                <li>{brand.addressShort}</li>
              </ul>
              <div className="mt-5 flex gap-3">
                {[
                  [brand.instagram, <InstagramIcon key="i" className="size-[18px]" />, "Instagram"],
                  [brand.tiktok, <TikTokIcon key="t" className="size-[18px]" />, "TikTok"],
                  [`https://wa.me/${brand.whatsapp}`, <WhatsAppIcon key="w" className="size-[18px]" />, "WhatsApp"],
                ].map(([href, icon, label]) => (
                  <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid size-11 place-items-center rounded-full bg-paper text-wine shadow-[0_1px_2px_rgba(67,42,26,0.12)] transition hover:bg-wine hover:text-butter">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-12 border-t border-wine/15 py-6 text-center text-[13px] text-muted">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
        <FashionFrieze className="block h-[110px] w-full sm:h-[150px] lg:h-[176px]" />
      </div>
    </footer>
  );
}
