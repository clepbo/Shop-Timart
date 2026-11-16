import { NextResponse, type NextRequest } from "next/server";

/**
 * Site-content preview: pages opened with ?__cms=draft (inside the admin's preview frame)
 * are rendered with the owner's unpublished draft. The draft is only used when the request
 * also carries a valid admin session — see getContent().
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.searchParams.get("__cms") !== "draft") return NextResponse.next();
  const headers = new Headers(request.headers);
  headers.set("x-cms-preview", "1");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next|admin|.*\\..*).*)"],
};
