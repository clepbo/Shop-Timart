/**
 * Decorative footer illustration: a "skyline" of fashion pieces — dress forms, handbags, a garment
 * rack, hats, heels and shopping bags — drawn as flat shapes in the brand's beige and brown palette.
 */
const C = {
  espresso: "#3e2a1e",
  brown: "#6b4429",
  cognac: "#8b5a3c",
  tan: "#a77b52",
  camel: "#c49a6c",
  beige: "#dcc3a1",
  cream: "#efe2cf",
  sand: "#e6d6bf",
  gold: "#c9a24f",
};

type Item = { w: number; el: React.ReactNode };

function DressForm({ jacket, inner, skirt }: { jacket: string; inner: string; skirt?: string }): Item {
  return {
    w: 84,
    el: (
      <g>
        <path d="M0,-12 L-24,0 M0,-12 L24,0 M0,-12 L0,0" stroke={C.espresso} strokeWidth={3} strokeLinecap="round" />
        <rect x={-2} y={skirt ? -40 : -84} width={4} height={skirt ? 30 : 74} fill={C.espresso} />
        {skirt && <path d="M-22,-84 L22,-84 L34,-38 L-34,-38 Z" fill={skirt} />}
        <rect x={-6} y={-164} width={12} height={10} rx={3} fill={C.espresso} />
        <path d="M-30,-152 Q0,-162 30,-152 L35,-140 Q27,-120 23,-111 Q31,-97 33,-82 L-33,-82 Q-31,-97 -23,-111 Q-27,-120 -35,-140 Z" fill={jacket} />
        <path d="M-9,-156 L0,-120 L9,-156 Z" fill={inner} />
        <path d="M-12,-156 L-17,-130 L0,-112 M12,-156 L17,-130 L0,-112" fill="none" stroke={C.espresso} strokeOpacity={0.35} strokeWidth={1.5} />
        <circle cx={2} cy={-104} r={2.2} fill={C.gold} />
      </g>
    ),
  };
}

function Handbag({ body, flap }: { body: string; flap: string }): Item {
  return {
    w: 96,
    el: (
      <g>
        <path d="M-18,-52 Q-18,-80 0,-80 Q18,-80 18,-52" fill="none" stroke={flap} strokeWidth={6} />
        <path d="M-42,0 L-35,-54 L35,-54 L42,0 Z" fill={body} />
        <path d="M-35,-54 L35,-54 L31,-30 Q0,-20 -31,-30 Z" fill={flap} />
        <rect x={-5} y={-29} width={10} height={8} rx={1.5} fill={C.gold} />
      </g>
    ),
  };
}

function Heel({ color }: { color: string }): Item {
  return {
    w: 64,
    el: (
      <g>
        <path d="M-30,0 L-30,-7 Q-22,-16 -6,-18 Q10,-24 20,-36 L28,-36 L28,-30 Q22,-22 22,0 L18,0 L18,-18 Q8,-10 -4,-6 L-22,0 Z" fill={color} />
        <rect x={18} y={-14} width={4} height={14} fill={C.espresso} />
      </g>
    ),
  };
}

function Rack(): Item {
  const coats = [C.camel, C.brown, C.beige];
  return {
    w: 220,
    el: (
      <g>
        <path d="M-100,0 L-100,-158 L100,-158 L100,0 M-114,0 L-86,0 M86,0 L114,0" fill="none" stroke={C.espresso} strokeWidth={4} strokeLinecap="round" />
        {coats.map((c, i) => {
          const x = -58 + i * 58;
          return (
            <g key={i} transform={`translate(${x} 0)`}>
              <g className="frieze-sway" style={{ animationDelay: `${i * -1.3}s` }}>
              <path d="M0,-158 Q5,-152 0,-148 L-18,-138 L18,-138 Z" fill="none" stroke={C.espresso} strokeWidth={1.8} />
              <path d={`M-20,-138 L20,-138 L${i === 1 ? 24 : 27},-${i === 1 ? 70 : 42} L-${i === 1 ? 24 : 27},-${i === 1 ? 70 : 42} Z`} fill={c} />
              <path d="M-7,-138 L0,-112 L7,-138" fill={C.cream} />
              <path d="M0,-112 L0,-50" stroke={C.espresso} strokeOpacity={0.25} strokeWidth={1.2} />
              </g>
            </g>
          );
        })}
      </g>
    ),
  };
}

function Tote({ color }: { color: string }): Item {
  return {
    w: 100,
    el: (
      <g>
        <path d="M-24,-72 Q-24,-104 -8,-104 Q6,-104 6,-72 M-6,-72 Q-6,-98 10,-98 Q24,-98 24,-72" fill="none" stroke={C.espresso} strokeWidth={3.5} />
        <path d="M-46,0 L-38,-72 L38,-72 L46,0 Z" fill={color} />
        <text x={0} y={-28} textAnchor="middle" fontSize={22} fontWeight={600} fontFamily="var(--font-sora), sans-serif" fill={C.cream} letterSpacing={2}>
          T
        </text>
      </g>
    ),
  };
}

function HatBox(): Item {
  return {
    w: 116,
    el: (
      <g>
        <rect x={-42} y={-46} width={84} height={46} fill={C.sand} />
        <rect x={-46} y={-52} width={92} height={10} rx={2} fill={C.camel} />
        <rect x={-42} y={-30} width={84} height={6} fill={C.brown} opacity={0.5} />
        <ellipse cx={0} cy={-58} rx={56} ry={8} fill={C.brown} />
        <path d="M-28,-60 Q-26,-96 0,-96 Q26,-96 28,-60 Z" fill={C.cognac} />
        <rect x={-28} y={-70} width={56} height={8} fill={C.espresso} />
      </g>
    ),
  };
}

function Mirror(): Item {
  return {
    w: 84,
    el: (
      <g>
        <path d="M-10,-66 L-22,0 M10,-66 L22,0" stroke={C.espresso} strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={0} cy={-116} rx={32} ry={48} fill={C.cream} stroke={C.tan} strokeWidth={6} />
        <path d="M-12,-140 L8,-152 M-14,-126 L14,-142" stroke="#fff" strokeOpacity={0.8} strokeWidth={3} strokeLinecap="round" />
      </g>
    ),
  };
}

function Crossbody({ color }: { color: string }): Item {
  return {
    w: 76,
    el: (
      <g>
        <path d="M-24,-40 Q-20,-112 0,-112 Q20,-112 24,-40" fill="none" stroke={C.espresso} strokeWidth={2} />
        <rect x={-30} y={-42} width={60} height={42} rx={8} fill={color} />
        <path d="M-30,-34 Q0,-14 30,-34 L30,-36 Q30,-42 22,-42 L-22,-42 Q-30,-42 -30,-36 Z" fill={C.espresso} opacity={0.25} />
        <circle cx={0} cy={-22} r={3} fill={C.gold} />
      </g>
    ),
  };
}

function Clutch(): Item {
  return {
    w: 70,
    el: (
      <g>
        <rect x={-30} y={-26} width={60} height={26} rx={4} fill={C.espresso} />
        <path d="M-30,-26 L30,-26 L0,-10 Z" fill={C.brown} />
        <circle cx={0} cy={-12} r={2.5} fill={C.gold} />
      </g>
    ),
  };
}

function ShoppingBags(): Item {
  return {
    w: 120,
    el: (
      <g>
        <path d="M-40,-64 Q-40,-84 -28,-84 Q-16,-84 -16,-64" fill="none" stroke={C.espresso} strokeWidth={2.5} />
        <rect x={-52} y={-64} width={48} height={64} fill={C.beige} />
        <path d="M14,-84 Q14,-108 30,-108 Q46,-108 46,-84" fill="none" stroke={C.espresso} strokeWidth={2.5} />
        <rect x={-2} y={-84} width={64} height={84} fill={C.brown} />
        <text x={30} y={-36} textAnchor="middle" fontSize={16} fontWeight={600} fontFamily="var(--font-sora), sans-serif" fill={C.cream} letterSpacing={1}>
          ST
        </text>
      </g>
    ),
  };
}

const items: Item[] = [
  ShoppingBags(),
  DressForm({ jacket: C.brown, inner: C.cream }),
  Handbag({ body: C.camel, flap: C.cognac }),
  Heel({ color: C.espresso }),
  Rack(),
  Tote({ color: C.tan }),
  HatBox(),
  DressForm({ jacket: C.beige, inner: C.brown, skirt: C.cognac }),
  Clutch(),
  Mirror(),
  Crossbody({ color: C.brown }),
  Heel({ color: C.cognac }),
  DressForm({ jacket: C.espresso, inner: C.cream }),
  Handbag({ body: C.espresso, flap: C.brown }),
  ShoppingBags(),
];

const GAP = 22;

const placed = items.reduce<{ cx: number; el: React.ReactNode; end: number }[]>((acc, it) => {
  const start = acc.length ? acc[acc.length - 1].end : GAP;
  acc.push({ cx: start + it.w / 2, el: it.el, end: start + it.w + GAP });
  return acc;
}, []);
const width = placed[placed.length - 1].end;

export function FashionFrieze({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={`0 -180 ${width} 184`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      {placed.map((p, i) => (
        <g key={i} transform={`translate(${p.cx} 0)`}>
          <g className="frieze-item">{p.el}</g>
        </g>
      ))}
      <rect x={0} y={0} width={width} height={4} fill={C.brown} />
    </svg>
  );
}
