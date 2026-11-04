"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductArt } from "../shop/ProductArt";
import { ArrowIcon } from "../Icons";

/** Category card: the outfit fills the frame, sways like it's on a hanger and cycles colours on hover. */
export function CategoryTile({ href, name, sub, product, photo }: { href: string; name: string; sub: string; product?: Product; photo?: string }) {
  const [ci, setCi] = useState(0);
  const [hover, setHover] = useState(false);
  const count = product?.colors.length ?? 0;

  useEffect(() => {
    if (!hover || count < 2) return;
    const t = setInterval(() => setCi((c) => (c + 1) % count), 900);
    return () => clearInterval(t);
  }, [hover, count]);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative block aspect-[3/4] overflow-hidden bg-sand"
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="absolute inset-0 size-full object-cover object-top transition duration-700 group-hover:scale-[1.05]" />
      ) : (
        product && (
          <ProductArt
            garmentType={product.garmentType}
            gender={product.gender}
            colour={product.colors[ci] ?? product.colors[0]}
            ghost
            zoom
            swing
            swatches={product.colors}
            name={product.name}
            className="absolute inset-0"
          />
        )
      )}
      <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-paper/95 px-5 py-4 backdrop-blur transition duration-500">
        <p className="font-display text-lg font-semibold">{name}</p>
        <p className="mt-0.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
          {sub} <ArrowIcon className="size-3.5 transition duration-300 group-hover:translate-x-1.5" />
        </p>
      </div>
      <span className="absolute right-3 top-3 grid size-9 -translate-y-2 place-items-center rounded-full bg-paper text-wine opacity-0 shadow transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowIcon className="size-4 -rotate-45" />
      </span>
    </Link>
  );
}
