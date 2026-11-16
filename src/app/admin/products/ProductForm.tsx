"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Colorway, GarmentType, Product } from "@/lib/types";
import { categories, garmentTypes, menSizes, occasions, womenSizes } from "@/lib/catalog";
import { bodiesFor } from "@/lib/bodies";
import { Figure } from "@/components/figure/Figure";
import { saveProductAction } from "../actions";
import { careGuides } from "@/lib/care";

const presetColours: Colorway[] = [
  { name: "Wine", hex: "#6B2333" },
  { name: "Emerald", hex: "#1F5A4A" },
  { name: "Navy", hex: "#1E2B47" },
  { name: "Camel", hex: "#B48A5A" },
  { name: "Black", hex: "#1E1E1E" },
  { name: "Ivory", hex: "#E6DFD1" },
  { name: "Sage", hex: "#8C9A7E" },
  { name: "Lilac", hex: "#A99BC4" },
  { name: "Mustard", hex: "#C9962E" },
  { name: "Dusty Rose", hex: "#C08A88" },
];

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProductAction, null);
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [saleOn, setSaleOn] = useState(!!product?.sale);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  const cancel = () => {
    if (dirty && !window.confirm("Discard your changes?")) return;
    setDirty(false);
    router.push("/admin");
  };
  const [garment, setGarment] = useState<GarmentType>(product?.garmentType ?? "maxi-dress");
  const [colors, setColors] = useState<Colorway[]>(product?.colors ?? [presetColours[0]]);
  const [preview, setPreview] = useState<string | undefined>(product?.image);
  const [active, setActive] = useState(0);
  const gender = garmentTypes.find((g) => g.value === garment)!.gender;
  const sizes = gender === "women" ? womenSizes : menSizes;
  const bodies = bodiesFor(gender);
  const c = colors[active] ?? colors[0];

  const updateColour = (i: number, patch: Partial<Colorway>) => setColors((cs) => cs.map((x, k) => (k === i ? { ...x, ...patch } : x)));

  return (
    <form action={action} className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]" onChange={() => setDirty(true)}>
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="colors" value={JSON.stringify(colors)} />

      <div className="space-y-6">
        {/* Photo */}
        <section className="rounded-md bg-paper p-6">
          <h2 className="font-display text-2xl">1 · Product photo</h2>
          <p className="mt-1 text-sm text-muted">Upload one clear photo of the garment — flat-lay, on a hanger or on a mannequin, against a plain background. Our AI dresses it on every body profile for you.</p>
          <label className="mt-4 flex cursor-pointer items-center gap-5 rounded-md border border-dashed border-ink/25 p-4 transition hover:border-wine">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-28 w-24 rounded-lg object-cover" />
            ) : (
              <div className="grid h-28 w-24 place-items-center rounded-lg bg-sand text-2xl text-muted">+</div>
            )}
            <div className="text-sm">
              <p className="font-medium">{preview ? "Replace photo" : "Choose a photo"}</p>
              <p className="text-muted">JPG, PNG or WEBP · up to 10MB</p>
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          </label>
        </section>

        {/* Details */}
        <section className="grid gap-4 rounded-md bg-paper p-6 sm:grid-cols-2">
          <h2 className="font-display text-xl sm:col-span-2">2 · Details</h2>
          <label className="sm:col-span-2"><span className="label">Name *</span><input name="name" required defaultValue={product?.name} className="field" placeholder="e.g. Amara Pleated Maxi Dress" /></label>
          <label>
            <span className="label">Garment type *</span>
            <select name="garmentType" value={garment} onChange={(e) => setGarment(e.target.value as GarmentType)} className="field">
              {garmentTypes.map((g) => <option key={g.value} value={g.value}>{g.label} — {g.gender}</option>)}
            </select>
          </label>
          <label>
            <span className="label">Category</span>
            <select name="category" defaultValue={product?.category ?? (gender === "men" ? "men" : "dresses")} className="field">
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <label><span className="label">Price (₦) *</span><input name="price" type="number" min={0} required defaultValue={product?.price} className="field" /></label>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 pb-3 text-sm">
              <input type="checkbox" name="saleOn" checked={saleOn} onChange={(e) => setSaleOn(e.target.checked)} className="accent-wine" /> Put this product on sale
            </label>
          </div>
          {saleOn && (
            <div className="grid gap-3 border border-wine/25 bg-sand/60 p-4 sm:col-span-2 sm:grid-cols-3">
              <label><span className="label">Discount</span><input name="saleValue" type="number" min={1} required defaultValue={product?.sale?.value ?? 10} className="field" /></label>
              <label><span className="label">Type</span>
                <select name="saleKind" defaultValue={product?.sale?.kind ?? "percent"} className="field"><option value="percent">% off</option><option value="fixed">₦ off</option></select>
              </label>
              <label><span className="label">Sale ends</span><input name="saleEndsAt" type="date" defaultValue={product?.sale?.endsAt ? new Date(new Date(product.sale.endsAt).getTime() + 3600_000).toISOString().slice(0, 10) : ""} className="field" /></label>
              <p className="text-[12px] text-muted sm:col-span-3">The shop shows the reduced price with the original crossed out. For sales across a category or the whole store, use <a href="/admin/sales" className="text-wine underline">Sales</a> — the biggest discount wins.</p>
            </div>
          )}
          <label className="sm:col-span-2"><span className="label">Description</span><textarea name="description" rows={3} defaultValue={product?.description} className="field" /></label>
          <label className="sm:col-span-2"><span className="label">Details (one per line)</span><textarea name="details" rows={3} defaultValue={product?.details.join("\n")} className="field" placeholder={"Fully lined\nConcealed back zip"} /></label>
          <label className="sm:col-span-2"><span className="label">Care instructions (one per line)</span><textarea name="care" rows={3} defaultValue={product?.care?.join("\n")} className="field" placeholder={"Dry clean only\nSteam, don't iron\nHang on a shaped hanger"} /><span className="mt-1 block text-[12px] text-muted">Leave empty to show the standard tips for this type of garment.</span></label>
          <label className="sm:col-span-2">
            <span className="label">Care guide section</span>
            <select name="careGuide" defaultValue={product?.careGuide ?? ""} className="field">
              <option value="">Automatic (from garment type)</option>
              {careGuides.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2">
            <span className="label">Occasions</span>
            <div className="flex flex-wrap gap-2">
              {occasions.map((o) => (
                <label key={o} className="flex items-center gap-2 border border-ink/15 px-3 py-1.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ivory">
                  <input type="checkbox" name="occasions" value={o} defaultChecked={product?.occasions.includes(o)} className="sr-only" />
                  {o}
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <span className="label">Sizes in stock</span>
            <div className="flex flex-wrap gap-2" key={gender}>
              {sizes.map((s) => (
                <label key={s} className="flex items-center gap-2 border border-ink/15 px-3 py-1.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ivory">
                  <input type="checkbox" name="sizes" value={s} defaultChecked={product ? product.sizes.includes(s) : true} className="sr-only" />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? true} className="accent-wine" /> Mark as new</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="accent-wine" /> Feature on homepage</label>
          </div>
        </section>

        {/* Colours */}
        <section className="rounded-md bg-paper p-6">
          <h2 className="font-display text-2xl">3 · Colours available</h2>
          <p className="mt-1 text-sm text-muted">Customers can switch between these in the Fit Studio. The optional second colour is used for skirts of sets, trims and embroidery.</p>
          <div className="mt-4 space-y-2">
            {colors.map((col, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-md border p-2 ${i === active ? "border-ink" : "border-ink/10"}`} onClick={() => setActive(i)}>
                <input type="color" value={col.hex} onChange={(e) => updateColour(i, { hex: e.target.value })} className="size-9 cursor-pointer rounded-lg border-0 bg-transparent" aria-label="Main colour" />
                <input value={col.name} onChange={(e) => updateColour(i, { name: e.target.value })} className="field !py-2" placeholder="Colour name" />
                <input type="color" value={col.accent ?? "#C9A86A"} onChange={(e) => updateColour(i, { accent: e.target.value })} className={`size-9 cursor-pointer rounded-lg border-0 bg-transparent ${col.accent ? "" : "opacity-40"}`} aria-label="Accent colour" title="Accent colour (optional)" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setColors((cs) => cs.filter((_, k) => k !== i)); setActive(0); }} className="px-2 text-muted hover:text-red-700" aria-label="Remove colour">✕</button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {presetColours.filter((p) => !colors.some((c) => c.name === p.name)).map((p) => (
              <button type="button" key={p.name} onClick={() => { setColors((cs) => [...cs, p]); setActive(colors.length); }} className="flex items-center gap-2 border border-ink/15 px-3 py-1.5 text-[12px] hover:border-ink">
                <span className="size-3 rounded-full" style={{ background: p.hex }} /> {p.name}
              </button>
            ))}
            <button type="button" onClick={() => { setColors((cs) => [...cs, { name: "New colour", hex: "#7A6A5A" }]); setActive(colors.length); }} className="border border-dashed border-ink/30 px-3 py-1.5 text-[12px]">+ Custom</button>
          </div>
        </section>

        {state && !state.ok && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{state.message}</p>}
        <div className="sticky bottom-0 z-10 -mx-4 flex gap-3 border-t border-ink/10 bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
          <button type="button" onClick={cancel} className="btn-outline flex-1 sm:flex-none sm:px-10">Cancel</button>
          <button disabled={pending} className="btn-primary flex-1">{pending ? "Saving…" : product ? "Save changes" : "Publish product"}</button>
        </div>
      </div>

      {/* Live preview */}
      <aside className="h-fit rounded-md bg-ink p-6 text-ivory lg:sticky lg:top-6">
        <p className="eyebrow">Live Fit Studio preview</p>
        <p className="mt-1 text-sm text-ivory/60">This is how customers will see {c?.name ?? "it"} across body profiles until AI photos are ready.</p>
        <div className="mt-5 grid items-end gap-0 rounded-md bg-gradient-to-b from-ivory/5 to-ivory/15 px-1 pt-4" style={{ gridTemplateColumns: `repeat(${bodies.length}, minmax(0,1fr))` }}>
          {c && bodies.map((b) => (
            <div key={b.id} className="flex flex-col items-center pb-3">
              <Figure garment={garment} gender={gender} body={b} color={c.hex} accent={c.accent} shadow={false} className="h-44 w-auto" />
              <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-ivory/60">{b.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {colors.map((col, i) => (
            <button type="button" key={i} onClick={() => setActive(i)} title={col.name} className={`size-7 rounded-full ring-offset-2 ring-offset-ink ${i === active ? "ring-1 ring-ivory" : ""}`} style={{ background: col.hex }} />
          ))}
        </div>
      </aside>
    </form>
  );
}
