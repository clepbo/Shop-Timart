import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "timart_admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "timart-admin";
}

/** In production the default password is never accepted — ADMIN_PASSWORD must be set. */
function loginAllowed() {
  return !!process.env.ADMIN_PASSWORD || process.env.NODE_ENV !== "production";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function checkPassword(pw: string) {
  if (!loginAllowed()) return false;
  const a = Buffer.from(pw);
  const b = Buffer.from(secret());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession() {
  const issued = Date.now().toString();
  (await cookies()).set(COOKIE, `${issued}.${sign(issued)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [issued, sig] = v.split(".");
  return !!issued && !!sig && sig === sign(issued) && Date.now() - Number(issued) < 7 * 864e5;
}
