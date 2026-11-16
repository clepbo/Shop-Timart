"use client";

import { useActionState, useState } from "react";
import { saveContentAction } from "../actions";

type Field = { name: string; label: string; type: "text" | "textarea" | "image"; help?: string; value: string; isDefault: boolean };

export function SectionForm({ section, title, where, fields }: { section: string; title: string; where: string; fields: Field[] }) {
  const [state, action, pending] = useActionState(saveContentAction, null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  return (
    <form id={section} action={action} className="scroll-mt-6 rounded-md bg-paper p-6">
      <input type="hidden" name="__section" value={section} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl">{title}</h2>
        <p className="text-[12px] text-muted">{where}</p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === "textarea" || f.type === "image" ? "md:col-span-2" : ""}>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={`${section}-${f.name}`} className="label">{f.label}</label>
              {!f.isDefault && (
                <label className="flex items-center gap-1.5 text-[11px] text-muted">
                  <input type="checkbox" name={`${f.name}__reset`} className="accent-wine" /> Reset to original
                </label>
              )}
            </div>
            {f.type === "text" && <input id={`${section}-${f.name}`} name={f.name} defaultValue={f.value} className="field" />}
            {f.type === "textarea" && <textarea id={`${section}-${f.name}`} name={f.name} defaultValue={f.value} rows={Math.min(6, Math.max(3, f.value.split("\n").length + 1))} className="field" />}
            {f.type === "image" && (
              <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-ink/25 p-3 transition hover:border-wine">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previews[f.name] ?? f.value} alt="" className="h-24 w-20 shrink-0 bg-sand object-contain" />
                <span className="text-sm">
                  <span className="block font-medium">Replace image</span>
                  <span className="block text-muted">JPG, PNG or WEBP{f.help ? ` · ${f.help}` : ""}</span>
                </span>
                <input
                  id={`${section}-${f.name}`}
                  type="file"
                  name={f.name}
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreviews((p) => ({ ...p, [f.name]: URL.createObjectURL(file) }));
                  }}
                />
              </label>
            )}
            {f.help && f.type !== "image" && <p className="mt-1 text-[12px] text-muted">{f.help}</p>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button disabled={pending} className="btn-primary !py-3">{pending ? "Saving…" : "Save section"}</button>
        {state && <p className={`text-sm ${state.ok ? "text-emerald-800" : "text-red-700"}`}>{state.message}</p>}
      </div>
    </form>
  );
}
