import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { isAdmin } from "./auth";
import { getRecord, putRecord } from "./store";
import { contentSchema, defaultContent, type SiteContent } from "./content-schema";

type Overrides = Record<string, Record<string, string>>;

/** Site copy and images: defaults merged with whatever the owner saved in /admin/content. */
export const getContent = cache(async (): Promise<SiteContent> => {
  const base = defaultContent() as unknown as Overrides;
  let saved: Overrides = {};
  try {
    saved = ((await getRecord<{ values?: Overrides }>("content", "site"))?.values ?? {}) as Overrides;
  } catch {
    saved = {};
  }
  // In the admin's preview frame, layer the unpublished draft on top.
  let preview = false;
  try {
    preview = (await headers()).get("x-cms-preview") === "1" && (await isAdmin());
  } catch {
    preview = false;
  }
  if (preview) {
    const draft = await getDraft();
    for (const [sec, fields] of Object.entries(draft)) saved[sec] = { ...(saved[sec] ?? {}), ...fields };
  }
  for (const [s, fields] of Object.entries(saved)) {
    if (!base[s]) continue;
    for (const [f, v] of Object.entries(fields)) if (f in base[s] && typeof v === "string") base[s][f] = v;
  }
  return base as unknown as SiteContent;
});

export async function getSavedOverrides(): Promise<Overrides> {
  return ((await getRecord<{ values?: Overrides }>("content", "site"))?.values ?? {}) as Overrides;
}

/** Saves one section. Values equal to the default are dropped, so "reset" just clears them. */
export async function saveSection(section: string, values: Record<string, string>) {
  const def = (contentSchema as Record<string, { fields: Record<string, { default: string }> }>)[section];
  if (!def) throw new Error("Unknown section");
  const current = await getSavedOverrides();
  const next: Record<string, string> = {};
  for (const [f, fd] of Object.entries(def.fields)) {
    const v = values[f];
    if (typeof v === "string" && v !== fd.default) next[f] = v;
  }
  current[section] = next;
  await putRecord("content", "site", { values: current });
}

// ---------------------------------------------------------------- drafts (admin preview)

export async function getDraft(): Promise<Overrides> {
  return ((await getRecord<{ values?: Overrides }>("content", "draft"))?.values ?? {}) as Overrides;
}

/** Stores the full set of values the owner is editing for one section (not yet live). */
export async function saveDraftSection(section: string, values: Record<string, string>) {
  if (!(section in contentSchema)) throw new Error("Unknown section");
  const draft = await getDraft();
  draft[section] = values;
  await putRecord("content", "draft", { values: draft });
}

export async function clearDraftSection(section: string) {
  const draft = await getDraft();
  delete draft[section];
  await putRecord("content", "draft", { values: draft });
}
