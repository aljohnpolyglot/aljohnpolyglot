---
version: 1
slug: "languages-french-index-html"
primary_target: "languages/french/index.html"
related_targets: ["languages/french/css/page-language-french-patchwork.css","languages/french/js/renderers/french-curated-channels-renderer.js","languages/french/js/renderers/french-resources-renderer.js"]
---

# French curation surface brief

## Scope and mode

- Surface: `languages/french/index.html`
- Mode: Experience
- Audience: French learners, especially in the Philippines, and people following Aljohn’s language-learning story.
- Job: move from a real memory or person to a video, creator, place, or community action without losing the personal context.
- Primary action: start with Aljohn’s story, then browse image-first creator shelves and lived resources.

## Proof and constraints

- Proof comes from Aljohn’s own videos, exact Facebook reels, real meetup and institution photos, followed creators, and editable personal notes.
- Preserve all playlist, Extr@, creator-modal, full-screen album, resource, search, level-filter, and external-link behavior.
- No statistics, auto-catalogue language, invented attachment, combined category labels, glassmorphism, generic bento cards, or fabricated documentary imagery.

## Chosen direction

- World: **Le Patchwork de souvenirs**.
- Approved composition: **C — L’atlas cousu**.
- Approved comp: `.impeccable/mocks/patchwork-atlas.png` at 1672 × 941.
- Memorable moment: a cream stitched atlas spine orients a near-full-bleed quilt of real Saging Ça Va ? photos; independent creator shelves begin immediately below.
- Interaction: drawers and rows slide like cloth strips while modals open as full-screen sewn folios; motion remains subtle and respects reduced-motion preferences.
- TF1+ extension: approved direction **A — Broadcast Folio**, a 60/40 Star Academy media window and cream program folio using the same denim, linen, and red-thread grammar. Approved comp: `.impeccable/mocks/french-tf1-section-a-broadcast-folio.png`.

## Sampled color record

| Role | Comp sample |
| --- | --- |
| Indigo header field | `#1A2C40` |
| Cream atlas spine | `#D9CEBE` |
| Indigo shelf field | `#2A4257` |
| Cream label cloth | `#E2D8C7` |
| Red pocket/action | `#8A2B1F` |
| Ink | `#111820` |

## Comp grammar

- Corners: mostly square; only pockets and photo patches gain small cloth-softened corners.
- Lines: visible 2 px seams; red running stitches on cream, cream stitches on indigo.
- Elevation: physical overlap from sewn edges and fabric depth, never floating digital-card shadows.
- Type ramp: condensed block caps for navigation and shelf labels; large condensed title; Plus Jakarta Sans for readable body; one restrained handwritten accent for personal notes.
- Responsive rule: desktop keeps the 18/82 atlas split; mobile turns the spine into a horizontal scrollable stitched index, stacks the photo quilt, then keeps every creator category as its own horizontal shelf.

## Implementation inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Indigo woven ground | Dense textile weave across header, shelf frames, and modal chrome | Generated seamless raster texture |
| Cream linen ground | Tangible cloth on spine, labels, content folios, and form controls | Generated seamless raster texture |
| Faded chambray | Section pacing fields and quiet editorial bands | Generated seamless raster texture |
| Striped shirting | Sparse category separators and seam highlights | Generated seamless raster texture |
| Atlas spine | Four large stitched destinations plus red pocket action | Semantic HTML/CSS and Font Awesome icons |
| Documentary quilt | One dominant group image plus supporting real event photos, uncropped faces protected | Existing project raster assets |
| Creator shelves | Separate full-width, horizontally scrollable image-first rows | Existing renderer data + semantic buttons/CSS |
| Playlist and Extr@ | Real playable embed plus list, each inside sewn folio grammar | Existing HTML/JS plus CSS |
| Creator modal | Full-screen accessible folio with profile image, copy, note, CEFR, embed, links | Existing JS behavior plus CSS |
| Resource albums | Alternating large documentary quilts with captions and full-screen lightbox | Existing renderer/assets plus CSS |
| Primary action | Red sewn pocket, large enough to remain the fold’s clear action | Semantic anchor + CSS |
| Motion | One orchestrated cloth-strip reveal and physical layer transitions | CSS/JS; disabled under reduced motion |

## Unresolved decisions

- None. User approved composition C in chat on 2026-08-27.
