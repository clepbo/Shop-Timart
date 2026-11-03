import { confirmOrderPayment, validWebhookSignature } from "@/lib/paystack";

/** Paystack webhook — set this URL in Paystack Dashboard → Settings → API Keys & Webhooks. */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!validWebhookSignature(raw, req.headers.get("x-paystack-signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }
  const event = JSON.parse(raw) as { event: string; data?: { reference?: string } };
  if (event.event === "charge.success" && event.data?.reference) {
    try {
      await confirmOrderPayment(event.data.reference);
    } catch (e) {
      console.error("Paystack webhook verify failed", e);
      return new Response("Retry", { status: 500 });
    }
  }
  return new Response("ok");
}
