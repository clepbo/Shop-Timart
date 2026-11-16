import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX, PATTERN_PATHS, PATTERN_VIEWBOX } from "./paths";

/** The Shop Timart monogram: one unbroken thread looping through T and M. */
export function Monogram({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={MONOGRAM_VIEWBOX} className={className} fill="currentColor" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {MONOGRAM_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** The mirrored monogram emblem, for seals and tone-on-tone backgrounds. */
export function PatternEmblem({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={PATTERN_VIEWBOX} className={className} fill="currentColor" aria-hidden>
      {PATTERN_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Tone-on-tone repeating brand pattern (use as a background layer). */
export function PatternField({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden>
      <defs>
        <pattern id="st-pattern" width="260" height="180" patternUnits="userSpaceOnUse">
          <svg viewBox={PATTERN_VIEWBOX} width="200" height="137" x="30" y="20" fill="currentColor">
            {PATTERN_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#st-pattern)" />
    </svg>
  );
}
