"use client";

import { useActionState, useMemo, useState } from "react";
import { saveSaleAction } from "../actions";

type Opt = { id: string; label: string };
type Sale = { id: string; name: string; scope: "all" | "category" | "collection" | "products"; targets: string[]; kind: "percent" | "fixed"; value: number; startsAt?: string; endsAt?: string; active: boolean };

const day = (iso?: string) => (iso ? new Date(new Date(iso).getTime() + 3600_000).toISOString().slice(0, 10) : "");
const ngn = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export function SaleForm({ sale, categories, collections, products }: { sale?: Sale; categories: Opt[]; collections: Opt[]; products: (Opt & { price: number })[] }) {
  const [state, action, pending] = useActionState(saveSaleAction, null);
  const [scope, setScope] = useState<Sale["scope"]>(sale?.scope ?? "category");
  const [kind, setKind] = useState<Sale["kind"]>(sale?.kind ?? "percent");
  const [value, setValue] = useState<number>(sale?.value ?? 10);
  const [picked, setPicked] = useState<Set<string>>(new Set(sale?.targets ?? []));
  const [q, setQ] = useState("");

  const example = useMemo(() => {
    const sample = products.find((p) => picked.has(p.id)) ?? products[0];
    if (!sample || !value) return null;
    const off = kind === "percent" ? (sample.price * Math.min(90, value)) / 100 : Math.min(value, sample.price - 1);
    return `${sample.label}: ${ngn(sample.price)} → ${ngn(sample.price - off)}`;
  }, [products, picked, kind, value]);

  const toggle = (id: string) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const scopes: [Sale["scope"], string, string][] = [
    ["products", "Selected products", "Pick one or more pieces"],
    ["category", "Category", "Corporate, Sets, Tops…"],
    ["collection", "Collection", "Women, Men, New arrivals…"],
    ["all", "Whole store", "Every product"],
  ];
  const lists: Record<string, Opt[]> = { category: categories, collection: collections, products: products.filter((p) => p.label.toLowerCase().includes(q.toLowerCase())) };

  return (
    <form action={action} className="mt-5 grid gap-5">
      <input type="hidden" name="id" value={sale?.id ?? ""} />
      <input type="hidden" name="scope" value={scope} />
      <label className="max-w-xl"><span className="label">Sale name *</span><input name="name" required defaultValue={sale?.name} className="field" placeholder="e.g. Easter sale" /></label>

      <fieldset>
        <legend className="label">Applies to *</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {scopes.map(([v, t, n]) => (
            <button type="button" key={v} onClick={() => setScope(v)} aria-pressed={scope === v} className={`border px-4 py-3 text-left transition ${scope === v ? "border-wine bg-sand" : "border-ink/15 hover:border-ink/40"}`}>
              <span className="block text-sm font-semibold">{t}</span>
              <span className="block text-[12px] text-muted">{n}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {scope !== "all" && (
        <fieldset>
          <legend className="label">{scope === "products" ? "Products" : scope === "category" ? "Categories" : "Collections"}</legend>
          {scope === "products" && <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="field mb-2 max-w-sm !py-2" />}
          <div className={`flex flex-wrap gap-2 ${scope === "products" ? "max-h-56 overflow-y-auto" : ""}`}>
            {lists[scope].map((o) => (
              <label key={o.id} className="flex cursor-pointer items-center gap-2 border border-ink/15 px-3 py-1.5 text-sm has-[:checked]:border-wine has-[:checked]:bg-wine has-[:checked]:text-butter">
                <input type="checkbox" name={`targets_${scope}`} value={o.id} checked={picked.has(o.id)} onChange={() => toggle(o.id)} className="sr-only" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        <label><span className="label">Discount *</span><input name="value" type="number" min={1} required value={value || ""} onChange={(e) => setValue(Number(e.target.value))} className="field" /></label>
        <label><span className="label">Type</span>
          <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as Sale["kind"])} className="field"><option value="percent">% off</option><option value="fixed">₦ off each</option></select>
        </label>
        <label><span className="label">Starts</span><input name="startsAt" type="date" defaultValue={day(sale?.startsAt)} className="field" /></label>
        <label><span className="label">Ends</span><input name="endsAt" type="date" defaultValue={day(sale?.endsAt)} className="field" /></label>
      </div>
      {example && <p className="text-sm text-muted">Example: <span className="text-ink">{example}</span></p>}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={sale?.active ?? true} className="accent-wine" /> Active (leave dates empty to run until you pause it)</label>
      {state && !state.ok && <p className="text-sm text-red-700">{state.message}</p>}
      <div className="flex gap-3">
        <button disabled={pending} className="btn-primary">{pending ? "Saving…" : sale ? "Save changes" : "Start sale"}</button>
      </div>
    </form>
  );
}
