import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";
import { paystackEnabled } from "@/lib/paystack";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-x pb-24 pt-10">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-3 text-[52px] sm:text-[68px]">Almost <span className="accent text-camel">yours</span></h1>
      <CheckoutForm paystack={paystackEnabled()} />
    </div>
  );
}
