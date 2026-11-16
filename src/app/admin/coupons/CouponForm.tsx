"use client";

import { useActionState } from "react";
import { saveCouponAction } from "../actions";

export function CouponForm() {
  const [state, action, pending] = useActionState(saveCouponAction, null);
  return (
    <form action={action} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label><span className="label">Code *</span><input name="code" required className="field uppercase" placeholder="e.g. EASTER10" /></label>
      <div className="grid grid-cols-[1fr_120px] gap-2">
        <label><span className="label">Discount *</span><input name="value" type="number" min={1} required className="field" placeholder="10" /></label>
        <label><span className="label">Type</span>
          <select name="kind" className="field"><option value="percent">% off</option><option value="fixed">₦ off</option></select>
        </label>
      </div>
      <label className="sm:col-span-2"><span className="label">Description</span><input name="description" className="field" placeholder="Shown to the customer, e.g. Easter offer" /></label>
      <label><span className="label">Minimum order (₦)</span><input name="minSubtotal" type="number" min={0} className="field" /></label>
      <label><span className="label">Maximum uses</span><input name="maxUses" type="number" min={0} className="field" placeholder="Unlimited" /></label>
      <label><span className="label">Expires on</span><input name="expiresAt" type="date" className="field" /></label>
      <div className="flex flex-col justify-end gap-2 pb-1 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="oncePerCustomer" defaultChecked className="accent-wine" /> Once per customer (by phone)</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked className="accent-wine" /> Active</label>
      </div>
      {state && <p className={`text-sm sm:col-span-2 ${state.ok ? "text-emerald-800" : "text-red-700"}`}>{state.message}</p>}
      <button disabled={pending} className="btn-primary sm:col-span-2">{pending ? "Saving…" : "Save code"}</button>
    </form>
  );
}
