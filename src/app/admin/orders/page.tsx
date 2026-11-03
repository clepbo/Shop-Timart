import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listRecords } from "@/lib/store";
import { formatPrice, whatsappLink } from "@/lib/brand";
import { setOrderStatus } from "../actions";

export const dynamic = "force-dynamic";

type Order = {
  id: string;
  createdAt: string;
  status: string;
  method?: string;
  total: number;
  delivery: string;
  customer: { name: string; phone: string; email?: string; address: string; city: string; state: string; notes?: string };
  lines: { name: string; colour: string; size: string; quantity: number; total: number }[];
};
type Booking = { id: string; createdAt: string; name: string; phone: string; email?: string; service: string; occasion?: string; date?: string; mode?: string; budget?: string; notes?: string };

const statusCls: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-900",
  awaiting_payment: "bg-amber-100 text-amber-900",
  payment_failed: "bg-red-100 text-red-900",
  shipped: "bg-sky-100 text-sky-900",
  delivered: "bg-sand text-ink",
  cancelled: "bg-ink/10 text-muted",
};
const statuses = ["awaiting_payment", "paid", "shipped", "delivered", "cancelled"];
const phone = (p: string) => p.replace(/\D/g, "").replace(/^0/, "234");

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const tab = (await searchParams).tab === "bookings" ? "bookings" : "orders";
  const [orders, bookings] = await Promise.all([listRecords<Order>("orders"), listRecords<Booking>("bookings")]);

  return (
    <div className="container-x py-10">
      <Link href="/admin" className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Dashboard</Link>
      <h1 className="display mt-2 text-5xl">{tab === "orders" ? "Orders" : "Styling requests"}</h1>
      <div className="mt-6 flex gap-2">
        <Link href="/admin/orders" className={`border px-4 py-2 text-[12px] uppercase tracking-[0.12em] ${tab === "orders" ? "border-ink bg-ink text-ivory" : "border-ink/15"}`}>Orders ({orders.length})</Link>
        <Link href="/admin/orders?tab=bookings" className={`border px-4 py-2 text-[12px] uppercase tracking-[0.12em] ${tab === "bookings" ? "border-ink bg-ink text-ivory" : "border-ink/15"}`}>Styling ({bookings.length})</Link>
      </div>

      <div className="mt-6 space-y-3">
        {tab === "orders" &&
          (orders.length === 0 ? <p className="text-muted">No orders yet.</p> : orders.map((o) => (
            <details key={o.id} className="group rounded-md bg-paper p-5">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{o.id} · {o.customer.name}</p>
                  <p className="text-[12px] text-muted">{new Date(o.createdAt).toLocaleString("en-NG")} · {o.lines.reduce((n, l) => n + l.quantity, 0)} items · {o.method === "paystack" ? "Paystack" : "WhatsApp"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${statusCls[o.status] ?? "bg-sand"}`}>{o.status.replace("_", " ")}</span>
                  <span className="font-display text-xl">{formatPrice(o.total)}</span>
                </div>
              </summary>
              <div className="mt-4 grid gap-6 border-t border-ink/10 pt-4 text-sm sm:grid-cols-2">
                <ul className="space-y-1">
                  {o.lines.map((l, i) => <li key={i}>{l.name} — {l.colour}, {l.size} × {l.quantity} <span className="text-muted">({formatPrice(l.total)})</span></li>)}
                </ul>
                <div className="space-y-1 text-muted">
                  <p>{o.customer.phone} {o.customer.email && <>· {o.customer.email}</>}</p>
                  <p>{o.customer.address}, {o.customer.city}, {o.customer.state}</p>
                  <p>Delivery: {o.delivery}</p>
                  {o.customer.notes && <p>Note: {o.customer.notes}</p>}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a className="text-wine underline" target="_blank" rel="noreferrer" href={whatsappLink(`Hello ${o.customer.name}, this is Timart about your order ${o.id}.`).replace(/wa\.me\/\d+/, `wa.me/${phone(o.customer.phone)}`)}>WhatsApp customer</a>
                    <form action={setOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} className="rounded-lg border border-ink/15 bg-ivory px-2 py-1 text-[12px]">
                        {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                      </select>
                      <button className="text-[12px] uppercase tracking-[0.12em] text-ink">Update</button>
                    </form>
                  </div>
                </div>
              </div>
            </details>
          )))}

        {tab === "bookings" &&
          (bookings.length === 0 ? <p className="text-muted">No styling requests yet.</p> : bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-start justify-between gap-4 rounded-md bg-paper p-5 text-sm">
              <div>
                <p className="font-medium">{b.name} · {b.service}</p>
                <p className="text-muted">{b.occasion || "—"} · {b.date || "date flexible"} · {b.mode} · {b.budget}</p>
                {b.notes && <p className="mt-2 max-w-xl text-muted">“{b.notes}”</p>}
                <p className="mt-1 text-[12px] text-muted">{b.id} · {new Date(b.createdAt).toLocaleString("en-NG")}</p>
              </div>
              <a className="btn-outline !px-4 !py-2" target="_blank" rel="noreferrer" href={`https://wa.me/${phone(b.phone)}?text=${encodeURIComponent(`Hello ${b.name}, this is Timart confirming your ${b.service} request.`)}`}>Confirm on WhatsApp</a>
            </div>
          )))}
      </div>
    </div>
  );
}
