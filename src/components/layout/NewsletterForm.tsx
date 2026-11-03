"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions/public";
import { ArrowIcon } from "../Icons";

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [state, action, pending] = useActionState(subscribe, null);
  const dark = tone === "dark";
  return (
    <form action={action} className="mt-4">
      <div className={`flex items-center rounded-full border p-1 pl-5 ${dark ? "border-ivory/20" : "border-ink/20 bg-paper"}`}>
        <input name="email" type="email" required placeholder="Your email address" aria-label="Email address" className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${dark ? "placeholder:text-ivory/40" : "placeholder:text-muted/70"}`} />
        <button disabled={pending} className={`grid size-10 shrink-0 place-items-center rounded-full transition ${dark ? "bg-ivory text-ink hover:bg-gold" : "bg-ink text-ivory hover:bg-wine"}`} aria-label="Subscribe">
          <ArrowIcon />
        </button>
      </div>
      {state && <p className={`mt-2 text-[13px] ${state.ok ? "text-gold" : "text-red-400"}`}>{state.message}</p>}
    </form>
  );
}
