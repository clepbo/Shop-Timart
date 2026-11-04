"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions/public";
import { ArrowIcon } from "../Icons";

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [state, action, pending] = useActionState(subscribe, null);
  const dark = tone === "dark";
  return (
    <form action={action} className="mt-4">
      <div className={`flex items-center border p-1 pl-5 ${dark ? "border-ivory/20" : "border-ink/20 bg-paper"}`}>
        <input name="email" type="email" required placeholder="Your email address" aria-label="Email address" className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${dark ? "placeholder:text-ivory/40" : "placeholder:text-muted/70"}`} />
        <button disabled={pending} className={`grid shrink-0 place-items-center transition ${dark ? "size-10 bg-butter text-wine hover:bg-white" : "h-10 bg-wine px-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-butter hover:bg-wine-deep"}`} aria-label="Subscribe">
          {dark ? <ArrowIcon /> : "Subscribe"}
        </button>
      </div>
      {state && <p className={`mt-2 text-[13px] ${state.ok ? (dark ? "text-butter" : "text-wine") : "text-red-700"}`}>{state.message}</p>}
    </form>
  );
}
