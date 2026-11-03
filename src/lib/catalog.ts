import type { GarmentType } from "./types";

export const categories = [
  { slug: "corporate", name: "Corporate", blurb: "Suits, skirt suits and workwear" },
  { slug: "sets", name: "Sets", blurb: "Coordinated looks, ready to wear" },
  { slug: "tops", name: "Tops & Blouses", blurb: "Easy pieces for work and beyond" },
  { slug: "men", name: "Men", blurb: "Sharp suits, shirts and senator wear" },
] as const;

export const occasions = [
  "Corporate",
  "Church & Faith",
  "Evening",
  "Everyday",
] as const;

export const garmentTypes: { value: GarmentType; label: string; gender: "women" | "men" }[] = [
  { value: "maxi-dress", label: "Maxi dress", gender: "women" },
  { value: "midi-dress", label: "Midi dress", gender: "women" },
  { value: "kaftan", label: "Kaftan / Abaya", gender: "women" },
  { value: "two-piece", label: "Two-piece set (top + skirt)", gender: "women" },
  { value: "suit", label: "Trouser suit (blazer + trousers)", gender: "women" },
  { value: "skirt-suit", label: "Skirt suit (blazer + long skirt)", gender: "women" },
  { value: "jumpsuit", label: "Jumpsuit", gender: "women" },
  { value: "vest-set", label: "Vest & trousers set", gender: "women" },
  { value: "mens-suit", label: "Men's suit", gender: "men" },
  { value: "senator", label: "Senator set", gender: "men" },
  { value: "shirt-trousers", label: "Shirt & trousers", gender: "men" },
];

export const womenSizes = ["UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20", "UK 22"];
export const menSizes = ["S", "M", "L", "XL", "XXL"];
