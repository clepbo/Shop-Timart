import { useId, type ReactNode } from "react";
import type { GarmentType, Gender } from "@/lib/types";
import type { BodyProfile } from "@/lib/bodies";
import { shade, isLight } from "@/lib/color";
import { CX, Y, outline, limb, mirror, lerp, type Pt } from "./geometry";

export interface FigureProps {
  garment: GarmentType;
  gender: Gender;
  body: BodyProfile;
  color: string;
  accent?: string;
  skin?: string;
  className?: string;
  title?: string;
  /** Draw a soft floor shadow. */
  shadow?: boolean;
}


function Piece({ d, fill, base, sid }: { d: string; fill?: string; base: string; sid: string }) {
  return (
    <>
      <path d={d} fill={fill ?? base} />
      <path d={d} fill={`url(#${sid})`} />
    </>
  );
}

function Fold({ d, w = 1, stroke }: { d: string; w?: number; stroke: string }) {
  return <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" />;
}

type Skel = {
  arm: Pt[];
  leg: Pt[];
  hand: Pt;
  ankle: Pt;
};

function skeleton(b: BodyProfile): Skel {
  const shoulder: Pt = [CX - b.shoulder + 5, Y.shoulder + 6];
  const elbow: Pt = [CX - b.shoulder - 3 - Math.max(0, b.bust - 28) * 0.3, 178];
  const wrist: Pt = [CX - b.hip - 7, 250];
  const hipJ: Pt = [CX - b.hip * 0.45, Y.hip + 8];
  const knee: Pt = [CX - b.hip * 0.3 - 3, Y.knee];
  const ankle: Pt = [CX - b.hip * 0.2 - 5, Y.ankle];
  return { arm: [shoulder, elbow, wrist], leg: [hipJ, knee, ankle], hand: [wrist[0] - 0.5, wrist[1] + 10], ankle };
}

/**
 * Illustrated fashion figure — a parametric croquis that redraws any garment template on any
 * body profile in any colour. This is the instant fallback for products whose AI photo renders
 * have not been generated yet, and the visual language of the lookbook.
 */
export function Figure({
  garment,
  gender,
  body,
  color,
  accent,
  skin = "#7B5139",
  className,
  title,
  shadow = true,
}: FigureProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shadeId = `sh${uid}`;
  const s = skeleton(body);
  const b = body;
  const deep = shade(color, -0.28);
  const fold = isLight(color) ? "rgba(60,40,30,0.18)" : "rgba(0,0,0,0.28)";
  const acc = accent ?? (isLight(color) ? shade(color, -0.45) : shade(color, 0.55));

  const both = (fn: (side: 1 | -1) => ReactNode) => (
    <>
      {fn(1)}
      {fn(-1)}
    </>
  );
  const side = (pts: Pt[], sgn: 1 | -1) => (sgn === 1 ? pts : mirror(pts));

  // ---------- reusable garment parts ----------
  const sleeve = (widths: number[], reach = 1, fill = color) =>
    both((sg) => {
      const [sh, el, wr] = s.arm;
      const pts: Pt[] = [sh, el, lerp(el, wr, reach)];
      return <Piece sid={shadeId} base={color} key={`sl${sg}`} d={limb(side(pts, sg), widths)} fill={fill} />;
    });

  const trousers = (widths: number[], fill = color, top = Y.waist) => (
    <>
      <Piece
        sid={shadeId}
        base={color}
        d={outline(
          [
            [-(b.waist + 1.5), top],
            [-(b.hip + 2.5), Y.hip],
            [-(b.hip + 1.5), Y.crotch + 6],
          ],
          { hem: 4 },
        )}
        fill={fill}
      />
      {both((sg) => {
        const [, k, a] = s.leg;
        const pts: Pt[] = [[CX - b.hip * 0.5, Y.hip + 4], [k[0], k[1]], [a[0], a[1] + 6]];
        return <Piece sid={shadeId} base={color} key={`tr${sg}`} d={limb(side(pts, sg), widths)} fill={fill} />;
      })}
      <Fold stroke={fold} d={`M${CX},${Y.crotch} L${CX},${Y.crotch + 4}`} />
    </>
  );

  const belt = (fill: string, y = Y.waist) => (
    <path
      d={outline([
        [-(b.waist + 2.2), y - 3.5],
        [-(b.waist + 2.6), y + 3.5],
      ])}
      fill={fill}
    />
  );

  const skirtFolds = (top: number, bottom: number, spread: number, n = 3) => (
    <>
      {Array.from({ length: n }).flatMap((_, i) => {
        const t = (i + 1) / (n + 1);
        const x0 = (b.waist * 2 * t - b.waist) * 0.9;
        const x1 = (spread * 2 * t - spread) * 0.95;
        return [<Fold stroke={fold} key={`f${i}`} d={`M${CX + x0},${top} Q${CX + x0 * 1.1},${(top + bottom) / 2} ${CX + x1},${bottom}`} />];
      })}
    </>
  );

  // ---------- garments ----------
  let body1: ReactNode = null; // garment drawn under arms
  let body2: ReactNode = null; // garment drawn over arms (sleeves, trims)

  switch (garment) {
    case "maxi-dress": {
      const hemW = b.hip + 28;
      body1 = (
        <>
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-8, Y.shoulder - 8],
                [-(b.shoulder + 1), Y.shoulder + 1],
                [-(b.bust + 2), Y.bust],
                [-(b.waist + 1.5), Y.waist],
                [-(b.hip + 5), Y.hip],
                [-(b.hip + 17), 400],
                [-hemW, 474],
              ],
              { hem: 5, neck: 7 },
            )}
          />
          {skirtFolds(Y.waist + 6, 476, hemW, 4)}
          {belt(deep)}
        </>
      );
      body2 = sleeve([8.5, 7.2, 5.6], 0.94);
      break;
    }
    case "midi-dress": {
      const hemW = b.hip + 22;
      body1 = (
        <>
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-8, Y.shoulder - 8],
                [-(b.shoulder + 1), Y.shoulder + 1],
                [-(b.bust + 2), Y.bust],
                [-(b.waist + 1.5), Y.waist],
                [-(b.hip + 8), Y.hip + 4],
                [-hemW, 392],
              ],
              { hem: 5, neck: 5 },
            )}
          />
          {skirtFolds(Y.waist + 6, 394, hemW, 5)}
          {belt(acc)}
        </>
      );
      body2 = sleeve([8.5, 7.4, 6.4], 0.6);
      break;
    }
    case "kaftan": {
      body1 = (
        <>
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-9, Y.shoulder - 8],
                [-(b.shoulder + 3), Y.shoulder + 2],
                [-(b.bust + 7), Y.bust],
                [-(b.hip + 5), Y.waist + 12],
                [-(b.hip + 11), Y.hip + 24],
                [-(b.hip + 19), 476],
              ],
              { hem: 4, neck: 9 },
            )}
          />
          <Fold stroke={fold} d={`M${CX - b.hip * 0.5},${Y.hip} Q${CX - b.hip * 0.55},380 ${CX - b.hip * 0.6},476`} />
          <Fold stroke={fold} d={`M${CX + b.hip * 0.5},${Y.hip} Q${CX + b.hip * 0.55},380 ${CX + b.hip * 0.6},476`} />
          <path
            d={`M${CX - 9},${Y.shoulder - 8} L${CX},${Y.shoulder + 30} L${CX + 9},${Y.shoulder - 8}`}
            fill="none"
            stroke={acc}
            strokeWidth={2.4}
          />
          <path d={`M${CX},${Y.shoulder + 30} L${CX},476`} stroke={acc} strokeWidth={1.4} strokeDasharray="5 3" />
        </>
      );
      body2 = sleeve([9.5, 13, 21], 1);
      break;
    }
    case "two-piece": {
      const skirtFill = accent ?? deep;
      body1 = (
        <>
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-(b.waist + 1), Y.waist - 2],
                [-(b.hip + 4), Y.hip],
                [-(b.hip + 13), 400],
                [-(b.hip + 19), 474],
              ],
              { hem: 4 },
            )}
            fill={skirtFill}
          />
          {skirtFolds(Y.hip + 20, 476, b.hip + 19, 3)}
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-8, Y.shoulder - 8],
                [-(b.shoulder + 1.5), Y.shoulder + 1],
                [-(b.bust + 3), Y.bust],
                [-(b.waist + 2.5), Y.waist],
                [-(b.hip + 9), Y.hip + 14],
              ],
              { hem: 6, neck: 7 },
            )}
          />
          <Fold stroke={fold} d={`M${CX - b.waist - 2},${Y.waist + 2} L${CX + b.waist + 2},${Y.waist + 2}`} w={1.2} />
        </>
      );
      body2 = sleeve([11, 8, 6], 0.94);
      break;
    }
    case "suit": {
      body1 = (
        <>
          {trousers([b.hip * 0.58, 16.5, 20])}
          <Fold stroke={fold} d={`M${s.leg[1][0]},${Y.hip + 30} L${s.leg[2][0] - 2},${Y.ankle + 4}`} />
          <Fold stroke={fold} d={`M${2 * CX - s.leg[1][0]},${Y.hip + 30} L${2 * CX - s.leg[2][0] + 2},${Y.ankle + 4}`} />
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-9, Y.shoulder - 8],
                [-(b.shoulder + 3), Y.shoulder + 1],
                [-(b.bust + 3), Y.bust],
                [-(b.waist + 3), Y.waist],
                [-(b.hip + 5), Y.hip + 14],
              ],
              { hem: 2, neck: 6 },
            )}
          />
          <path d={`M${CX - 9},${Y.shoulder - 7} L${CX + 9},${Y.shoulder - 7} L${CX},${Y.bust + 22} Z`} fill="#F1ECE4" />
          <path
            d={`M${CX - 10},${Y.shoulder - 8} L${CX - 16},${Y.bust - 6} L${CX},${Y.bust + 24} M${CX + 10},${Y.shoulder - 8} L${CX + 16},${Y.bust - 6} L${CX},${Y.bust + 24}`}
            fill="none"
            stroke={deep}
            strokeWidth={1.4}
          />
          <Fold stroke={fold} d={`M${CX},${Y.bust + 24} L${CX},${Y.hip + 15}`} />
          <circle cx={CX + 2.5} cy={Y.waist - 4} r={2} fill={accent ?? "#C9A86A"} />
          <Fold stroke={fold} d={`M${CX - b.waist - 2},${Y.waist + 18} l12,0 M${CX + b.waist + 2},${Y.waist + 18} l-12,0`} w={1.2} />
        </>
      );
      body2 = sleeve([9, 8, 6.6], 0.95);
      break;
    }
    case "jumpsuit": {
      body1 = (
        <>
          {trousers([b.hip * 0.58, 17, 21])}
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-8, Y.shoulder - 8],
                [-(b.shoulder + 1), Y.shoulder + 1],
                [-(b.bust + 2), Y.bust],
                [-(b.waist + 1.5), Y.waist],
                [-(b.hip + 3), Y.hip + 8],
              ],
              { hem: 3, neck: 12 },
            )}
          />
          <path d={`M${CX - 7},${Y.shoulder - 7} L${CX},${Y.shoulder + 16} L${CX + 7},${Y.shoulder - 7}`} fill="none" stroke={deep} strokeWidth={1.2} />
          {belt(acc)}
        </>
      );
      body2 = sleeve([8.5, 7.5, 6.5], 0.94);
      break;
    }
    case "senator": {
      body1 = (
        <>
          {trousers([b.hip * 0.55, 12.5, 10.5])}
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-8, Y.shoulder - 8],
                [-(b.shoulder + 1), Y.shoulder + 1],
                [-(b.bust + 3), Y.bust],
                [-(b.waist + 4), Y.waist],
                [-(b.hip + 5), Y.hip],
                [-(b.hip + 6), 354],
              ],
              { hem: 2, neck: 6 },
            )}
          />
          <path d={`M${CX - 2},${Y.shoulder - 2} L${CX - 2},${Y.bust + 22} M${CX + 2},${Y.shoulder - 2} L${CX + 2},${Y.bust + 22}`} stroke={acc} strokeWidth={1.6} />
          <path d={`M${CX - 8},${Y.shoulder - 8} Q${CX},${Y.shoulder} ${CX + 8},${Y.shoulder - 8}`} fill="none" stroke={acc} strokeWidth={2.2} />
          <Fold stroke={fold} d={`M${CX - b.hip - 5},300 L${CX - b.hip - 5},354 M${CX + b.hip + 5},300 L${CX + b.hip + 5},354`} w={1.4} />
        </>
      );
      body2 = sleeve([10, 8.6, 7.2], 0.95);
      break;
    }
    case "shirt-trousers": {
      const trouserFill = accent ?? (isLight(color) ? "#2C2F3A" : shade(color, -0.45));
      body1 = (
        <>
          {trousers([b.hip * 0.55, 12.5, 10.8], trouserFill, Y.waist + 6)}
          <Piece
            sid={shadeId}
            base={color}
            d={outline(
              [
                [-7, Y.shoulder - 9],
                [-(b.shoulder + 1), Y.shoulder + 1],
                [-(b.bust + 3), Y.bust],
                [-(b.waist + 2.5), Y.waist + 9],
              ],
              { neck: 4 },
            )}
          />
          <path d={`M${CX - 8},${Y.shoulder - 9} L${CX - 1},${Y.shoulder + 1} L${CX - 11},${Y.shoulder - 1} Z M${CX + 8},${Y.shoulder - 9} L${CX + 1},${Y.shoulder + 1} L${CX + 11},${Y.shoulder - 1} Z`} fill={shade(color, -0.12)} />
          <Fold stroke={fold} d={`M${CX},${Y.shoulder + 1} L${CX},${Y.waist + 8}`} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={CX + 1.6} cy={Y.shoulder + 10 + i * 18} r={1} fill={fold} />
          ))}
          <path
            d={outline([
              [-(b.waist + 2.6), Y.waist + 6],
              [-(b.waist + 2.8), Y.waist + 12],
            ])}
            fill="#2A211C"
          />
          <rect x={CX - 3} y={Y.waist + 6.5} width={6} height={5} fill="none" stroke="#C9A86A" strokeWidth={1} />
        </>
      );
      body2 = sleeve([10, 8.4, 7], 0.95);
      break;
    }
  }

  const shoe = gender === "women" ? "#3A2A24" : "#1E1815";
  const skinDeep = shade(skin, -0.18);

  return (
    <svg viewBox="0 0 240 500" className={className} role="img" aria-label={title ?? `${garment} illustration`}>
      <defs>
        <linearGradient id={shadeId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {shadow && <ellipse cx={CX} cy={Y.floor + 2} rx={b.hip + 30} ry={6} fill="#000" opacity={0.07} />}
      <g transform={`translate(${CX} ${Y.floor}) scale(${b.scale}) translate(${-CX} ${-Y.floor})`}>
        {/* legs + shoes */}
        {both((sg) => (
          <g key={`leg${sg}`}>
            <path d={limb(side(s.leg, sg), [b.hip * 0.48, 8, 4.6])} fill={skinDeep} />
            <ellipse
              cx={side([s.ankle], sg)[0][0] - 3 * sg}
              cy={Y.ankle + 11}
              rx={8.5}
              ry={4.6}
              fill={shoe}
            />
          </g>
        ))}
        {/* neck */}
        <path d={limb([[CX, Y.neckTop], [CX, Y.shoulder - 4]], [5.8, 7.2])} fill={skinDeep} />
        {/* arms */}
        {both((sg) => (
          <path key={`arm${sg}`} d={limb(side(s.arm, sg), [6.4, 5.3, 4])} fill={skin} />
        ))}
        {body1}
        {body2}
        {/* hands */}
        {both((sg) => {
          const h = side([s.hand], sg)[0];
          return <ellipse key={`hand${sg}`} cx={h[0]} cy={h[1]} rx={4.4} ry={7} fill={skin} />;
        })}
        {/* head */}
        <ellipse cx={CX} cy={Y.head} rx={15.5} ry={19.5} fill={skin} />
        {gender === "women" ? (
          <g>
            <path
              d={`M${CX - 16.5},${Y.head + 1} C${CX - 25},${Y.head - 26} ${CX - 10},${Y.head - 41} ${CX + 2},${Y.head - 39} C${CX + 19},${Y.head - 38} ${CX + 26},${Y.head - 21} ${CX + 16.5},${Y.head + 1} C${CX + 8},${Y.head - 9} ${CX - 8},${Y.head - 9} ${CX - 16.5},${Y.head + 1} Z`}
              fill={acc}
            />
            <path
              d={`M${CX - 13},${Y.head - 7} C${CX - 6},${Y.head - 27} ${CX + 9},${Y.head - 32} ${CX + 17},${Y.head - 15} M${CX - 18},${Y.head - 18} C${CX - 10},${Y.head - 34} ${CX + 6},${Y.head - 38} ${CX + 14},${Y.head - 30}`}
              fill="none"
              stroke={shade(acc, -0.22)}
              strokeWidth={1.3}
            />
          </g>
        ) : (
          <path
            d={`M${CX - 16},${Y.head - 1} Q${CX - 17.5},${Y.head - 23} ${CX},${Y.head - 23} Q${CX + 17.5},${Y.head - 23} ${CX + 16},${Y.head - 1} Q${CX + 9},${Y.head - 13} ${CX - 16},${Y.head - 1} Z`}
            fill="#1E1714"
          />
        )}
      </g>
    </svg>
  );
}
