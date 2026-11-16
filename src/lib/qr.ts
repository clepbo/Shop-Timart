import "server-only";
import QRCode from "qrcode";
import { brand } from "./brand";

/** The link printed on the store's QR code. */
export const promoUrl = (code: string) => `https://${brand.domain}/?promo=${encodeURIComponent(code)}`;

const colours = { dark: "#2E1F17", light: "#F7F2EA" };

export function qrSvg(code: string) {
  // High error correction leaves room for the monogram in the middle.
  return QRCode.toString(promoUrl(code), { type: "svg", errorCorrectionLevel: "H", margin: 2, color: colours });
}

export function qrPng(code: string, width = 1200) {
  return QRCode.toBuffer(promoUrl(code), { errorCorrectionLevel: "H", margin: 2, width, color: colours });
}
