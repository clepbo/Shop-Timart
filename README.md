# Timart: modest fashion e-commerce and styling

A storefront for a fashion brand built around decency. It sells modest wear for women and men and takes bookings for personal styling.

Its main feature is the **Fit Studio**. A shopper picks the body closest to theirs (6 women's and 4 men's profiles, UK 6–22 / S–XXL) and sees any piece on that body in any of its colours. They can also compare every size side by side. The owner uploads one photo per garment and never has to make mockups for each size.

## Stack

- Next.js 16 (App Router, Server Actions), React 19, TypeScript
- Tailwind CSS v4. Design tokens are in `src/app/globals.css`
- Fonts: Cormorant Garamond (display) and Jost (UI)
- Storage is file-based (`data/*.json`, `public/uploads`), so it runs with no setup. See *Going to production*.

## Getting started

```bash
cp .env.example .env.local   # set ADMIN_PASSWORD
npm install
npm run dev
```

- Store: http://localhost:3000
- Owner Studio: http://localhost:3000/admin. The password is `ADMIN_PASSWORD`, or `timart-admin` if it is not set.

## How the Fit Studio works

The Fit Studio has two rendering layers, and each product uses whichever one it has.

1. **Illustrated previews (always available, free).** `src/components/figure/Figure.tsx` draws a parametric fashion figure. Each body profile (`src/lib/bodies.ts`) sets shoulder, bust, waist and hip widths and height. Each garment type (maxi, midi, kaftan/abaya, two-piece, suit, jumpsuit, senator, shirt & trousers) is drawn from those widths. Colour changes are instant, and shoppers can choose a skin tone. A product works this way as soon as it is saved.

2. **AI photo previews (when configured).** When the owner uploads a garment photo in `/admin`, `src/lib/ai/pipeline.ts` runs in the background using Next's `after()`. For every body profile it sends the garment photo and that profile's base model photo (`public/models/<profile-id>.jpg`) to a virtual try-on model. The default provider, in `src/lib/ai/tryon.ts`, is an IDM-VTON style model on Replicate. The result is saved to `public/renders/`, along with an optional garment mask. On the storefront, the mask recolours the photo live into each colourway using a CSS `mix-blend-mode: color` overlay, so each body only needs one render.

To enable photo previews:

- Set `REPLICATE_API_TOKEN` and `REPLICATE_TRYON_VERSION`.
- Add one licensed, modestly dressed model photo per body profile to `public/models/`, named `w-petite.jpg`, `w-slim.jpg`, … `m-big.jpg` (see `bodies.ts`). This is a one-time task.
- Add products in `/admin`. The dashboard shows each product's render status and has a *Regenerate* button.

To swap providers (Fashn.ai, Kling, a self-hosted model …), implement `TryOnProvider` in `src/lib/ai/tryon.ts`.

## Project map

```
src/app/                 routes: home, shop, shop/[slug], fit-studio, styling, about, checkout, admin/*
src/app/actions/         public server actions (orders, styling bookings, newsletter)
src/app/admin/           owner Studio: login, dashboard, product create/edit with live preview
src/components/figure/   parametric figure renderer + geometry helpers
src/components/shop/     ProductCard, ProductArt (photo or illustration), ProductExperience (Fit Studio + buy box)
src/lib/                 brand config, catalogue, body profiles, store, auth, delivery, AI pipeline
data/products.json       seed catalogue
```

Brand name, contacts, WhatsApp number and announcement copy are all in `src/lib/brand.ts`.

## Going to production (to-do)

- **Database and storage:** replace `src/lib/store.ts` with Postgres (for example Supabase) and object storage (Cloudinary, S3 or Supabase Storage). The rest of the app only uses this module. Serverless hosts such as Vercel do not keep local file writes.
- **Payments:** connect Paystack (or Flutterwave) at checkout. Orders are currently recorded and confirmed over WhatsApp.
- **Admin auth:** use real accounts for the owner and staff instead of a single shared password.
- **Order management** screens in the Studio (statuses, fulfilment).
