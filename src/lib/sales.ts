import "server-only";
import { deleteRecord, getRecord, listRecords, putRecord } from "./store";
import type { Product } from "./types";

export type SaleScope = "all" | "category" | "collection" | "products";

/** Collections a sale can target, besides categories. */
export const saleCollections = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "new", label: "New arrivals" },
  { id: "featured", label: "Most loved (featured)" },
] as const;

export interface SaleRule {
  id: string;
  name: string;
  scope: SaleScope;
  /** Category slugs, collection ids or product ids, depending on scope. */
  targets: string[];
  kind: "percent" | "fixed";
  value: number;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
  createdAt: string;
}

export type SaleStatus = "live" | "scheduled" | "ended" | "paused";

export function saleStatus(r: Pick<SaleRule, "active" | "startsAt" | "endsAt">, now = Date.now()): SaleStatus {
  if (!r.active) return "paused";
  if (r.startsAt && new Date(r.startsAt).getTime() > now) return "scheduled";
  if (r.endsAt && new Date(r.endsAt).getTime() < now) return "ended";
  return "live";
}

function appliesTo(r: SaleRule, p: Product) {
  switch (r.scope) {
    case "all":
      return true;
    case "category":
      return r.targets.includes(p.category);
    case "products":
      return r.targets.includes(p.id);
    case "collection":
      return r.targets.some((t) => (t === "women" || t === "men" ? p.gender === t : t === "new" ? !!p.isNew : t === "featured" ? !!p.featured : false));
  }
}

const discountOf = (price: number, kind: "percent" | "fixed", value: number) =>
  Math.max(0, Math.min(price - 1, kind === "percent" ? Math.round((price * Math.min(90, Math.max(0, value))) / 100) : Math.max(0, value)));

/** The price a shopper pays right now, the "was" price to strike through, and a short label. */
export function priceFor(p: Product, rules: SaleRule[], now = Date.now()) {
  const candidates: { discount: number; label: string }[] = [];
  if (p.sale && p.sale.value > 0 && (!p.sale.endsAt || new Date(p.sale.endsAt).getTime() >= now)) {
    const d = discountOf(p.price, p.sale.kind, p.sale.value);
    candidates.push({ discount: d, label: p.sale.kind === "percent" ? `−${p.sale.value}%` : "Sale" });
  }
  for (const r of rules) {
    if (saleStatus(r, now) !== "live" || !appliesTo(r, p)) continue;
    const d = discountOf(p.price, r.kind, r.value);
    candidates.push({ discount: d, label: r.kind === "percent" ? `−${r.value}%` : r.name });
  }
  const best = candidates.sort((a, b) => b.discount - a.discount)[0];
  if (!best || best.discount <= 0) return { price: p.price, was: p.compareAtPrice, label: p.compareAtPrice ? "Sale" : undefined };
  return { price: p.price - best.discount, was: p.price, label: best.label };
}

export async function listSales() {
  return listRecords<SaleRule>("sales");
}

/** Products as shoppers see them: sale prices applied (no stacking — the best discount wins). */
export async function withSales<T extends Product | null>(items: T[]): Promise<T[]> {
  const rules = await listSales();
  const now = Date.now();
  return items.map((p) => {
    if (!p) return p;
    const { price, was, label } = priceFor(p, rules, now);
    return { ...p, price, compareAtPrice: was, saleLabel: label };
  });
}

export async function saveSale(rule: Omit<SaleRule, "createdAt">) {
  return putRecord("sales", rule.id, rule);
}

export async function getSale(id: string) {
  return getRecord<SaleRule>("sales", id);
}

export async function removeSale(id: string) {
  await deleteRecord("sales", id);
}

/** Catalogue for shoppers (sale prices applied). The admin keeps using getProducts for base prices. */
export async function getShopProducts() {
  const { getProducts } = await import("./store");
  return withSales(await getProducts());
}

export async function getShopProduct(slug: string) {
  const { getProduct } = await import("./store");
  const [p] = await withSales([await getProduct(slug)]);
  return p;
}
