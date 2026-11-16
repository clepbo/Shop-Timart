"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { discardDraftAction, publishContentAction, saveDraftAction, uploadContentImageAction } from "../actions";

type Field = { name: string; label: string; type: "text" | "textarea" | "image"; help?: string; default: string };
export type CmsSection = {
  key: string;
  title: string;
  where: string;
  group: string;
  preview: { path: string; anchor?: string };
  fields: Field[];
  live: Record<string, string>;
  draft: Record<string, string> | null;
  edited: boolean;
};

const DEVICES = {
  desktop: { w: 1366, h: 860, label: "Desktop" },
  mobile: { w: 390, h: 800, label: "Mobile" },
} as const;
type Device = keyof typeof DEVICES;

/** Scales a fixed-size iframe to fit its container, like a device mock-up. */
function Frame({ src, device, anchor }: { src: string; device: Device; anchor?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const d = DEVICES[device];
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / d.w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [d.w]);
  return (
    <div ref={box} className={device === "mobile" ? "mx-auto w-full max-w-[390px]" : "w-full"}>
      <div className={`relative overflow-hidden bg-paper shadow-[0_20px_50px_-24px_rgba(46,31,23,0.5)] ring-1 ring-ink/10 ${device === "mobile" ? "rounded-[28px] ring-8 ring-wine-deep" : "rounded-md"}`} style={{ height: d.h * scale }}>
        <iframe
          title={`${d.label} preview`}
          src={src}
          onLoad={(e) => {
            // Jump to the section being edited once the page (and its animations) have settled.
            if (!anchor) return;
            const win = (e.currentTarget as HTMLIFrameElement).contentWindow;
            let tries = 0;
            const go = () => {
              const el = win?.document.getElementById(anchor);
              if (el && win) {
                const top = el.getBoundingClientRect().top + win.scrollY - 76;
                win.document.documentElement.style.scrollBehavior = "auto";
                win.scrollTo(0, Math.max(0, top));
              }
              if (++tries < 6) setTimeout(go, 250);
            };
            go();
          }}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width: d.w, height: d.h, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}

export function CmsEditor({ sections, initial }: { sections: CmsSection[]; initial: string }) {
  const router = useRouter();
  const [key, setKey] = useState(initial);
  const section = sections.find((s) => s.key === key)!;
  const [values, setValues] = useState<Record<string, string>>(section.draft ?? section.live);
  const [hasDraft, setHasDraft] = useState(!!section.draft);
  const [device, setDevice] = useState<Device>("desktop");
  const [stamp, setStamp] = useState(() => Date.now());
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [publishing, startPublish] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groups = useMemo(() => {
    const g: Record<string, CmsSection[]> = {};
    for (const s of sections) (g[s.group] ??= []).push(s);
    return g;
  }, [sections]);

  const switchTo = (next: string) => {
    const s = sections.find((x) => x.key === next)!;
    setKey(next);
    setValues(s.draft ?? s.live);
    setHasDraft(!!s.draft);
    setMessage(null);
    setStamp(Date.now());
    window.history.replaceState(null, "", `/admin/content?section=${next}`);
  };

  // Save as a draft shortly after typing stops, then refresh the preview.
  const queueDraft = (next: Record<string, string>) => {
    setValues(next);
    setHasDraft(true);
    setSaving("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await saveDraftAction(key, next);
      setSaving("saved");
      setStamp(Date.now());
    }, 700);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const changed = section.fields.some((f) => (values[f.name] ?? "") !== (section.live[f.name] ?? ""));

  const publish = () =>
    startPublish(async () => {
      if (timer.current) clearTimeout(timer.current);
      const r = await publishContentAction(key, values);
      setMessage(r ? { ok: r.ok, text: r.message } : null);
      setHasDraft(false);
      setSaving("idle");
      setStamp(Date.now());
      router.refresh();
    });

  const discard = async () => {
    if (!window.confirm("Discard your unpublished changes to this section?")) return;
    if (timer.current) clearTimeout(timer.current);
    await discardDraftAction(key);
    setValues(section.live);
    setHasDraft(false);
    setSaving("idle");
    setStamp(Date.now());
    router.refresh();
  };

  const upload = async (name: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    setMessage(null);
    const r = await uploadContentImageAction(fd);
    if (r.ok && r.url) queueDraft({ ...values, [name]: r.url });
    else setMessage({ ok: false, text: r.message ?? "Upload failed." });
  };

  const src = `${section.preview.path}?__cms=draft&t=${stamp}`;

  return (
    <div className="flex min-h-screen flex-col xl:h-screen xl:flex-row xl:overflow-hidden">
      {/* ---------- editor ---------- */}
      <div className="w-full shrink-0 border-ink/10 bg-paper xl:w-[440px] xl:overflow-y-auto xl:border-r">
        <div className="sticky top-0 z-10 border-b border-ink/10 bg-paper/95 px-5 py-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Site content</p>
          <label className="mt-2 block">
            <span className="sr-only">Section</span>
            <select value={key} onChange={(e) => switchTo(e.target.value)} className="field !py-2.5 font-medium">
              {Object.entries(groups).map(([g, list]) => (
                <optgroup key={g} label={g}>
                  {list.map((s) => (
                    <option key={s.key} value={s.key}>
                      {((t) => t.charAt(0).toUpperCase() + t.slice(1))(s.title.replace(/^Homepage — /, ""))}
                      {s.draft ? " • draft" : s.edited ? " • edited" : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <p className="mt-2 text-[12px] text-muted">{section.where}</p>
        </div>

        <div className="space-y-5 px-5 py-5">
          {section.fields.map((f) => {
            const v = values[f.name] ?? "";
            const isDefault = v === f.default;
            return (
              <div key={f.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={`f-${f.name}`} className="label">{f.label}</label>
                  {!isDefault && (
                    <button type="button" onClick={() => queueDraft({ ...values, [f.name]: f.default })} className="text-[11px] text-muted underline-offset-2 hover:text-ink hover:underline">
                      Reset to original
                    </button>
                  )}
                </div>
                {f.type === "text" && <input id={`f-${f.name}`} value={v} onChange={(e) => queueDraft({ ...values, [f.name]: e.target.value })} className="field" />}
                {f.type === "textarea" && (
                  <textarea id={`f-${f.name}`} value={v} rows={Math.min(8, Math.max(3, v.split("\n").length + 1))} onChange={(e) => queueDraft({ ...values, [f.name]: e.target.value })} className="field" />
                )}
                {f.type === "image" && (
                  <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-ink/25 p-3 transition hover:border-wine">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v} alt="" className="h-24 w-20 shrink-0 bg-sand object-contain" />
                    <span className="text-sm">
                      <span className="block font-medium">Replace image</span>
                      <span className="block text-muted">JPG, PNG or WEBP{f.help ? ` · ${f.help}` : ""}</span>
                    </span>
                    <input id={`f-${f.name}`} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(f.name, file); }} />
                  </label>
                )}
                {f.help && f.type !== "image" && <p className="mt-1 text-[12px] text-muted">{f.help}</p>}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 border-t border-ink/10 bg-paper/95 px-5 py-4 backdrop-blur">
          <p className="mb-3 flex items-center gap-2 text-[12px] text-muted" aria-live="polite">
            <span className={`size-2 rounded-full ${hasDraft && changed ? "bg-amber-500" : "bg-emerald-600"}`} />
            {saving === "saving" ? "Saving draft…" : hasDraft && changed ? "Unpublished changes — only you can see them in the preview" : "Up to date with the live site"}
          </p>
          {message && <p className={`mb-3 text-sm ${message.ok ? "text-emerald-800" : "text-red-700"}`}>{message.text}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={discard} disabled={!hasDraft || publishing} className="btn-outline flex-1 !px-3 !py-3 disabled:opacity-40">Discard</button>
            <button type="button" onClick={publish} disabled={!changed || publishing || saving === "saving"} className="btn-primary flex-[2] !py-3 disabled:opacity-40">
              {publishing ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- preview ---------- */}
      <div className="flex min-w-0 flex-1 flex-col bg-sand/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-3">
          <div className="flex border border-ink/15 bg-paper p-0.5" role="tablist" aria-label="Preview size">
            {(Object.keys(DEVICES) as Device[]).map((d) => (
              <button key={d} role="tab" aria-selected={device === d} onClick={() => setDevice(d)} className={`px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${device === d ? "bg-wine text-butter" : "text-muted hover:text-ink"}`}>
                {DEVICES[d].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[12px] text-muted">
            <button type="button" onClick={() => setStamp(Date.now())} className="uppercase tracking-[0.12em] hover:text-ink">↻ Reload</button>
            <a href={`${section.preview.path}${section.preview.anchor ? `#${section.preview.anchor}` : ""}`} target="_blank" rel="noreferrer" className="uppercase tracking-[0.12em] hover:text-ink">Open live page ↗</a>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <Frame key={device} src={src} device={device} anchor={section.preview.anchor} />
          <p className="mt-3 text-center text-[12px] text-muted">Preview of the real page with your draft. Scroll inside it to look around.</p>
        </div>
      </div>
    </div>
  );
}
