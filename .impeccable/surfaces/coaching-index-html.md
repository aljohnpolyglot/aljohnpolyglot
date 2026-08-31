---
version: 1
slug: "coaching-index-html"
primary_target: "coaching/index.html"
related_targets: ["coaching/css/coaching_revamped.css"]
---

# Coaching — Proof First

## Direction

The coaching page uses the approved **Category Standard / Proof First** composition from seed `f67c5fe3`. It is a clean editorial coaching surface whose promise is earned immediately by L.A. Sarmiento's real case-study video. It refuses a generic claim-first hero and avoids adopting the mock's invented copy or controls.

## Visual grammar

- **Palette:** deep navy `#102a56`, action red `#d13b35`, warm yellow `#f4c430`, ink `#172033`, paper `#ffffff`, and soft canvas `#f4f5f7`.
- **Type:** editorial serif display headings paired with the site's readable sans-serif body and controls.
- **Geometry:** mostly square and softly eased corners; thin quiet dividers; one restrained shadow on media, no glass or floating card field.
- **Composition:** fluid offer/proof split near `38/62` on wide screens; the proof video dominates; Aljohn's portrait bridges the two regions; the month strip follows the media; one benefits rail closes the first viewport.
- **Medium:** semantic HTML/CSS UI with the existing Aljohn portrait, existing L.A. portrait as the video poster/fallback context, and the verified YouTube embed. No generated raster ships.

## Story and behavior

The visitor first sees the offer, real-world proof, session price, Google Meet context, and booking action. The rest of the current page remains intact: benefits, coach background, coaching scope and exclusions, approach note, investment details, and final booking CTA. All proportions are fluid; the proof stack becomes single-column on narrow screens without page overflow. Motion is restrained and disabled when reduced motion is requested.

## Accessibility and truth

Keep visible focus states, meaningful image and iframe labels, high contrast, keyboard-accessible links, and native section structure. Preserve the existing verified booking URL, official YouTube channel, Learning Methods playlist, `500 PHP / 30 minutes`, GCASH-after-session detail, Google Meet platform, and current case-study wording. Do not introduce new performance claims, testimonials, metrics, or dead links.

## Approved evidence

- Direction mock: `.impeccable/mocks/decision/coaching-category-standard.png`
- Composition: `.impeccable/mocks/coaching-standard-proof-first.png`
- Composition sidecar: `.impeccable/mocks/coaching-standard-proof-first.png.json`
