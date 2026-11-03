"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/brand";
import { defaultBody } from "@/lib/bodies";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [ci, setCi] = useState(0);
  const colour = product.colors[ci] ?? product.colors[0];
  const body = defaultBody(product.gender);
  void priority;

  return (
    <article className="group">
      <Link href={`/shop/${product.slug}?colour=${encodeURIComponent(colour.name)}`} className="block">
        <div className="relative overflow-hidden rounded-[22px]">
          <ProductArt
            garmentType={product.garmentType}
            gender={product.gender}
            colour={colour}
            body={body}
            render={product.renders?.[body.id]}
            name={product.name}
            className="aspect-[4/5] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.isNew && <span className="rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] backdrop-blur">New in</span>}
            {product.compareAtPrice && <span className="rounded-full bg-wine px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ivory">Sale</span>}
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-ivory/95 py-2.5 text-center text-[11px] uppercase tracking-[0.18em] opacity-0 backdrop-blur transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Try it on your size
          </div>
        </div>
      </Link>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <Link href={`/shop/${product.slug}`} className="block truncate font-display text-[20px] leading-tight sm:text-[22px]">
            {product.name}
          </Link>
          <p className="mt-1 text-[13px] text-muted">
            {formatPrice(product.price)}
            {product.compareAtPrice && <s className="ml-2 opacity-60">{formatPrice(product.compareAtPrice)}</s>}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 sm:mt-1.5" role="radiogroup" aria-label="Colour">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              role="radio"
              aria-checked={i === ci}
              aria-label={c.name}
              title={c.name}
              onMouseEnter={() => setCi(i)}
              onFocus={() => setCi(i)}
              onClick={() => setCi(i)}
              className={`size-4 rounded-full ring-offset-2 ring-offset-ivory transition ${i === ci ? "ring-1 ring-ink" : "ring-1 ring-ink/10"}`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
