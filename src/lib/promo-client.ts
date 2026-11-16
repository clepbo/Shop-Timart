"use client";

/** The discount code a visitor arrived with (e.g. from the store's QR code), kept in this browser. */
const KEY = "timart.promo.v1";
const EVENT = "timart:promo";

export type StoredPromo = { code: string; label: string };

export function getStoredPromo(): StoredPromo | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredPromo) : null;
  } catch {
    return null;
  }
}

export function setStoredPromo(p: StoredPromo | null) {
  try {
    if (p) localStorage.setItem(KEY, JSON.stringify(p));
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function onPromoChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}
