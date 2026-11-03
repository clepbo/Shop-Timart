"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: CartItem) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "timart.cart.v1";

export const itemKey = (i: Pick<CartItem, "productId" | "colour" | "size">) => `${i.productId}|${i.colour}|${i.size}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const k = itemKey(item);
      const found = prev.find((p) => itemKey(p) === k);
      if (found) return prev.map((p) => (itemKey(p) === k ? { ...p, quantity: p.quantity + item.quantity } : p));
      return [...prev, item];
    });
    setOpen(true);
  }, []);

  const update = useCallback((key: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (itemKey(p) === key ? { ...p, quantity: Math.max(1, quantity) } : p)));
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((p) => itemKey(p) !== key)), []);
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY); // also covers clear() running before hydration
    } catch {}
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.quantity * i.price, 0),
      open,
      setOpen,
      add,
      update,
      remove,
      clear,
    }),
    [items, open, add, update, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
