"use client";

import { useActionState } from "react";
import { bookStyling } from "../actions/public";
import { occasions } from "@/lib/catalog";
import { WhatsAppIcon } from "@/components/Icons";

export function BookingForm({ services }: { services: string[] }) {
  const [state, action, pending] = useActionState(bookStyling, null);

  if (state?.ok)
    return (
      <div className="rounded-md bg-paper p-8 text-center sm:p-12">
        <p className="text-3xl text-gold">✦</p>
        <p className="display mt-4 text-4xl">Thank you</p>
        <p className="mx-auto mt-3 max-w-sm text-muted">{state.message}</p>
        {state.link && (
          <a href={state.link} target="_blank" rel="noreferrer" className="btn-primary mt-6">
            <WhatsAppIcon className="size-4" /> Continue on WhatsApp
          </a>
        )}
      </div>
    );

  return (
    <form action={action} className="grid gap-5 rounded-md bg-paper p-6 sm:grid-cols-2 sm:p-10">
      <div className="sm:col-span-2">
        <p className="display text-4xl">Book a session</p>
        <p className="mt-2 text-sm text-muted">Tell us about the moment you&apos;re dressing for.</p>
      </div>
      <label>
        <span className="label">Full name *</span>
        <input name="name" required className="field" autoComplete="name" />
      </label>
      <label>
        <span className="label">Phone / WhatsApp *</span>
        <input name="phone" required className="field" type="tel" autoComplete="tel" placeholder="+234" />
      </label>
      <label className="sm:col-span-2">
        <span className="label">Email</span>
        <input name="email" className="field" type="email" autoComplete="email" />
      </label>
      <label>
        <span className="label">Service *</span>
        <select name="service" required className="field" defaultValue="">
          <option value="" disabled>Choose a service</option>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Occasion</span>
        <select name="occasion" className="field" defaultValue="">
          <option value="">Select</option>
          {occasions.map((o) => (
            <option key={o}>{o}</option>
          ))}
          <option>Other</option>
        </select>
      </label>
      <label>
        <span className="label">Event date</span>
        <input name="date" type="date" className="field" />
      </label>
      <label>
        <span className="label">Session</span>
        <select name="mode" className="field">
          <option>In-store (Benin City)</option>
          <option>Virtual</option>
          <option>Home visit</option>
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label">Budget for the look</span>
        <select name="budget" className="field">
          <option>Under ₦100,000</option>
          <option>₦100,000 – ₦250,000</option>
          <option>₦250,000 – ₦500,000</option>
          <option>₦500,000+</option>
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label">Anything else?</span>
        <textarea name="notes" rows={4} className="field" placeholder="Colours you love, dress code, coverage preferences…" />
      </label>
      {state && !state.ok && <p className="text-sm text-red-700 sm:col-span-2">{state.message}</p>}
      <button disabled={pending} className="btn-primary sm:col-span-2">
        {pending ? "Sending…" : "Request my session"}
      </button>
    </form>
  );
}
