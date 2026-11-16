import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDraft, getSavedOverrides } from "@/lib/content";
import { contentSchema, defaultContent } from "@/lib/content-schema";
import { CmsEditor, type CmsSection } from "./CmsEditor";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function ContentPage({ searchParams }: PageProps<"/admin/content">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const [saved, draft] = await Promise.all([getSavedOverrides(), getDraft()]);
  const defaults = defaultContent() as unknown as Record<string, Record<string, string>>;

  const sections: CmsSection[] = Object.entries(contentSchema).map(([key, def]) => {
    const live: Record<string, string> = { ...defaults[key], ...(saved[key] ?? {}) };
    return {
      key,
      title: def.title,
      where: def.where,
      group: def.group,
      preview: def.preview,
      fields: Object.entries(def.fields).map(([name, fd]) => ({ name, label: fd.label, type: fd.type, help: "help" in fd ? (fd.help as string) : undefined, default: fd.default })),
      live,
      draft: draft[key] ?? null,
      edited: !!saved[key] && Object.keys(saved[key]).length > 0,
    };
  });
  const sp = await searchParams;
  const initial = typeof sp.section === "string" && sections.some((s) => s.key === sp.section) ? sp.section : "hero";
  return <CmsEditor sections={sections} initial={initial} />;
}
