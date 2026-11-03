import { Figure } from "../figure/Figure";
import { defaultBody, type BodyProfile } from "@/lib/bodies";
import { shade, isLight } from "@/lib/color";
import type { Colorway, GarmentType, Gender, FitRender } from "@/lib/types";

interface Props {
  garmentType: GarmentType;
  gender: Gender;
  colour: Colorway;
  body?: BodyProfile;
  skin?: string;
  render?: FitRender;
  className?: string;
  name?: string;
  tinted?: boolean;
  /** A real photo; shown instead of the illustration when there is no AI render. */
  photo?: string;
  /** Studio style: headless ghost-mannequin outfit on a flat backdrop. */
  ghost?: boolean;
  /** Colour-story swatches shown beside a ghost outfit (studio style). */
  swatches?: Colorway[];
}

/**
 * Shows the AI photo render when one exists (live-recoloured through its garment mask),
 * otherwise the illustrated figure. Used by product cards, the Fit Studio and the cart.
 */
const pos = (cls: string) => (/\b(absolute|fixed)\b/.test(cls) ? "" : "relative");

export function ProductArt({ garmentType, gender, colour, body, skin, render, className = "", name, tinted = true, photo, ghost = false, swatches }: Props) {
  const b = body ?? defaultBody(gender);
  const bg = tinted ? `radial-gradient(120% 80% at 50% 18%, ${shade(colour.hex, 0.9)} 0%, ${shade(colour.hex, 0.8)} 55%, ${shade(colour.hex, 0.72)} 100%)` : undefined;

  if (!render?.image && photo) {
    return (
      <div className={`${pos(className)} overflow-hidden bg-sand ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={name ?? ""} className="absolute inset-0 size-full object-cover object-[50%_32%]" />
      </div>
    );
  }

  if (render?.image) {
    return (
      <div className={`${pos(className)} overflow-hidden ${className}`} style={{ background: bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={render.image} alt={name ?? ""} className="absolute inset-0 size-full object-cover" />
        {render.mask && render.colour !== colour.name && (
          <div
            aria-hidden
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: colour.hex,
              mixBlendMode: "color",
              WebkitMaskImage: `url(${render.mask})`,
              maskImage: `url(${render.mask})`,
              WebkitMaskSize: "cover",
              maskSize: "cover",
              maskMode: "luminance",
            }}
          />
        )}
      </div>
    );
  }

  if (ghost) {
    const studio = isLight(colour.hex) ? shade(colour.hex, -0.1) : shade(colour.hex, 0.84);
    const floor = isLight(colour.hex) ? shade(colour.hex, -0.16) : shade(colour.hex, 0.76);
    return (
      <div className={`${pos(className)} overflow-hidden transition-[background] duration-700 ${className}`} style={{ background: `linear-gradient(180deg, ${studio} 0%, ${studio} 78%, ${floor} 100%)` }}>
        <Figure
          garment={garmentType}
          gender={gender}
          body={b}
          color={colour.hex}
          accent={colour.accent}
          ghost
          title={name ? `${name} in ${colour.name}` : undefined}
          className={`absolute bottom-[3%] h-[90%] w-auto drop-shadow-[0_14px_18px_rgba(20,17,17,0.14)] ${(swatches?.length ?? 0) > 1 ? "left-[58%] -translate-x-1/2" : "left-1/2 -translate-x-1/2"}`}
        />
        {swatches && swatches.length > 1 && (
          <div className="absolute left-[8%] top-1/2 flex w-[17%] max-w-16 -translate-y-1/2 flex-col gap-2" aria-hidden>
            {swatches.slice(0, 3).map((c) => (
              <span key={c.name} className="block aspect-square w-full rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ background: c.accent && c.accent !== c.hex ? `linear-gradient(135deg, ${c.hex} 0 58%, ${c.accent} 58% 100%)` : c.hex }} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${pos(className)} flex items-end justify-center overflow-hidden transition-[background] duration-700 ${className}`} style={{ background: bg }}>
      <Figure
        garment={garmentType}
        gender={gender}
        body={b}
        color={colour.hex}
        accent={colour.accent}
        skin={skin}
        title={name ? `${name} in ${colour.name}` : undefined}
        className="h-[92%] w-auto drop-shadow-[0_18px_24px_rgba(35,26,22,0.12)]"
      />
    </div>
  );
}
