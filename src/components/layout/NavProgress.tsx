"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Thin brown progress bar at the top of the page while navigating between pages. */
export function NavProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const startHref = useRef("");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.href === location.href || (url.pathname === location.pathname && url.hash)) return;
      startHref.current = location.href;
      setState("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Finish when the URL changes (covers both new pages and query-string changes like shop filters).
  useEffect(() => {
    if (state !== "loading") return;
    const started = Date.now();
    const t = setInterval(() => {
      if (location.href !== startHref.current || Date.now() - started > 8000) {
        setState("done");
        clearInterval(t);
      }
    }, 80);
    return () => clearInterval(t);
  }, [state, pathname]);

  useEffect(() => {
    if (state !== "done") return;
    const t = setTimeout(() => setState("idle"), 450);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden>
      <div
        className="h-full bg-wine shadow-[0_0_10px_rgba(107,68,41,0.6)]"
        style={{
          width: state === "idle" ? "0%" : state === "loading" ? "78%" : "100%",
          opacity: state === "done" ? 0 : 1,
          transition: state === "loading" ? "width 6s cubic-bezier(.1,.7,.1,1)" : state === "done" ? "width .25s ease, opacity .4s ease .2s" : "none",
        }}
      />
    </div>
  );
}
