"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/brand";
import { defaultBody } from "@/lib/bodies";
import { ProductArt } from "./ProductArt";

export function productPhotos(product: Product, colourIndex = 0) {
  const c = product.colors[colourIndex];
  if (c?.images?.length) return c.images;
  if (product.images?.length) return product.images;
  return product.image ? [product.image] : [];
}

export function ProductCard({ product }: { product: Product; priority?: boolean }) {
  const [ci, setCi] = useState(0);
  const colour = product.colors[ci] ?? product.colors[0];
  const body = defaultBody(product.gender);
  const photos = productPhotos(product, ci);
  const alt = photos[1] ?? productPhotos(product, (ci + 1) % product.colors.length).find((p) => p !== photos[0]);

  return (
    <article className="group">
      <Link href={`/shop/${product.slug}?colour=${encodeURIComponent(colour.name)}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          {photos[0] ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0]} alt={`${product.name} in ${colour.name}`} loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_32%] transition duration-700 group-hover:scale-[1.03]" />
              {alt && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={alt} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_32%] opacity-0 transition duration-700 group-hover:opacity-100" />
              )}
            </>
          ) : (
            <ProductArt
              garmentType={product.garmentType}
              gender={product.gender}
              colour={colour}
              body={body}
              render={product.renders?.[body.id]}
              name={product.name}
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute left-0 top-3 flex flex-col items-start gap-1.5">
            {product.isNew && <span className="bg-butter px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-wine">New in</span>}
            {product.compareAtPrice && <span className="bg-wine px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-butter">Sale</span>}
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-wine py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-butter transition duration-500 group-hover:translate-y-0">
            View & try on your size
          </div>
        </div>
      </Link>
      <div className="mt-3.5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <Link href={`/shop/${product.slug}`} className="block truncate text-[15px] font-medium text-ink">
            {product.name}
          </Link>
          <p className="mt-0.5 text-[14px] font-semibold text-wine">
            {formatPrice(product.price)}
            {product.compareAtPrice && <s className="ml-2 font-normal text-muted">{formatPrice(product.compareAtPrice)}</s>}
          </p>
        </div>
        {product.colors.length > 1 && (
          <div className="flex shrink-0 gap-1.5 sm:mt-1" role="radiogroup" aria-label="Colour">
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
                className={`size-4 rounded-full ring-offset-2 ring-offset-ivory transition ${i === ci ? "ring-1 ring-ink" : "ring-1 ring-ink/15"}`}
                style={{ background: c.accent ? `linear-gradient(135deg, ${c.hex} 0 55%, ${c.accent} 55%)` : c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
