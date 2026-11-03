export type Pt = [number, number];

export const CX = 120;
export const Y = {
  head: 52,
  neckTop: 64,
  shoulder: 92,
  bust: 132,
  waist: 172,
  hip: 218,
  crotch: 252,
  knee: 352,
  ankle: 468,
  floor: 486,
};

const f = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through points, returned as cubic Bézier segments (no initial M). */
export function spline(pts: Pt[]): string {
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

/**
 * Symmetric garment outline. `left` lists [dx, y] points down the wearer's left edge
 * (dx is the offset from centre, usually negative). The shape is mirrored, closed with a
 * curved hem (`hem` px of drop) and a curved neckline (`neck` px of dip).
 */
export function outline(left: Pt[], { hem = 0, neck = 0 } = {}): string {
  const L = left.map(([dx, y]) => [CX + dx, y] as Pt);
  const R = left.map(([dx, y]) => [CX - dx, y] as Pt).reverse();
  const last = L[L.length - 1];
  const first = L[0];
  return (
    `M${f(first[0])},${f(first[1])}` +
    spline(L) +
    ` Q${CX},${f(last[1] + hem)} ${f(R[0][0])},${f(R[0][1])}` +
    spline(R) +
    ` Q${CX},${f(first[1] + neck)} ${f(first[0])},${f(first[1])} Z`
  );
}

/** A tapered limb (arm, leg, sleeve, trouser leg) along a skeleton with half-widths. */
export function limb(skeleton: Pt[], widths: number[]): string {
  const n = skeleton.length;
  const a: Pt[] = [];
  const b: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = skeleton[Math.max(0, i - 1)];
    const next = skeleton[Math.min(n - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = widths[i];
    a.push([skeleton[i][0] + nx * w, skeleton[i][1] + ny * w]);
    b.push([skeleton[i][0] - nx * w, skeleton[i][1] - ny * w]);
  }
  const br = b.reverse();
  return `M${f(a[0][0])},${f(a[0][1])}` + spline(a) + ` L${f(br[0][0])},${f(br[0][1])}` + spline(br) + " Z";
}

export function mirror(pts: Pt[]): Pt[] {
  return pts.map(([x, y]) => [2 * CX - x, y]);
}

export function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
