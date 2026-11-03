import { brand } from "./brand";

export const deliveryOptions = [
  { id: "lagos", label: "Lagos — same/next day", fee: (subtotal: number) => (subtotal >= brand.freeDeliveryThreshold ? 0 : 3500) },
  { id: "nationwide", label: "Nationwide — 2–5 working days", fee: () => 7500 },
  { id: "pickup", label: "Store pickup — Lekki studio", fee: () => 0 },
];
