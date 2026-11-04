"use client";

import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

/** A button that smoothly resizes as its label changes (e.g. "Add to bag" → "Added ✓"). */
export function MorphButton({ children, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const inner = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number>();
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <button {...rest} className={`${className} overflow-hidden transition-[width,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)]`} style={{ width: w ? w + 56 : undefined }}>
      <span ref={inner} className="inline-flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </button>
  );
}
