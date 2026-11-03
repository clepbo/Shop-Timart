import type { GarmentType } from "./types";

export const categories = [
  { slug: "dresses", name: "Dresses", blurb: "Flowing maxis and graceful midis" },
  { slug: "corporate", name: "Corporate", blurb: "Polished suits for the boardroom" },
  { slug: "sets", name: "Sets & Jumpsuits", blurb: "Effortless coordinated looks" },
  { slug: "abayas-kaftans", name: "Abayas & Kaftans", blurb: "Covered, comfortable, regal" },
  { slug: "men", name: "Men", blurb: "Senator wear and sharp classics" },
] as const;

export const occasions = [
  "Corporate",
  "Church & Faith",
  "Weddings & Owambe",
  "Evening",
  "Everyday",
] as const;

export const garmentTypes: { value: GarmentType; label: string; gender: "women" | "men" }[] = [
  { value: "maxi-dress", label: "Maxi dress", gender: "women" },
  { value: "midi-dress", label: "Midi dress", gender: "women" },
  { value: "kaftan", label: "Kaftan / Abaya", gender: "women" },
  { value: "two-piece", label: "Two-piece set (top + skirt)", gender: "women" },
  { value: "suit", label: "Suit (blazer + trousers)", gender: "women" },
  { value: "jumpsuit", label: "Jumpsuit", gender: "women" },
  { value: "senator", label: "Senator / Kaftan set", gender: "men" },
  { value: "shirt-trousers", label: "Shirt & trousers", gender: "men" },
];

export const womenSizes = ["UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20", "UK 22"];
export const menSizes = ["S", "M", "L", "XL", "XXL"];
