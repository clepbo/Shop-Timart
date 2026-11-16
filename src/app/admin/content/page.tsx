import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getContent, getSavedOverrides } from "@/lib/content";
import { contentSchema } from "@/lib/content-schema";
import { SectionForm } from "./SectionForm";

export const dynamic = "force-dynamic";
// Image uploads go through this page's server action.
export const maxDuration = 60;

export default async function ContentPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [content, saved] = await Promise.all([getContent(), getSavedOverrides()]);
  const sections = Object.entries(contentSchema);

  return (
    <div className="container-x py-10">
      <Link href="/admin" className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Dashboard</Link>
      <h1 className="display mt-2 text-5xl">Site content</h1>
      <p className="mt-3 max-w-2xl text-muted">Edit the words and pictures on the website. Each card saves on its own and goes live straight away. Anything you haven&apos;t changed keeps its original wording.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {sections.map(([key, def]) => (
          <a key={key} href={`#${key}`} className="border border-ink/15 px-3 py-1.5 text-[12px] hover:border-ink">
            {def.title}
            {saved[key] && Object.keys(saved[key]).length > 0 && <span className="ml-1.5 text-camel">●</span>}
          </a>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {sections.map(([key, def]) => (
          <SectionForm
            key={key}
            section={key}
            title={def.title}
            where={def.where}
            fields={Object.entries(def.fields).map(([name, fd]) => ({
              name,
              label: fd.label,
              type: fd.type,
              help: "help" in fd ? (fd.help as string) : undefined,
              value: (content as unknown as Record<string, Record<string, string>>)[key][name],
              isDefault: !(saved[key] && name in saved[key]),
            }))}
          />
        ))}
      </div>
    </div>
  );
}
