/**
 * Everything on the site the owner can edit from /admin/content.
 * Each field has a default (used until she changes it). Headings take an optional
 * "highlight" — the words at the end shown in the Camel accent.
 */
export type FieldType = "text" | "textarea" | "image";

export interface FieldDef {
  label: string;
  type: FieldType;
  default: string;
  help?: string;
}

export interface SectionDef {
  title: string;
  where: string;
  fields: Record<string, FieldDef>;
}

const t = (label: string, d: string, help?: string): FieldDef => ({ label, type: "text", default: d, help });
const a = (label: string, d: string, help?: string): FieldDef => ({ label, type: "textarea", default: d, help });
const img = (label: string, d: string, help?: string): FieldDef => ({ label, type: "image", default: d, help });

export const contentSchema = {
  announcements: {
    title: "Announcement bar",
    where: "The moving strip at the very top of every page",
    fields: {
      items: a(
        "Messages (one per line)",
        ["Same-day delivery within Benin City", "Nationwide delivery in 2–5 working days", "Walk-in store: Divine Plaza, Uselu, Benin City", "Book a styling session on WhatsApp — 0916 881 4108"].join("\n"),
      ),
    },
  },
  hero: {
    title: "Homepage — hero",
    where: "The first thing visitors see",
    fields: {
      eyebrow: t("Small line above the headline", "Modest corporate wear · Benin City"),
      title: t("Headline", "The beauty of every outfit is you in it."),
      highlight: t("Highlighted words", "you in it.", "Must match the end of the headline"),
      body: a("Paragraph", "Blazers, suits and sets for women and men who mean business — modest, polished and styled for the global you. Shop online or visit our store in Benin City."),
      image: img("Portrait image", "/images/studio/founder-cutout.webp", "Best as a cut-out (transparent background PNG/WebP)"),
      badge: t("Image label", "Founder · Shop Timart"),
    },
  },
  categories: {
    title: "Homepage — shop by category",
    where: "Category tiles under the hero",
    fields: {
      eyebrow: t("Small line", "Shop by category"),
      title: t("Heading", "Dress for the room you're walking into"),
      highlight: t("Highlighted words", "walking into"),
      menImage: img("Men tile image", "/images/studio/men-suede-taupe.webp"),
    },
  },
  newIn: {
    title: "Homepage — new arrivals",
    where: "The New arrivals product row",
    fields: {
      eyebrow: t("Small line", "Just in"),
      title: t("Heading", "New arrivals"),
      highlight: t("Highlighted words", "arrivals"),
    },
  },
  signature: {
    title: "Homepage — signature set",
    where: "The colour-story section for the Timart Set",
    fields: {
      eyebrow: t("Small line", "Our signature"),
      title: t("Heading", "The Timart Set."),
      highlight: t("Highlighted words", ""),
      body: a("Paragraph", "A blend of comfort and elegance, specially curated for the working woman. One textured blazer, a camisole and wide-leg trousers — styled two ways, for the office and everywhere after."),
    },
  },
  men: {
    title: "Homepage — for him",
    where: "The men's section with the card deck",
    fields: {
      eyebrow: t("Small line", "For him"),
      title: t("Heading", "Smart, relaxed, never sloppy."),
      highlight: t("Highlighted words", "never sloppy."),
      body: a("Paragraph", "Corduroy and suede-feel jackets that work over a shirt and tie or a simple knit — in rich, easy colours: forest, taupe, chocolate and cream."),
    },
  },
  statement: {
    title: "Homepage — statement band",
    where: "The large phrase on the brown band",
    fields: {
      text: t("Statement", "The beauty of every outfit is you in it."),
      highlight: t("Highlighted words", "you in it."),
    },
  },
  favourites: {
    title: "Homepage — favourites",
    where: "The featured products row",
    fields: {
      eyebrow: t("Small line", "Most loved"),
      title: t("Heading", "Boss lady favourites"),
      highlight: t("Highlighted words", "favourites"),
    },
  },
  styling: {
    title: "Homepage — personal styling",
    where: "The styling section on the brown background",
    fields: {
      eyebrow: t("Small line", "Personal styling"),
      title: t("Heading", "Styling for the global you."),
      highlight: t("Highlighted words", "the global you."),
      body: a("Paragraph", "Seminar tomorrow? Interview on Monday? Tell us the occasion and we'll put the full look together — outfit, bag and accessories. Visit us in Benin City, or get styled remotely wherever you are."),
      points: a("Bullet points (one per line)", ["In-store fittings at Divine Plaza", "Remote styling over WhatsApp", "Corporate & event wardrobes", "Delivery to any city"].join("\n")),
      image: img("Image", "/images/studio/founder-cutout.webp"),
    },
  },
  fit: {
    title: "Homepage — Fit Studio",
    where: "The Fit Studio teaser",
    fields: {
      title: t("Heading", "Not sure how it'll sit on you?"),
      highlight: t("Highlighted words", "on you?"),
      body: a("Paragraph", "Preview any piece on six body types — petite to plus — and in every colour it comes in. We'll even suggest your size."),
    },
  },
  reviews: {
    title: "Homepage — customer reviews",
    where: "The testimonial cards",
    fields: {
      title: t("Heading", "What our customers say"),
      highlight: t("Highlighted words", "say"),
      quotes: a(
        "Quotes (one per line)",
        ["Received and I love them so much ❤️", "Good morning babes. Just opened my package this morning — quality is 🔥", "Good morning dear, I've picked it up. Perfect fit 👌 Thank you!"].join("\n"),
      ),
    },
  },
  visit: {
    title: "Homepage — visit the store",
    where: "The section before the footer",
    fields: {
      title: t("Heading", "Come try it on."),
      highlight: t("Highlighted words", "try it on."),
      hours: t("Opening hours", "Mon – Sat · 9am – 7pm"),
    },
  },
  footer: {
    title: "Footer",
    where: "Bottom of every page",
    fields: {
      about: a("About text", "Shop Timart is a Benin City fashion brand that gives style advice, curates outfits and sells unique clothes and accessories. Every outfit is tailored to fit you."),
    },
  },
  care: {
    title: "Care guide page",
    where: "/care — linked from every product",
    fields: {
      intro: a("Introduction", "Well-made clothes last for years when they're cared for. Here's how we look after ours — and how to keep your Shop Timart pieces looking just like the day you collected them."),
    },
  },
} satisfies Record<string, SectionDef>;

export type ContentKey = keyof typeof contentSchema;
export type SiteContent = { [S in ContentKey]: { [F in keyof (typeof contentSchema)[S]["fields"]]: string } };

export function defaultContent(): SiteContent {
  const out = {} as Record<string, Record<string, string>>;
  for (const [s, def] of Object.entries(contentSchema)) {
    out[s] = {};
    for (const [f, fd] of Object.entries(def.fields)) out[s][f] = fd.default;
  }
  return out as SiteContent;
}

export const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);
