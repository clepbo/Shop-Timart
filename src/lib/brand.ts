/**
 * Single source of truth for brand details.
 * Change the name, contacts and copy here — every page reads from this file.
 */
export const brand = {
  name: "Timart",
  fullName: "Shop Timart",
  tagline: "Modest corporate wear, styled for global people.",
  description:
    "Modest corporate wear and personal styling from Benin City — blazers, suits, sets and everyday elegance for women and men, delivered nationwide.",
  whatsapp: "2349168814108", // 0916 881 4108, international format without "+"
  phoneDisplay: "0916 881 4108",
  email: "hello@shoptimart.com",
  instagram: "https://instagram.com/",
  tiktok: "https://www.tiktok.com/@shop_teemart",
  tiktokHandle: "@shop_teemart",
  address: "Shop 10b Divine Plaza (the blue plaza close to Mat Ice), Uselu–Lagos Road, Benin City, Edo State",
  addressShort: "Divine Plaza, Uselu, Benin City",
  hours: "Mon – Sat · 9am – 7pm",
  currency: "NGN",
  freeDeliveryThreshold: 100000,
  announcements: [
    "Same-day delivery within Benin City",
    "Nationwide delivery in 2–5 working days",
    "Walk-in store: Divine Plaza, Uselu, Benin City",
    "Book a styling session on WhatsApp — 0916 881 4108",
  ],
};

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: brand.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function whatsappLink(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}
