/**
 * Single source of truth for brand details.
 * Change the name, contacts and copy here — every page reads from this file.
 */
export const brand = {
  name: "Timart",
  tagline: "Decency, beautifully styled.",
  description:
    "Modest, elegant clothing for women and men — plus personal styling for corporate events, weddings, church and every occasion in between.",
  whatsapp: "2348000000000", // international format, no "+"
  email: "hello@timart.ng",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  address: "Lekki Phase 1, Lagos, Nigeria",
  hours: "Mon – Sat · 9am – 6pm",
  currency: "NGN",
  freeDeliveryThreshold: 150000,
  announcements: [
    "Free delivery within Lagos on orders above ₦150,000",
    "Nationwide delivery in 2–5 working days",
    "Book a styling session for your next event",
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
