import { Figure } from "../figure/Figure";
import { defaultBody, type BodyProfile } from "@/lib/bodies";
import { shade } from "@/lib/color";
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
}

/**
 * Shows the AI photo render when one exists (live-recoloured through its garment mask),
 * otherwise the illustrated figure. Used by product cards, the Fit Studio and the cart.
 */
export function ProductArt({ garmentType, gender, colour, body, skin, render, className = "", name, tinted = true, photo }: Props) {
  const b = body ?? defaultBody(gender);
  const bg = tinted ? `radial-gradient(120% 80% at 50% 18%, ${shade(colour.hex, 0.9)} 0%, ${shade(colour.hex, 0.8)} 55%, ${shade(colour.hex, 0.72)} 100%)` : undefined;

  if (!render?.image && photo) {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={name ?? ""} className="absolute inset-0 size-full object-cover object-[50%_32%]" />
      </div>
    );
  }

  if (render?.image) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
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

  return (
    <div className={`relative flex items-end justify-center overflow-hidden transition-[background] duration-700 ${className}`} style={{ background: bg }}>
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
