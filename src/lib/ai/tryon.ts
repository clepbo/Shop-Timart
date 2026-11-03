import "server-only";
import type { GarmentType } from "../types";

/**
 * Virtual try-on provider abstraction.
 *
 * Given the owner's single garment photo and a base model photo for a body profile,
 * a provider returns a photo of that model wearing the garment (plus, optionally,
 * a garment mask used to recolour the render live in the browser).
 *
 * The default implementation targets an IDM-VTON style model hosted on Replicate.
 * Any other provider (Fashn.ai, Kling Try-On, a self-hosted model …) can be added by
 * implementing `TryOnProvider` and returning it from `getTryOnProvider()`.
 */
export interface TryOnInput {
  garmentImage: string; // data URI or public URL
  modelImage: string; // data URI or public URL
  garmentType: GarmentType;
  description: string;
}

export interface TryOnOutput {
  image: string; // remote URL or data URI of the result
  mask?: string;
}

export interface TryOnProvider {
  name: string;
  render(input: TryOnInput): Promise<TryOnOutput>;
}

function vtonCategory(t: GarmentType): "upper_body" | "lower_body" | "dresses" {
  switch (t) {
    case "maxi-dress":
    case "midi-dress":
    case "kaftan":
    case "jumpsuit":
      return "dresses";
    default:
      return "upper_body";
  }
}

class ReplicateTryOn implements TryOnProvider {
  name = "replicate";
  constructor(
    private token: string,
    private version: string,
  ) {}

  private async run(input: Record<string, unknown>): Promise<string> {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({ version: this.version, input }),
    });
    if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);
    let prediction = await res.json();
    const started = Date.now();
    while (["starting", "processing"].includes(prediction.status)) {
      if (Date.now() - started > 5 * 60_000) throw new Error("Try-on timed out");
      await new Promise((r) => setTimeout(r, 2500));
      const poll = await fetch(prediction.urls.get, { headers: { Authorization: `Bearer ${this.token}` } });
      prediction = await poll.json();
    }
    if (prediction.status !== "succeeded") throw new Error(prediction.error ?? `Try-on ${prediction.status}`);
    const out = prediction.output;
    return Array.isArray(out) ? out[0] : out;
  }

  async render({ garmentImage, modelImage, garmentType, description }: TryOnInput): Promise<TryOnOutput> {
    const base = {
      garm_img: garmentImage,
      human_img: modelImage,
      garment_des: description,
      category: vtonCategory(garmentType),
      crop: false,
      steps: 30,
      seed: 42,
    };
    const image = await this.run(base);
    let mask: string | undefined;
    try {
      mask = await this.run({ ...base, mask_only: true });
    } catch {
      mask = undefined; // recolouring is optional
    }
    return { image, mask };
  }
}

export function getTryOnProvider(): TryOnProvider | null {
  const token = process.env.REPLICATE_API_TOKEN;
  const version = process.env.REPLICATE_TRYON_VERSION;
  if (token && version) return new ReplicateTryOn(token, version);
  return null;
}
