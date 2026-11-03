# Timart: modest fashion e-commerce and styling

A storefront for a fashion brand built around decency. It sells modest wear for women and men and takes bookings for personal styling.

Its main feature is the **Fit Studio**. A shopper picks the body closest to theirs (6 women's and 4 men's profiles, UK 6–22 / S–XXL) and sees any piece on that body in any of its colours. They can also compare every size side by side. The owner uploads one photo per garment and never has to make mockups for each size.

## Stack

- Next.js 16 (App Router, Server Actions), React 19, TypeScript
- Tailwind CSS v4. Design tokens (burgundy `#74070e`, butter `#ffeda8`, warm white) are in `src/app/globals.css`
- Fonts: Sora (headings) and Poppins (body), the same pairing as the brand's design reference
- Photography lives in `public/images/studio` (founder portrait, men's studio shots). The men's shots are placeholder references; replace them with the brand's own studio photos. Women's pieces without photos show a ghost-mannequin studio illustration with colour swatches until photos are uploaded in `/admin`.
- Neon Postgres and Vercel Blob in production. Without credentials it falls back to local JSON files and `public/uploads`, so local dev needs no setup.
- Paystack for payments (NGN)

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

1. **Illustrated previews (always available, free).** `src/components/figure/Figure.tsx` draws a parametric fashion figure. Each body profile (`src/lib/bodies.ts`) sets shoulder, bust, waist and hip widths and height. Each garment type (trouser suit, skirt suit, men's suit, maxi, midi, kaftan/abaya, two-piece, jumpsuit, senator, shirt & trousers) is drawn from those widths. Colour changes are instant, and shoppers can choose a skin tone. A product works this way as soon as it is saved.

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

## Deploying to Vercel

1. **Import the repo** at https://vercel.com/new. The framework is detected as Next.js, and no build settings need changing.
2. **Database:** in the project, go to *Storage → Create → Neon (Postgres)* and connect it to all environments. This sets `DATABASE_URL`. On the first request the app creates its tables (`products`, `records`) and seeds the catalogue.
3. **File storage:** go to *Storage → Create → Blob* and connect it. This sets `BLOB_READ_WRITE_TOKEN`, which is used for product photos and AI renders.
4. **Environment variables:** under *Settings → Environment Variables*, add:
   - `ADMIN_PASSWORD`. Required. Admin login stays disabled in production until it is set.
   - `PAYSTACK_SECRET_KEY`. Start with your `sk_test_…` key.
   - `NEXT_PUBLIC_SITE_URL`, for example `https://timart.vercel.app`, or your custom domain later.
5. **Redeploy** so the new variables take effect.
6. **Paystack webhook:** in Paystack Dashboard → Settings → API Keys & Webhooks, set the webhook URL to `https://<your-domain>/api/paystack/webhook`.
7. Test a purchase with a [Paystack test card](https://paystack.com/docs/payments/test-payments). The order should show as **paid** in `/admin/orders`.

### How payments work
At checkout the server recomputes every price and creates the order with status `awaiting_payment`. It then starts a Paystack transaction in NGN, using the order id as the reference, and redirects to Paystack. On return, `/checkout/confirm` checks the transaction with Paystack. The webhook (`/api/paystack/webhook`, HMAC-SHA512 signed) does the same check in case the shopper closes the tab. An order is marked `paid` only if Paystack reports success and the amount matches the order total. Without `PAYSTACK_SECRET_KEY`, checkout records the order and hands off to WhatsApp.

Styling sessions are booked through the form and confirmed on WhatsApp from `/admin/orders?tab=bookings`.

## Still to do
- Real owner and staff accounts (currently one shared password).
- Paid styling sessions through Paystack.
- Order emails or SMS notifications.
- Model photos for AI try-on previews.
