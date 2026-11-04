import Link from "next/link";
import type { Metadata } from "next";
import { confirmOrderPayment } from "@/lib/paystack";
import { getRecord } from "@/lib/store";
import { formatPrice, whatsappLink, brand } from "@/lib/brand";
import { ClearCart } from "./ClearCart";
import { Receipt } from "@/components/shop/Receipt";
import { WhatsAppIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

type Order = { id: string; createdAt: string; total: number; subtotal: number; deliveryFee: number; status: string; customer: { name: string }; lines: { name: string; colour: string; size: string; quantity: number; total: number }[] };

export default async function ConfirmPage({ searchParams }: PageProps<"/checkout/confirm">) {
  const sp = await searchParams;
  const reference = typeof sp.reference === "string" ? sp.reference : typeof sp.trxref === "string" ? sp.trxref : "";
  let result: Awaited<ReturnType<typeof confirmOrderPayment>> | null = null;
  let error = "";
  try {
    result = reference ? await confirmOrderPayment(reference) : null;
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not verify payment";
  }
  const order = reference ? await getRecord<Order>("orders", reference) : null;
  const paid = result?.ok;

  return (
    <div className="container-x grid min-h-[60vh] items-start justify-center gap-10 py-16 md:grid-cols-[auto_minmax(0,32rem)]">
      {paid && order && (
        <Receipt data={{ id: order.id, date: order.createdAt, lines: order.lines, subtotal: order.subtotal, deliveryFee: order.deliveryFee, total: order.total, paid: true }} />
      )}
      <div className="w-full max-w-lg rounded-md bg-paper p-8 text-center sm:p-12">
        {paid ? (
          <>
            <ClearCart />
            <p className="text-3xl text-gold">✦</p>
            <h1 className="display mt-3 text-5xl">Thank you{order ? `, ${order.customer.name.split(" ")[0]}` : ""}!</h1>
            <p className="mt-4 text-muted">
              Payment received for order <strong className="text-ink">{reference}</strong>
              {order ? <> ({formatPrice(order.total)})</> : null}. We&apos;ll send delivery updates on WhatsApp.
            </p>
          </>
        ) : (
          <>
            <h1 className="display text-5xl">Payment not completed</h1>
            <p className="mt-4 text-muted">{error || (result && !result.ok ? result.reason : "We couldn't find that payment.")} Your bag has been kept — you can try again or reach us on WhatsApp.</p>
            <Link href="/checkout" className="btn-primary mt-6">Try again</Link>
          </>
        )}
        <a href={whatsappLink(`Hello ${brand.name}! About my order ${reference}`)} target="_blank" rel="noreferrer" className="btn-outline mt-4 w-full">
          <WhatsAppIcon className="size-4" /> Chat with us
        </a>
        <Link href="/shop" className="mt-5 block text-[12px] uppercase tracking-[0.16em] text-muted">Continue shopping</Link>
      </div>
    </div>
  );
}
