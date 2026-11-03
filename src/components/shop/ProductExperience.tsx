"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { bodiesFor, defaultBody, skinTones, type BodyProfile } from "@/lib/bodies";
import { brand, formatPrice, whatsappLink } from "@/lib/brand";
import { ProductArt } from "./ProductArt";
import { Figure } from "../figure/Figure";
import { useCart } from "../cart/CartProvider";
import { CheckIcon, SparkIcon, WhatsAppIcon } from "../Icons";

function recommendedSize(body: BodyProfile, sizes: string[]) {
  const first = body.sizes.split(/[–-]/)[0].trim(); // "UK 14–16" → "UK 14", "M–L" → "M"
  const candidate = first.startsWith("UK") || !body.sizes.startsWith("UK") ? first : `UK ${first}`;
  return sizes.includes(candidate) ? candidate : sizes[Math.floor(sizes.length / 2)];
}

export function ProductExperience({ product, initialColour }: { product: Product; initialColour?: string }) {
  const bodies = bodiesFor(product.gender);
  const [bodyId, setBodyId] = useState(defaultBody(product.gender).id);
  const [ci, setCi] = useState(() => Math.max(0, product.colors.findIndex((c) => c.name === initialColour)));
  const [skin, setSkin] = useState(skinTones[1].hex);
  const [compare, setCompare] = useState(false);
  const body = bodies.find((b) => b.id === bodyId) ?? bodies[0];
  const colour = product.colors[ci];
  const [size, setSize] = useState(() => recommendedSize(body, product.sizes));
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const hasPhotos = product.renderStatus === "ready" && !!product.renders && Object.keys(product.renders).length > 0;
  const recommended = recommendedSize(body, product.sizes);

  const pickBody = (b: BodyProfile) => {
    setBodyId(b.id);
    setSize(recommendedSize(b, product.sizes));
  };

  const addToBag = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      colour: colour.name,
      size,
      quantity: 1,
      garmentType: product.garmentType,
      hex: colour.hex,
      accent: colour.accent,
      gender: product.gender,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const waMessage = `Hello ${brand.name}! I'd like to order the ${product.name} in ${colour.name}, size ${size}. (${formatPrice(product.price)})`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      {/* ---------- Fit Studio stage ---------- */}
      <section aria-label="Fit Studio" className="lg:sticky lg:top-[96px] lg:self-start">
        <div className="relative overflow-hidden rounded-[28px]">
          {compare ? (
            <div
              className="grid aspect-[4/5] items-end gap-0 px-2 sm:aspect-[5/4]"
              style={{ gridTemplateColumns: `repeat(${bodies.length}, minmax(0, 1fr))`, background: "linear-gradient(180deg,#F1E9DF,#E7DCCD)" }}
            >
              {bodies.map((b) => (
                <button key={b.id} onClick={() => { pickBody(b); setCompare(false); }} className="group flex h-full flex-col items-center justify-end pb-6" aria-label={`View on ${b.label} body`}>
                  <Figure garment={product.garmentType} gender={product.gender} body={b} color={colour.hex} accent={colour.accent} skin={skin} className="h-[78%] w-auto transition-transform duration-500 group-hover:-translate-y-1" />
                  <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[11px]">{b.label}</span>
                  <span className="text-[10px] text-muted/70">{b.sizes}</span>
                </button>
              ))}
            </div>
          ) : (
            <ProductArt
              garmentType={product.garmentType}
              gender={product.gender}
              colour={colour}
              body={body}
              skin={skin}
              render={hasPhotos ? product.renders?.[body.id] : undefined}
              name={product.name}
              className="aspect-[4/5]"
            />
          )}

          <div className="absolute left-4 top-4 hidden items-center gap-2 rounded-full bg-ivory/90 px-3 py-1.5 text-[10px] sm:flex uppercase tracking-[0.18em] backdrop-blur">
            <SparkIcon className="size-3.5 text-wine" /> Fit Studio · {hasPhotos ? "AI photo preview" : "Illustrated preview"}
          </div>
          {!compare && (
            <div className="absolute bottom-4 left-4 rounded-2xl bg-ivory/90 px-4 py-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Showing on</p>
              <p className="font-display text-xl leading-tight">
                {body.label} · {body.sizes}
              </p>
              <p className="text-[12px] text-muted">
                {body.height} · {colour.name}
              </p>
            </div>
          )}
          <button
            onClick={() => setCompare((v) => !v)}
            className="absolute right-4 top-4 rounded-full bg-ink px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ivory transition hover:bg-wine"
          >
            {compare ? "Single view" : "Compare all sizes"}
          </button>
        </div>

        {/* body picker */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <p className="label !mb-0">Choose a body closest to yours</p>
            <p className="text-[12px] text-muted">Tap to preview</p>
          </div>
          <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${bodies.length}, minmax(0, 1fr))` }}>
            {bodies.map((b) => {
              const active = b.id === body.id;
              return (
                <button
                  key={b.id}
                  onClick={() => pickBody(b)}
                  aria-pressed={active}
                  className={`flex flex-col items-center rounded-2xl border px-1 pb-2 pt-3 transition ${active ? "border-ink bg-paper" : "border-ink/10 hover:border-ink/40"}`}
                >
                  <Figure garment={product.garmentType} gender={product.gender} body={b} color={active ? colour.hex : "#CDBFAE"} accent={active ? colour.accent : "#B9A994"} skin={active ? skin : "#BFA58C"} shadow={false} className="h-16 w-auto sm:h-20" />
                  <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.1em] sm:text-[11px]">{b.label}</span>
                  <span className="text-[10px] text-muted">{b.sizes}</span>
                </button>
              );
            })}
          </div>
        </div>

        {!hasPhotos && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="label !mb-0">Skin tone</p>
            {skinTones.map((t) => (
              <button
                key={t.id}
                onClick={() => setSkin(t.hex)}
                aria-label={`${t.label} skin tone`}
                aria-pressed={skin === t.hex}
                className={`size-7 rounded-full ring-offset-2 ring-offset-ivory transition ${skin === t.hex ? "ring-1 ring-ink" : "ring-1 ring-transparent hover:ring-ink/30"}`}
                style={{ background: t.hex }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ---------- purchase panel ---------- */}
      <section>
        <p className="eyebrow">{product.occasions.join(" · ")}</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">{product.name}</h1>
        <p className="mt-4 text-xl">
          {formatPrice(product.price)}
          {product.compareAtPrice && <s className="ml-3 text-base text-muted">{formatPrice(product.compareAtPrice)}</s>}
        </p>
        <p className="mt-6 max-w-lg leading-relaxed text-muted">{product.description}</p>

        <div className="mt-8">
          <p className="label">
            Colour — <span className="normal-case tracking-normal text-ink">{colour.name}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setCi(i)}
                aria-pressed={i === ci}
                aria-label={c.name}
                title={c.name}
                className={`relative size-11 rounded-full ring-offset-[3px] ring-offset-ivory transition ${i === ci ? "ring-1 ring-ink" : "ring-1 ring-ink/10 hover:ring-ink/40"}`}
                style={{ background: c.accent ? `linear-gradient(135deg, ${c.hex} 0 60%, ${c.accent} 60% 100%)` : c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p className="label">Size</p>
            <p className="text-[12px] text-muted">
              Suggested for {body.label}: <span className="text-ink">{recommended}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={s === size}
                className={`relative min-w-[64px] rounded-full border px-4 py-2.5 text-[13px] transition ${s === size ? "border-ink bg-ink text-ivory" : "border-ink/15 hover:border-ink"}`}
              >
                {s}
                {s === recommended && s !== size && <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-gold" aria-hidden />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={addToBag} className="btn-primary flex-1">
            {added ? (
              <>
                <CheckIcon /> Added to bag
              </>
            ) : (
              <>Add to bag · {formatPrice(product.price)}</>
            )}
          </button>
          <a href={whatsappLink(waMessage)} target="_blank" rel="noreferrer" className="btn-outline flex-1">
            <WhatsAppIcon className="size-4" /> Order on WhatsApp
          </a>
        </div>

        <div className="mt-8 rounded-2xl bg-sand/60 p-5">
          <p className="font-display text-xl">Not sure how to style it?</p>
          <p className="mt-1 text-sm text-muted">Our stylists will put together the full look — gele, bag, shoes and all — for your occasion.</p>
          <a href="/styling" className="mt-3 inline-block text-[12px] uppercase tracking-[0.16em] text-wine link-underline">
            Book a styling session
          </a>
        </div>

        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          <details open className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] uppercase tracking-[0.14em]">
              Details & care <span className="transition group-open:rotate-45">+</span>
            </summary>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {product.details.map((d) => (
                <li key={d}>— {d}</li>
              ))}
            </ul>
          </details>
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] uppercase tracking-[0.14em]">
              About the Fit Studio <span className="transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pick the body closest to yours to see how this piece drapes across sizes, then switch colours instantly. Photo previews are generated by AI from our product photos; illustrated previews show proportion and colour while photos are being prepared. Real fabric may vary slightly in shade.
            </p>
          </details>
          <details className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] uppercase tracking-[0.14em]">
              Delivery & returns <span className="transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Same-day delivery within Lagos for orders before 12pm, nationwide in 2–5 working days. Free Lagos delivery over {formatPrice(brand.freeDeliveryThreshold)}. Exchanges within 7 days on unworn items with tags.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
