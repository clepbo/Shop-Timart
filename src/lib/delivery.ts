import { brand } from "./brand";

export const deliveryOptions = [
  { id: "benin", label: "Benin City — same day", fee: (subtotal: number) => (subtotal >= brand.freeDeliveryThreshold ? 0 : 2000) },
  { id: "nationwide", label: "Nationwide — 2–5 working days", fee: () => 6000 },
  { id: "pickup", label: "Pick up — Divine Plaza, Uselu", fee: () => 0 },
];
