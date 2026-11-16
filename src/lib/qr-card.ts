import "server-only";
import { readFileSync } from "fs";
import path from "path";
import QRCode from "qrcode";
import { parse, type Font } from "opentype.js";
import type * as opentype from "opentype.js";
import { Resvg } from "@resvg/resvg-js";
import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX, PATTERN_PATHS, PATTERN_VIEWBOX } from "@/components/brand/paths";
import { brand } from "./brand";

/**
 * The printable QR card, drawn as ONE self-contained SVG: brand pattern, monogram, QR modules and
 * text converted to outlines (so it looks identical in the admin, the PNG and at the printer, with no
 * fonts installed). The PNG is rendered from this same SVG.
 */

const C = { espresso: "#2E1F17", cocoa: "#6B4A35", camel: "#A67B5B", ivory: "#F7F2EA" };
const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");


const fonts: Record<string, Font> = {};
function font(file: string): Font {
  if (!fonts[file]) {
    const b = readFileSync(path.join(FONT_DIR, file));
    fonts[file] = parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  }
  return fonts[file];
}
const serif = () => font("Alyamama-SemiBold.ttf");
const sans = () => font("IBMPlexSansArabic-Regular.ttf");
const sansMedium = () => font("IBMPlexSansArabic-Medium.ttf");

/** Text as an SVG path, centred on cx, with letter-spacing in em. Returns the path and its width. */
function textPath(f: Font, text: string, size: number, cx: number, baseline: number, tracking = 0, fill = C.ivory, opacity = 1) {
  const glyphs = f.stringToGlyphs(text);
  const scale = size / f.unitsPerEm;
  const track = tracking * size;
  let width = 0;
  glyphs.forEach((g, i) => {
    width += (Number(g.advanceWidth) || 0) * scale;
    if (i < glyphs.length - 1) width += kern(f, g, glyphs[i + 1]) * scale + track;
  });
  let x = cx - width / 2;
  let d = "";
  glyphs.forEach((g, i) => {
    // Round first: opentype.js emits NaN for positions like 424.2000000000001.
    d += g.getPath(Math.round(x * 100) / 100, Math.round(baseline * 100) / 100, size).toPathData(2);
    x += (Number(g.advanceWidth) || 0) * scale;
    if (i < glyphs.length - 1) x += kern(f, g, glyphs[i + 1]) * scale + track;
  });
  return { svg: `<path d="${d}" fill="${fill}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ""}/>`, width };
}

function kern(f: Font, a: opentype.Glyph, b: opentype.Glyph) {
  const v = Number(f.getKerningValue(a, b));
  return Number.isFinite(v) ? v : 0;
}

const vb = (v: string) => v.split(" ").map(Number) as [number, number, number, number];

/** Places a mark (viewBox + paths) centred in a box, scaled to a given height. */
function mark(viewBox: string, paths: readonly string[], cx: number, cy: number, height: number, fill: string, opacity = 1) {
  const [x, y, w, h] = vb(viewBox);
  const s = height / h;
  const tx = cx - (w * s) / 2 - x * s;
  const ty = cy - (h * s) / 2 - y * s;
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})" fill="${fill}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ""}>${paths.map((d) => `<path d="${d}"/>`).join("")}</g>`;
}

/** QR modules as a single path inside a square, leaving a clear centre for the monogram. */
function qrModules(url: string, x0: number, y0: number, size: number, fill: string) {
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const m = size / n;
  let d = "";
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (qr.modules.get(r, c)) {
        let e = c;
        while (e + 1 < n && qr.modules.get(r, e + 1)) e++;
        d += `M${(x0 + c * m).toFixed(2)} ${(y0 + r * m).toFixed(2)}h${((e - c + 1) * m).toFixed(2)}v${m.toFixed(2)}h-${((e - c + 1) * m).toFixed(2)}z`;
        c = e + 1;
      } else c++;
    }
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

/** Centre badge: an ivory plate with the monogram, sized to stay well inside QR error correction. */
function centreBadge(cx: number, cy: number, qrSize: number) {
  const plate = qrSize * 0.24;
  return (
    `<rect x="${cx - plate / 2}" y="${cy - plate / 2}" width="${plate}" height="${plate}" fill="${C.ivory}"/>` +
    mark(MONOGRAM_VIEWBOX, MONOGRAM_PATHS, cx, cy, plate * 0.5, C.cocoa)
  );
}

export const promoLink = (code: string) => `https://${brand.domain}/?promo=${encodeURIComponent(code)}`;

export function qrCardSvg(code: string, offer: string) {
  const W = 840;
  const H = 1240;
  const cx = W / 2;
  const url = promoLink(code);
  const qrBox = 480;
  const qrX = cx - qrBox / 2;
  const qrY = 330;
  const pad = 26;
  const [, , pw, ph] = vb(PATTERN_VIEWBOX);
  const tileW = 300;
  const tileH = (tileW * ph) / pw;

  const codeLabel = textPath(sansMedium(), `CODE: ${code}`, 24, cx, 1050, 0.2, C.camel);
  const boxW = codeLabel.width + 64;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<defs><pattern id="p" width="${tileW + 40}" height="${tileH + 30}" patternUnits="userSpaceOnUse">${mark(PATTERN_VIEWBOX, PATTERN_PATHS, (tileW + 40) / 2, (tileH + 30) / 2, tileH, C.cocoa, 0.42)}</pattern></defs>`,
    `<rect width="${W}" height="${H}" fill="${C.espresso}"/>`,
    `<rect width="${W}" height="${H}" fill="url(#p)"/>`,
    mark(MONOGRAM_VIEWBOX, MONOGRAM_PATHS, cx, 112, 78, C.camel),
    textPath(serif(), "SHOP TIMART", 56, cx, 232, 0.12).svg,
    textPath(sans(), brand.slogan, 24, cx, 278, 0.14, C.ivory, 0.72).svg,
    `<rect x="${qrX}" y="${qrY}" width="${qrBox}" height="${qrBox}" fill="${C.ivory}"/>`,
    qrModules(url, qrX + pad, qrY + pad, qrBox - pad * 2, C.espresso),
    centreBadge(cx, qrY + qrBox / 2, qrBox - pad * 2),
    textPath(serif(), offer, 72, cx, 920, 0).svg,
    textPath(sans(), "Scan to shop — applied automatically at checkout", 26, cx, 972, 0, C.ivory, 0.82).svg,
    `<rect x="${cx - boxW / 2}" y="1010" width="${boxW}" height="60" fill="none" stroke="${C.camel}" stroke-opacity="0.65" stroke-width="2"/>`,
    codeLabel.svg,
    textPath(sans(), brand.domain, 24, cx, 1142, 0.08, C.ivory, 0.62).svg,
    `</svg>`,
  ].join("");
}

/** Just the QR (with the monogram in the middle) on ivory, for flyers and stickers. */
export function qrOnlySvg(code: string) {
  const S = 1000;
  const pad = 60;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">`,
    `<rect width="${S}" height="${S}" fill="${C.ivory}"/>`,
    qrModules(promoLink(code), pad, pad, S - pad * 2, C.espresso),
    centreBadge(S / 2, S / 2, S - pad * 2),
    `</svg>`,
  ].join("");
}

export function svgToPng(svg: string, width: number) {
  return new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: false } }).render().asPng();
}
