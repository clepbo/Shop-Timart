import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/store";
import { getSale, listSales, saleCollections, saleStatus, withSales, type SaleRule } from "@/lib/sales";
import { categories } from "@/lib/catalog";
import { formatPrice } from "@/lib/brand";
import { AdminHeader } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { SaleForm } from "./SaleForm";
import { deleteSaleAction, toggleSaleAction } from "../actions";

export const dynamic = "force-dynamic";

const statusCls = { live: "bg-emerald-100 text-emerald-900", scheduled: "bg-sky-100 text-sky-900", ended: "bg-ink/10 text-muted", paused: "bg-amber-100 text-amber-900" } as const;

function scopeText(r: SaleRule, productNames: Record<string, string>) {
  if (r.scope === "all") return "Whole store";
  if (r.scope === "category") return r.targets.map((t) => categories.find((c) => c.slug === t)?.name ?? t).join(", ");
  if (r.scope === "collection") return r.targets.map((t) => saleCollections.find((c) => c.id === t)?.label ?? t).join(", ");
  return r.targets.map((t) => productNames[t] ?? "Removed product").join(", ");
}

const d = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }) : "");

export default async function SalesPage({ searchParams }: PageProps<"/admin/sales">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const sp = await searchParams;
  const [rules, products] = await Promise.all([listSales(), getProducts()]);
  const priced = await withSales(products);
  const onSale = priced.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
  const editing = typeof sp.edit === "string" ? await getSale(sp.edit) : null;
  const names = Object.fromEntries(products.map((p) => [p.id, p.name]));
  const showForm = !!editing || sp.new === "1";

  return (
    <div className="container-x py-10">
      <AdminHeader title="Sales" description="Reduce prices on one product, a category, a collection or the whole store. Shoppers see the sale price and the original price crossed out. If several sales apply, the biggest discount wins — they don't add up.">
        {!showForm && <Link href="/admin/sales?new=1" className="btn-primary !py-3">+ New sale</Link>}
      </AdminHeader>

      {typeof sp.saved === "string" && <p className="mt-6 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Saved “{sp.saved}”. Prices on the shop are updated.</p>}

      {showForm && (
        <section className="mt-8 bg-paper p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">{editing ? `Edit “${editing.name}”` : "New sale"}</h2>
            <Link href="/admin/sales" className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">Cancel</Link>
          </div>
          <SaleForm
            sale={editing ?? undefined}
            categories={categories.map((c) => ({ id: c.slug, label: c.name }))}
            collections={saleCollections.map((c) => ({ id: c.id, label: c.label }))}
            products={products.map((p) => ({ id: p.id, label: p.name, price: p.price }))}
          />
        </section>
      )}

      <section className="mt-8 overflow-x-auto bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="p-4">Sale</th>
              <th className="p-4">Applies to</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {rules.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-muted">No sales yet. Create one, or put a single product on sale from its edit page.</td>
              </tr>
            )}
            {rules.map((r) => {
              const st = saleStatus(r);
              return (
                <tr key={r.id}>
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="max-w-[260px] p-4 text-muted">{scopeText(r, names)}</td>
                  <td className="p-4">{r.kind === "percent" ? `${r.value}% off` : `${formatPrice(r.value)} off`}</td>
                  <td className="p-4 text-[12px] text-muted">{r.startsAt || r.endsAt ? `${d(r.startsAt) || "Now"} – ${d(r.endsAt) || "no end"}` : "Always"}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 text-[11px] ${statusCls[st]}`}>{st}</span></td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3 text-[12px] uppercase tracking-[0.12em]">
                      <Link href={`/admin/sales?edit=${r.id}`} className="text-wine hover:underline">Edit</Link>
                      <form action={toggleSaleAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="text-muted hover:text-ink">{r.active ? "Pause" : "Activate"}</button>
                      </form>
                      <form action={deleteSaleAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <ConfirmSubmit message={`Delete the sale “${r.name}”?`} className="text-red-700 hover:underline">Delete</ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl">On sale right now ({onSale.length})</h2>
        <p className="mt-1 text-sm text-muted">Includes products put on sale from their own edit page.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {onSale.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 bg-paper px-4 py-3 text-sm">
              <Link href={`/admin/products/${p.id}`} className="min-w-0 truncate hover:text-wine">{p.name}</Link>
              <span className="shrink-0">
                <s className="mr-2 text-muted">{formatPrice(p.compareAtPrice!)}</s>
                <span className="font-semibold text-wine">{formatPrice(p.price)}</span>
              </span>
            </li>
          ))}
          {onSale.length === 0 && <li className="text-sm text-muted">Nothing is on sale.</li>}
        </ul>
      </section>
    </div>
  );
}
