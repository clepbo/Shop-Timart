"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="label">Password</span>
        <input name="password" type="password" required className="field" autoFocus />
      </label>
      {state && !state.ok && <p className="text-sm text-red-700">{state.message}</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
