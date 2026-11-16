import { isAdmin } from "@/lib/auth";
import { normaliseCode } from "@/lib/coupons";
import { qrPng, qrSvg } from "@/lib/qr";

/** Downloadable QR code for a discount code: /api/admin/qr?code=SCAN5&format=png|svg */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorised", { status: 401 });
  const url = new URL(req.url);
  const code = normaliseCode(url.searchParams.get("code") ?? "") || "SCAN5";
  const name = `shop-timart-qr-${code.toLowerCase()}`;
  if (url.searchParams.get("format") === "svg") {
    return new Response(await qrSvg(code), { headers: { "content-type": "image/svg+xml", "content-disposition": `attachment; filename="${name}.svg"` } });
  }
  const png = await qrPng(code, 1600);
  return new Response(new Uint8Array(png), { headers: { "content-type": "image/png", "content-disposition": `attachment; filename="${name}.png"` } });
}
