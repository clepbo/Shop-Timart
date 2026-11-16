import { isAdmin } from "@/lib/auth";
import { listCoupons, normaliseCode } from "@/lib/coupons";
import { qrCardSvg, qrOnlySvg, svgToPng } from "@/lib/qr-card";
import { formatPrice } from "@/lib/brand";

/**
 * Downloads for a discount code's QR:
 *   /api/admin/qr?code=SCAN5&kind=card|qr&format=png|svg
 * "card" is the full branded card exactly as shown in the admin; "qr" is the code alone.
 */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorised", { status: 401 });
  const url = new URL(req.url);
  const code = normaliseCode(url.searchParams.get("code") ?? "") || "SCAN5";
  const kind = url.searchParams.get("kind") === "qr" ? "qr" : "card";
  const format = url.searchParams.get("format") === "svg" ? "svg" : "png";
  const c = (await listCoupons()).find((x) => x.code === code);
  const offer = c ? (c.kind === "percent" ? `${c.value}% off` : `${formatPrice(c.value)} off`) : "5% off";

  const svg = kind === "card" ? qrCardSvg(code, offer) : qrOnlySvg(code);
  const name = `shop-timart-${kind === "card" ? "qr-card" : "qr"}-${code.toLowerCase()}`;
  if (format === "svg") {
    return new Response(svg, { headers: { "content-type": "image/svg+xml", "content-disposition": `attachment; filename="${name}.svg"` } });
  }
  const png = svgToPng(svg, kind === "card" ? 2520 : 2000);
  return new Response(new Uint8Array(png), { headers: { "content-type": "image/png", "content-disposition": `attachment; filename="${name}.png"` } });
}
