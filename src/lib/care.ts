import type { GarmentType, Product } from "./types";

/** Care guide sections shown on /care. Product pages link to the matching one. */
export const careGuides = [
  {
    id: "suiting",
    title: "Suits & blazers",
    icon: "blazer",
    steps: [
      "Dry clean, or hand wash cold if the label allows. Never machine wash structured blazers.",
      "Steam rather than iron. If you must iron, use a pressing cloth on low heat, inside out.",
      "Hang on a wide, shaped hanger so the shoulders keep their line.",
      "Rest a suit for a day between wears and brush it down to lift dust.",
      "Hang trousers by the hem or folded along the crease.",
    ],
  },
  {
    id: "satin",
    title: "Satin, chiffon & silk-feel",
    icon: "drop",
    steps: [
      "Hand wash cold with a gentle detergent, or use a mesh bag on a delicate cycle.",
      "Don't wring or twist — roll in a towel to press the water out.",
      "Dry flat or on a padded hanger, away from direct sun.",
      "Iron inside out on the lowest setting, or steam lightly.",
      "Spray perfume before dressing, not onto the fabric.",
    ],
  },
  {
    id: "knits",
    title: "Knits & vests",
    icon: "knit",
    steps: [
      "Hand wash cold or use a wool cycle. Turn inside out first.",
      "Always dry flat — hanging stretches knitwear out of shape.",
      "Fold to store; never hang knits.",
      "Remove bobbles gently with a fabric comb.",
    ],
  },
  {
    id: "everyday",
    title: "Cotton, linen-look & denim",
    icon: "shirt",
    steps: [
      "Machine wash at 30°C inside out with similar colours.",
      "Wash new and dark pieces separately for the first few washes.",
      "Shake out and hang to dry; take out of the dryer while slightly damp to avoid creases.",
      "Iron cotton while slightly damp; linen-look fabrics respond well to steam.",
    ],
  },
  {
    id: "bags",
    title: "Bags & accessories",
    icon: "bag",
    steps: [
      "Stuff bags with tissue to keep their shape and store them in the dust bag.",
      "Wipe with a soft, dry cloth. Treat leather with a conditioner a few times a year.",
      "Keep away from heat, damp and direct sunlight.",
      "Don't overload — it strains handles and stitching.",
    ],
  },
] as const;

export type CareGuideId = (typeof careGuides)[number]["id"];

export const storageTips = [
  "Keep pieces in a cool, dry, airy wardrobe — not in plastic dry-cleaning bags.",
  "Leave a little space between hangers so fabrics can breathe and don't crease.",
  "Use cedar blocks or lavender sachets to keep moths away.",
  "Empty pockets before hanging to keep the line of the garment clean.",
];

export const stainTips = [
  "Act fast: blot (don't rub) with a clean, damp cloth.",
  "Test any stain remover on an inside seam first.",
  "Oil or makeup: dust with talc or cornflour, leave 15 minutes, brush off, then wash.",
  "On structured or delicate pieces, take it to a dry cleaner and point out the stain.",
];

const byGarment: Record<GarmentType, CareGuideId> = {
  suit: "suiting",
  "skirt-suit": "suiting",
  "mens-suit": "suiting",
  "maxi-dress": "everyday",
  "midi-dress": "everyday",
  kaftan: "everyday",
  "two-piece": "satin",
  jumpsuit: "everyday",
  senator: "everyday",
  "shirt-trousers": "everyday",
  "vest-set": "knits",
};

/** The care guide that best matches a product (or the one the owner picked). */
export function careGuideFor(product: Pick<Product, "garmentType" | "careGuide">) {
  const id = product.careGuide ?? byGarment[product.garmentType] ?? "everyday";
  return careGuides.find((g) => g.id === id) ?? careGuides[3];
}
