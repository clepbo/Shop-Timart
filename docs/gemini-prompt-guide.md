# Timart — Gemini model photo prompts

Use these in the Gemini app (gemini.google.com) to put Timart products on realistic models.
Fill in anything in [SQUARE BRACKETS] and delete the brackets before sending.

## Part 1: Create the standard models (once)

Make one model per size, and save each image you're happy with to a folder named "Timart models".
Reusing the same model photos for every product keeps the website consistent.

```
Create a photorealistic full-body studio photograph of a professional fashion model for a modest corporate clothing brand.

MODEL
- Black Nigerian woman, [age 25–35], natural, warm and confident expression, soft smile
- Body: [UK size 12, average build, about 5'5"]  ← change this line for each size (see list below)
- Hair: [neat low bun / short tapered natural hair / sleek wig], polished and office-appropriate
- Natural makeup, small stud earrings, no tattoos

OUTFIT (neutral base layer only — products will be added later)
- Plain fitted cream long-sleeve top and plain straight-leg cream trousers, no logos, no patterns
- Simple nude pointed-toe heels

POSE & FRAMING
- Standing straight, facing the camera, weight evenly on both feet, arms relaxed slightly away from the body so the waist and hips are clearly visible
- Full body from head to toe, nothing cropped, model centred with space above the head and below the feet
- Portrait orientation, 3:4

PHOTOGRAPHY
- Seamless warm beige studio backdrop (#E6D6BF), soft even studio lighting, soft natural shadow on the floor
- Sharp focus, true-to-life skin tones, high resolution, looks like a real e-commerce photoshoot
- No text, no watermark, no props, no other people
```

Swap the **Body** line for each size:

| Model | Body line |
|---|---|
| Women, Petite | UK size 6–8, petite slim build, about 5'1" |
| Women, Average | UK size 12, average build, about 5'5" |
| Women, Curvy | UK size 14–16, curvy build with defined waist and fuller hips, about 5'5" |
| Women, Plus | UK size 20–22, plus-size full build, about 5'5" |
| Men, Regular | Black Nigerian man, size M–L, regular athletic build, about 5'11" (base outfit: plain white shirt, plain navy trousers, brown shoes) |
| Men, Broad | Black Nigerian man, size XL–XXL, broad build, about 6'0" (same base outfit) |

## Part 2: Put a product on a model (every time)

Upload **two images**: (1) the product photo, (2) one saved model from Part 1. Then send this prompt.
Generate one model at a time; repeat with each model photo.

```
I'm uploading two images.
IMAGE 1 is a product from my clothing store: [describe briefly — e.g. "a beige textured blazer with a white camisole and mustard wide-leg trousers" / "a black handbag" / "a lilac satin blouse"].
IMAGE 2 is my model.

Create a photorealistic full-body e-commerce photo of the model from IMAGE 2 wearing the product from IMAGE 1.

THE PRODUCT MUST STAY EXACTLY THE SAME — this is the most important rule:
- Keep the exact colour and shade, fabric texture, pattern and print, and their scale and placement
- Keep the exact cut and silhouette: neckline, collar, lapels, sleeve length, cuffs, hem length, trouser leg width, waistband
- Keep every detail: buttons (same number, colour and position), zips, pockets, pleats, belts, trims, piping, embroidery, hardware and labels
- Do not redesign, simplify, "improve", shorten, lengthen, add or remove anything on the product
- If part of the product is not visible in IMAGE 1, keep it plain and consistent with what is visible — do not invent new design details
- The product should fit naturally on the model's body size, with realistic drape and fabric folds

THE MODEL MUST STAY THE SAME:
- Same face, skin tone, hair, body size and proportions as IMAGE 2
- Do not slim, enlarge or reshape the body

STYLING (only fill what the product does not cover):
- Style: modest, corporate, classic and modern
- Coverage: if the product leaves the upper body uncovered, add a plain [cream] blouse or camisole; if it leaves the legs uncovered, add plain [black] straight trousers or a plain [black] midi skirt
- Any item I didn't upload must be plain, neutral and unbranded, so it doesn't distract from the product
- Shoes: [simple nude pointed-toe heels / black loafers]; keep accessories minimal (small earrings, slim watch)
- [If the product is a BAG or ACCESSORY: style the model in a plain neutral corporate outfit (cream blouse, black tailored trousers) and have her hold or wear the bag naturally at her side, clearly visible, at true-to-life size]

POSE, FRAMING & PHOTO
- Standing facing the camera, relaxed confident pose, arms slightly away from the body so the product is fully visible
- Full body from head to toe, nothing cropped, centred, portrait 3:4
- Seamless warm beige studio backdrop (#E6D6BF), soft even studio lighting, soft floor shadow
- Sharp focus, realistic skin and fabric, high resolution, looks like a real photoshoot
- No text, no logos added, no watermark, no other people
```

## Part 3: Quick fixes (send as a reply after a result)

- **Product changed:** `The [blazer] doesn't match IMAGE 1 — the [buttons / collar / colour / length] changed. Redo the image keeping the product exactly as in IMAGE 1. Change nothing else.`
- **Colour off:** `Match the colour of the [trousers] exactly to IMAGE 1: [describe, e.g. "warm mustard yellow, not brown"]. Change nothing else.`
- **Body changed:** `Keep the model's body size exactly as in IMAGE 2 — she is [UK size 16]. Don't slim her. Change nothing else.`
- **Cropped:** `Show the full body from head to toe with space above and below. Change nothing else.`
- **Too revealing:** `Make the styling more modest: add a plain cream camisole underneath / use full-length plain black trousers. Don't change the product itself.`
- **Another colour of the same product:** `Same image, but change only the [blazer] colour to [colour name and description]. Keep every other detail and the model exactly the same.` (Only do this for colours the store actually stocks, and check the result against the real fabric.)

## Before uploading to the website — checklist

1. Put the result side by side with the real product. Same buttons, pockets, collar, length and colour?
2. Is the model the same person and the same size as her reference?
3. Full body visible, beige background, no text or watermark?
4. Modest enough for the brand?
5. If anything is off, use a Part 3 fix. If it still isn't right after 2–3 tries, start a new chat and re-upload both images.

## Tips for the product photo (Image 1)

- Flat on a plain surface, on a hanger against a plain wall, or on a mannequin
- Daylight or bright even light, no strong shadows, the whole garment in frame
- For a set, photograph all the pieces together in one image
- Add a close-up as a third image if the fabric has a detailed texture or print
