import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listCoupons, QR_COUPON } from "@/lib/coupons";
import { promoUrl, qrSvg } from "@/lib/qr";
import { formatPrice } from "@/lib/brand";
import { QrCard } from "@/components/brand/QrCard";
import { CouponForm } from "./CouponForm";
import { PrintButton } from "./PrintButton";
import { deleteCouponAction, toggleCouponAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function CouponsPage({ searchParams }: PageProps<"/admin/coupons">) {
  if (!(await isAdmin())) redirect("/admin/login");
  const sp = await searchParams;
  const coupons = await listCoupons();
  const qrCode = (typeof sp.qr === "string" && coupons.find((c) => c.code === sp.qr)?.code) || QR_COUPON;
  const qrCoupon = coupons.find((c) => c.code === qrCode)!;
  const offer = qrCoupon.kind === "percent" ? `${qrCoupon.value}% off` : `${formatPrice(qrCoupon.value)} off`;
  const svg = await qrSvg(qrCode);

  return (
    <div className="container-x py-10">
      <div className="print:hidden">
        <Link href="/admin" className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Dashboard</Link>
        <h1 className="display mt-2 text-5xl">Discounts & QR code</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Anyone who scans the QR code lands on the shop with the code saved, and it&apos;s applied automatically at checkout. The server checks every code again when the order is placed.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8 print:hidden">
          <section className="overflow-hidden rounded-md bg-paper">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="hidden p-4 md:table-cell">Rules</th>
                  <th className="p-4">Used</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {coupons.map((c) => (
                  <tr key={c.code} className={c.active ? "" : "opacity-55"}>
                    <td className="p-4">
                      <p className="font-semibold tracking-[0.08em]">{c.code}</p>
                      <p className="text-[12px] text-muted">{c.description ?? (c.active ? "Active" : "Paused")}</p>
                    </td>
                    <td className="p-4">{c.kind === "percent" ? `${c.value}%` : formatPrice(c.value)}</td>
                    <td className="hidden p-4 text-[12px] text-muted md:table-cell">
                      {[
                        c.oncePerCustomer && "once per customer",
                        c.minSubtotal && `min ${formatPrice(c.minSubtotal)}`,
                        c.maxUses && `max ${c.maxUses} uses`,
                        c.expiresAt && `until ${new Date(c.expiresAt).toLocaleDateString("en-NG")}`,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                    <td className="p-4">{c.uses ?? 0}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-3 text-[12px] uppercase tracking-[0.12em]">
                        <Link href={`/admin/coupons?qr=${c.code}`} className="text-wine hover:underline">QR</Link>
                        <form action={toggleCouponAction}>
                          <input type="hidden" name="code" value={c.code} />
                          <button className="text-muted hover:text-ink">{c.active ? "Pause" : "Activate"}</button>
                        </form>
                        {c.code !== QR_COUPON && (
                          <form action={deleteCouponAction}>
                            <input type="hidden" name="code" value={c.code} />
                            <button className="text-red-700 hover:underline">Delete</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="rounded-md bg-paper p-6">
            <h2 className="font-display text-2xl">Create or edit a code</h2>
            <p className="mt-1 text-sm text-muted">Saving an existing code updates it and keeps its usage count.</p>
            <CouponForm />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <QrCard svg={svg} code={qrCode} offer={offer} url={promoUrl(qrCode)} />
          <div className="flex flex-wrap gap-2 print:hidden">
            <a href={`/api/admin/qr?code=${qrCode}&format=png`} className="btn-primary flex-1 !py-3">Download PNG</a>
            <a href={`/api/admin/qr?code=${qrCode}&format=svg`} className="btn-outline flex-1 !py-3">SVG (for print)</a>
            <PrintButton />
          </div>
          <p className="text-[12px] text-muted print:hidden">
            Links to <span className="font-medium text-ink">{promoUrl(qrCode)}</span>. Test it with your phone camera before printing. Pausing the code stops the discount without reprinting.
          </p>
        </aside>
      </div>
    </div>
  );
}
