import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProducts, listRecords } from "@/lib/store";
import { formatPrice } from "@/lib/brand";
import { ProductArt } from "@/components/shop/ProductArt";
import { defaultBody } from "@/lib/bodies";
import { getTryOnProvider } from "@/lib/ai/tryon";
import { logout, regenerateAction } from "./actions";
import type { RenderStatus } from "@/lib/types";

// AI renders run in the background after saving; give them time to finish on Vercel.
export const maxDuration = 300;


export const dynamic = "force-dynamic";

const statusStyle: Record<RenderStatus, [string, string]> = {
  ready: ["bg-emerald-100 text-emerald-900", "AI photos ready"],
  pending: ["bg-amber-100 text-amber-900", "Generating…"],
  failed: ["bg-red-100 text-red-900", "Generation failed"],
  illustration: ["bg-sand text-ink", "Illustrated"],
};

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const sp = await searchParams;
  const [products, orders, bookings] = await Promise.all([getProducts(), listRecords<{ total?: number; status?: string }>("orders"), listRecords("bookings")]);
  const ai = !!getTryOnProvider();
  const revenue = orders.filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered").reduce((n, o) => n + (o.total ?? 0), 0);

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="display mt-2 text-5xl">Good day ✦</h1>
        </div>
        <div className="flex gap-3">
          <form action={logout}><button className="btn-outline !py-3">Sign out</button></form>
          <Link href="/admin/orders" className="btn-outline !py-3">Orders & bookings</Link>
          <Link href="/admin/products/new" className="btn-primary !py-3">+ New product</Link>
        </div>
      </div>

      {sp.saved && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Product saved. {ai ? "AI fit previews are generating in the background." : "Customers can preview it in the Fit Studio now."}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          ["Products", products.length],
          ["Orders", orders.length],
          ["Paid revenue", formatPrice(revenue)],
          ["Styling requests", bookings.length],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-2xl bg-paper p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{k}</p>
            <p className="mt-2 font-display text-3xl">{v}</p>
          </div>
        ))}
      </div>

      <div className={`mt-4 rounded-2xl p-5 text-sm ${ai ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
        <strong>AI try-on:</strong>{" "}
        {ai
          ? "connected. New product photos are automatically rendered on every body profile."
          : "not connected yet. Products show illustrated Fit Studio previews. Add REPLICATE_API_TOKEN and REPLICATE_TRYON_VERSION, plus model photos in /public/models, to enable photo previews."}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="p-4">Product</th>
              <th className="hidden p-4 sm:table-cell">Price</th>
              <th className="hidden p-4 md:table-cell">Colours</th>
              <th className="p-4">Fit previews</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {products.map((p) => {
              const [cls, label] = statusStyle[p.renderStatus];
              return (
                <tr key={p.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ProductArt garmentType={p.garmentType} gender={p.gender} colour={p.colors[0]} body={defaultBody(p.gender)} render={p.renders?.[defaultBody(p.gender).id]} className="h-14 w-11 shrink-0 rounded-lg" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-[12px] text-muted">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden p-4 sm:table-cell">{formatPrice(p.price)}</td>
                  <td className="hidden p-4 md:table-cell">
                    <div className="flex gap-1">{p.colors.map((c) => <span key={c.name} title={c.name} className="size-4 rounded-full ring-1 ring-ink/10" style={{ background: c.hex }} />)}</div>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${cls}`} title={p.renderError ?? undefined}>{label}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3 text-[12px] uppercase tracking-[0.12em]">
                      {p.image && ai && (
                        <form action={regenerateAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="text-muted hover:text-ink">Regenerate</button>
                        </form>
                      )}
                      <Link href={`/admin/products/${p.id}`} className="text-wine hover:underline">Edit</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
