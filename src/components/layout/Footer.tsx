"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "../Icons";
import { NewsletterForm } from "./NewsletterForm";
import { Logo } from "./Logo";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="mt-auto bg-wine-deep text-ivory">
      <div className="container-x grid gap-14 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/65">{brand.description}</p>
          <div className="mt-8">
            <p className="eyebrow !text-butter">Join our list</p>
            <p className="mt-2 text-sm text-ivory/65">New arrivals, styling notes and private sales — once a week, never more.</p>
            <NewsletterForm />
          </div>
        </div>
        <FooterCol title="Shop" links={[["Shop all", "/shop"], ["Corporate", "/shop?category=corporate"], ["Sets", "/shop?category=sets"], ["Tops & Blouses", "/shop?category=tops"], ["Men", "/shop?gender=men"]]} />
        <FooterCol title="Services" links={[["Personal styling", "/styling"], ["Remote styling", "/styling#services"], ["Fit Studio", "/fit-studio"], ["About us", "/about"], ["Follow on TikTok", brand.tiktok]]} />
        <div>
          <p className="eyebrow !text-butter">Visit & contact</p>
          <ul className="mt-5 space-y-3 text-sm text-ivory/65">
            <li>{brand.address}</li>
            <li>{brand.hours}</li>
            <li>
              <a className="link-underline" href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer">
                WhatsApp {brand.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="link-underline" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            {[
              [brand.instagram, <InstagramIcon key="i" />, "Instagram"],
              [brand.tiktok, <TikTokIcon key="t" />, "TikTok"],
              [`https://wa.me/${brand.whatsapp}`, <WhatsAppIcon key="w" />, "WhatsApp"],
            ].map(([href, icon, label]) => (
              <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid size-10 place-items-center border border-ivory/20 transition hover:border-butter hover:text-butter">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-[12px] text-ivory/45 sm:flex-row">
          <span>© {new Date().getFullYear()} {brand.name}. Modesty Arena.</span>
          <span>Made with care in Benin City</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow !text-butter">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-ivory/65">
        {links.map(([l, h]) => (
          <li key={l}>
            <Link href={h} className="link-underline hover:text-ivory">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
