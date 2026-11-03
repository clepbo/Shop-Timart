import type { Gender } from "./types";

/**
 * Body profiles shoppers pick from in the Fit Studio.
 * Widths are half-widths (px) in the 240×560 illustration space.
 * `modelPhoto` is the base photo used by the AI try-on pipeline for this profile
 * (drop real, modestly-dressed model photos into /public/models/).
 */
export interface BodyProfile {
  id: string;
  gender: Gender;
  label: string;
  sizes: string;
  height: string;
  shoulder: number;
  bust: number;
  waist: number;
  hip: number;
  scale: number;
  modelPhoto?: string;
}

export const bodyProfiles: BodyProfile[] = [
  { id: "w-petite", gender: "women", label: "Petite", sizes: "UK 6–8", height: "5'1\"", shoulder: 30, bust: 26, waist: 19, hip: 29, scale: 0.93, modelPhoto: "/models/w-petite.jpg" },
  { id: "w-slim", gender: "women", label: "Slim", sizes: "UK 8–10", height: "5'6\"", shoulder: 32, bust: 28, waist: 21, hip: 32, scale: 1, modelPhoto: "/models/w-slim.jpg" },
  { id: "w-average", gender: "women", label: "Average", sizes: "UK 12", height: "5'5\"", shoulder: 34, bust: 31, waist: 24, hip: 35, scale: 0.98, modelPhoto: "/models/w-average.jpg" },
  { id: "w-curvy", gender: "women", label: "Curvy", sizes: "UK 14", height: "5'5\"", shoulder: 35, bust: 35, waist: 26, hip: 41, scale: 0.98, modelPhoto: "/models/w-curvy.jpg" },
  { id: "w-full", gender: "women", label: "Full", sizes: "UK 16–18", height: "5'4\"", shoulder: 38, bust: 39, waist: 33, hip: 45, scale: 0.97, modelPhoto: "/models/w-full.jpg" },
  { id: "w-plus", gender: "women", label: "Plus", sizes: "UK 20–22", height: "5'5\"", shoulder: 41, bust: 44, waist: 39, hip: 50, scale: 0.98, modelPhoto: "/models/w-plus.jpg" },
  { id: "m-slim", gender: "men", label: "Slim", sizes: "S", height: "5'9\"", shoulder: 37, bust: 31, waist: 26, hip: 29, scale: 1, modelPhoto: "/models/m-slim.jpg" },
  { id: "m-regular", gender: "men", label: "Regular", sizes: "M–L", height: "5'11\"", shoulder: 40, bust: 35, waist: 30, hip: 32, scale: 1.02, modelPhoto: "/models/m-regular.jpg" },
  { id: "m-broad", gender: "men", label: "Broad", sizes: "XL", height: "6'0\"", shoulder: 44, bust: 40, waist: 36, hip: 37, scale: 1.03, modelPhoto: "/models/m-broad.jpg" },
  { id: "m-big", gender: "men", label: "Big & Tall", sizes: "XXL", height: "6'1\"", shoulder: 47, bust: 45, waist: 43, hip: 42, scale: 1.04, modelPhoto: "/models/m-big.jpg" },
];

export function bodiesFor(gender: Gender) {
  return bodyProfiles.filter((b) => b.gender === gender);
}

export function defaultBody(gender: Gender) {
  return gender === "women" ? bodyProfiles[2] : bodyProfiles[7];
}

export const skinTones = [
  { id: "deep", label: "Deep", hex: "#5A3A2B" },
  { id: "brown", label: "Brown", hex: "#7B5139" },
  { id: "tan", label: "Tan", hex: "#A87553" },
  { id: "light", label: "Light", hex: "#D9A983" },
];
