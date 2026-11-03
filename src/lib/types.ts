export type Gender = "women" | "men";

/** Garment templates the illustrated Fit Studio knows how to draw. */
export type GarmentType =
  | "maxi-dress"
  | "midi-dress"
  | "kaftan"
  | "two-piece"
  | "suit"
  | "skirt-suit"
  | "mens-suit"
  | "jumpsuit"
  | "senator"
  | "shirt-trousers"
  | "vest-set";

export interface Colorway {
  name: string;
  hex: string;
  /** Optional secondary colour (skirt of a set, trim, embroidery). */
  accent?: string;
  /** Real photos of this colourway (shown before the Fit Studio illustration). */
  images?: string[];
}

/** An AI-generated photo of the garment on one body profile. */
export interface FitRender {
  /** Image URL of the garment worn by the model for this body profile. */
  image: string;
  /** Optional garment mask (white = garment) used to recolour the render live. */
  mask?: string;
  /** Colour name the render was generated in (renders can also be per-colour). */
  colour?: string;
}

export type RenderStatus = "illustration" | "pending" | "ready" | "failed";

export interface Product {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
  category: string;
  occasions: string[];
  price: number;
  compareAtPrice?: number;
  description: string;
  details: string[];
  garmentType: GarmentType;
  colors: Colorway[];
  sizes: string[];
  /** The flat-lay / product photo the owner uploaded. */
  image?: string;
  /** Lookbook photos of the product being worn. */
  images?: string[];
  /** AI renders keyed by body profile id (and optionally `${bodyId}:${colour}`). */
  renders?: Record<string, FitRender>;
  renderStatus: RenderStatus;
  renderError?: string | null;
  isNew?: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  colour: string;
  size: string;
  quantity: number;
  garmentType: GarmentType;
  hex: string;
  accent?: string;
  gender: Gender;
  image?: string;
}
