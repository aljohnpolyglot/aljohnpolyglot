# French patchwork material assets

Generated on 2026-08-27 with the built-in ImageGen tool. The approved `.impeccable/mocks/patchwork-atlas.png` comp was used only as a palette and textile-character reference. Every source PNG contains the exact generation prompt in its `impeccable:prompt` tEXt metadata; each WebP delivery variant has the identical prompt in the Impeccable `.webp.json` sidecar fallback.

| Asset | Dimensions / format | Crop and tiling notes | Provenance |
| --- | --- | --- | --- |
| `languages/french/images/textures/patchwork-indigo-denim.png` | 1024 × 1024, 8-bit sRGB PNG | Full generated square reduced from 1254 × 1254; uniform edge-to-edge twill with no focal feature; visually tile-safe. | Built-in ImageGen; approved comp supplied as material/color reference; prompt embedded and round-trip verified. |
| `languages/french/images/textures/patchwork-cream-linen.png` | 1024 × 1024, 8-bit sRGB PNG | Full generated square reduced from 1254 × 1254; restrained all-over slub weave; visually tile-safe. | Built-in ImageGen; approved comp supplied as material/color reference; prompt embedded and round-trip verified. |
| `languages/french/images/textures/patchwork-chambray.png` | 1024 × 1024, 8-bit sRGB PNG | Full generated square reduced from 1254 × 1254; quiet all-over melange weave; visually tile-safe. | Built-in ImageGen; approved comp supplied as material/color reference; prompt embedded and round-trip verified. |
| `languages/french/images/textures/patchwork-shirt-stripe.png` | 1024 × 1024, 8-bit sRGB PNG | Phase-aligned 1156 × 1156 crop from the 1254 × 1254 generation, then reduced; narrow vertical stripe rhythm meets the left/right repeat boundary in a cream interval. | Built-in ImageGen; approved comp supplied as material/color reference; prompt embedded and round-trip verified. |

## WebP delivery variants

All variants retain the 1024 × 1024 crop and tiling behavior of their PNG masters. They were encoded with ffmpeg/libwebp using the `picture` preset and compression level 6, then visually inspected at full resolution.

| Delivery asset | Size | Reduction from PNG | Encoding / provenance |
| --- | ---: | ---: | --- |
| `languages/french/images/textures/patchwork-indigo-denim.webp` | 299.3 KiB | 86.3% | Quality 78; exact PNG generation prompt copied to `patchwork-indigo-denim.webp.json` and round-trip verified. |
| `languages/french/images/textures/patchwork-cream-linen.webp` | 173.7 KiB | 91.9% | Quality 72; exact PNG generation prompt copied to `patchwork-cream-linen.webp.json` and round-trip verified. |
| `languages/french/images/textures/patchwork-chambray.webp` | 247.1 KiB | 89.6% | Quality 72; exact PNG generation prompt copied to `patchwork-chambray.webp.json` and round-trip verified. |
| `languages/french/images/textures/patchwork-shirt-stripe.webp` | 150.6 KiB | 92.5% | Quality 72; exact PNG generation prompt copied to `patchwork-shirt-stripe.webp.json` and round-trip verified. |

These are flat material fields, not UI composites. Photos remain the existing documentary assets. Typography, stitches, seams, icons, controls, pockets, borders, layout, interaction, and accessibility remain semantic/existing HTML, CSS, JS, icon-library, or project-asset work.

Tiling note: the fields are visually tile-safe under normal website repetition, but they are not claimed as mathematically pixel-identical seamless tiles at every edge.
