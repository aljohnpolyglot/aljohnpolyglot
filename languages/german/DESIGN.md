---
name: "Trikot-Schneise"
description: "A 1990 Germany jersey-inspired editorial portal for Aljohn's path into German."
colors:
  display-ink: "#07080b"
  jersey-black: "#0a0b0e"
  signal-red: "#b40a0d"
  signal-red-deep: "#8f0709"
  trophy-gold: "#eaae0a"
  jersey-paper: "#f8f8f8"
  optic-white: "#ffffff"
  mesh-soft: "#efefec"
  card-rule: "#d7d7d3"
  muted-graphite: "#52545a"
typography:
  display:
    fontFamily: "Barlow Condensed DE, sans-serif"
    fontSize: "clamp(4.35rem, 7vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.91
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Barlow Condensed DE, sans-serif"
    fontSize: "clamp(2.8rem, 5vw, 4.7rem)"
    fontWeight: 700
    lineHeight: 0.91
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Barlow Condensed DE, sans-serif"
    fontSize: "1.52rem"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "normal"
  body:
    fontFamily: "Barlow DE, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Condensed DE, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.035em"
rounded:
  square: "0"
  media: "8px"
  control: "10px"
  action: "12px"
  card: "14px"
  module: "16px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  section-inline: "clamp(22px, 5vw, 76px)"
  section-block: "clamp(62px, 7vw, 100px)"
  content-max: "1460px"
components:
  chapter-navigation:
    backgroundColor: "{colors.jersey-paper}"
    textColor: "{colors.display-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0 clamp(20px, 4vw, 68px)"
    height: "64px"
    width: "100%"
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.optic-white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "11px 18px"
    height: "46px"
  button-quiet:
    backgroundColor: "{colors.optic-white}"
    textColor: "{colors.display-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "11px 18px"
    height: "46px"
  route-card:
    backgroundColor: "{colors.optic-white}"
    textColor: "{colors.display-ink}"
    rounded: "{rounded.card}"
    padding: "22px 18px 30px"
    height: "168px"
  creator-card:
    backgroundColor: "{colors.optic-white}"
    textColor: "{colors.display-ink}"
    rounded: "{rounded.card}"
    padding: "0"
    width: "clamp(220px, 23vw, 292px)"
  modal-folio:
    backgroundColor: "{colors.jersey-paper}"
    textColor: "{colors.display-ink}"
    rounded: "{rounded.module}"
    padding: "0"
    width: "min(1120px, 100%)"
    height: "min(840px, calc(100vh - 48px))"
---

# Design System: Trikot-Schneise

## Overview

**Creative North Star: "Trikot-Schneise"**

The German surface translates the black, red, and trophy-gold V of the 1990 Germany football jersey into an editorial reading system. The V is literal in the opening cut, then returns as thin seams, shelf markers, media rules, modal headers, and the closing field. Optic-white knit texture keeps the physical reference present without turning the page into a sports shop or a flag-colored template.

The interface remains a familiar language portal: Aljohn's story and verified personal video lead, focused learning modules follow, and books, creators, and institutions retain recognizable browsing patterns. The jersey world supplies hierarchy and continuity while real videos, local portraits, official profile marks, book covers, and resource imagery remain the evidence.

**Key Characteristics:**

- Optic-white performance-knit fields cut by black, red, and trophy-gold V geometry.
- Self-hosted condensed athletic display type paired with a calmer German reading face.
- A persistent two-navbar structure with a centered chapter track on wide screens.
- Rounded editorial cards and modules with thin gray rules rather than a hard-edged sports dashboard.
- Independent horizontal shelves with contained overflow, visible controls, and square creator imagery.
- Immediate component states plus one opening chevron reveal that disappears under reduced motion.

### Verification baseline

The shipped evidence lives in `../../.impeccable/evidence/german/`. `qa-results.json` records no failures or console errors across 1536px desktop, 1024px intermediate, and 390px mobile checks. The evidence covers both navigation layers, the hero, learning modules, creator and institution shelves, CEFR state, book and creator dialogs, missing-video handling, focus movement and restoration, Escape and visible-close behavior, local imagery, contained overflow, and the retained direction contract. The executable browser check is `../../.impeccable/source-check/german-browser-qa.mjs`.

## Colors

The palette is deliberately narrow: two near-blacks establish authority, red marks action, gold marks focus and the final chevron layer, and cool whites preserve the jersey field.

### Primary

- **Jersey Black:** The dark field for global chrome, the Complete German module, modal profile panels, unavailable-media states, and the closing section.
- **Signal Red:** The main action, active seam, selected playlist state, scrollbar, and recurring middle stripe.
- **Trophy Gold:** The final V layer, selection color, and universal keyboard-focus outline.

### Secondary

- **Deep Signal Red:** The stronger hover and linked-text state for red actions.
- **Display Ink:** The deepest headline and body-action color on light fields.

### Neutral

- **Jersey Paper:** The textured page ground and modal folio.
- **Optic White:** The clearest cards, player copy panels, buttons, and institutional surfaces.
- **Mesh Soft:** Alternate section ground, muted list selection, and modal media panel.
- **Card Rule:** The quiet border system for cards, shelves, controls, and dividers.
- **Muted Graphite:** Secondary descriptions, metadata, timestamps, and guidance.

**The Three-Stripe Rule.** When the signature seam appears, its order stays black, red, then gold. Do not reorder the bands or let one hue stand in for the whole V.

**The Gold Is Functional Rule.** Gold may finish the jersey motif and mark focus or selection. It does not become a broad decorative background outside the Linguno training field.

**The Evidence Keeps Its Color Rule.** Do not tint thumbnails, portraits, official profile marks, book covers, or resource artwork to force them into the palette.

## Typography

**Display Font:** Barlow Condensed DE (self-hosted, with sans-serif fallback)
**Body Font:** Barlow DE (self-hosted, with sans-serif fallback)

**Character:** The condensed face supplies the tall athletic lettering visible in the jersey-era reference and keeps German headings compact. The regular-width body face preserves comfortable reading through descriptions, learning guidance, shelf notes, and modal copy.

### Hierarchy

- **Display** (700, fluid 4.35–6rem, line-height 0.91): The opening statement, held to roughly nine characters per line and set in uppercase.
- **Headline** (700, fluid 2.8–4.7rem, line-height 0.91): Major section and closing titles, balanced and uppercase.
- **Module Headline** (700, fluid 2.4–4.15rem, line-height 0.95): Complete German and Linguno feature titles.
- **Title** (700, 1.52rem, line-height 0.98): Creator names and compact editorial titles.
- **Body** (400, 17px, line-height 1.58): German narrative and guidance; compact screens reduce the base to 16px.
- **Label** (700, around 0.84–0.94rem, tracked and uppercase): Navigation, category labels, buttons, CEFR framing, and state copy.
- **Numeric Metadata:** Durations and CEFR-related values use tabular numerals where alignment matters.

**The Two-Voice Rule.** Barlow Condensed DE directs and labels; Barlow DE explains. Long copy never moves into the condensed display face.

## Layout

The page starts below the shared 70px site navbar. A 64px German chapter bar sticks directly beneath it, and anchors include both real heights plus additional breathing room. The desktop chapter track is centered between the German mark and channel action; at 900px and below the chapter links become a single-row contained scroller while the compact flag mark stays visible.

The first viewport is a three-part split: personal story, a 170–240px V cut, and the featured player. The outer columns use approximately 0.9fr and 1.18fr, the hero stays at least 610px tall, and the video remains a recognizable 16:9 player with its clickable local-thumbnail entry. At 900px the layout becomes one column and the vertical V turns into a horizontal downward cut between story and player.

Content sections use fluid block and inline spacing, with primary modules and shelves capped at 1460px. Route cards form five columns on wide screens, a contained horizontal track through intermediate widths, and a touch-scrollable card rail on narrower screens. Learning and Extr@ features use two-column player/copy layouts until 900px. Books, creator categories, and institutions each own their horizontal overflow, use scroll snapping and overscroll containment, and never create document-level sideways scrolling.

At 600px, section padding tightens, creator and book cards occupy most of the viewport without clipping, institution features stack image above copy, and shelf arrows that duplicate direct touch scrolling are removed. Dialogs become edge-to-edge, full-height folios with one-column content and internal vertical scrolling.

**The Two-Navbar Rule.** The shared navbar and the German chapter bar remain separately visible and vertically offset at every shipped width; neither replaces or covers the other.

**The Shelf Owns Its Overflow Rule.** Each route, book, creator, or institution row scrolls inside its own bounded track. The document itself never scrolls horizontally.

**The Category Stays Intact Rule.** CEFR filtering may hide cards and empty shelves, but the default view preserves every visible creator category as its own labeled row.

## Elevation & Depth

The system uses a light editorial hierarchy rather than dramatic depth. Thin cool-gray rules define most resting surfaces. Featured players, learning modules, books, interactive cards on hover, and dialogs receive progressively stronger shadows; the large V uses a drop shadow so it feels cut through the knit field.

### Shadow Vocabulary

- **Surface lift** (`0 14px 38px rgba(7, 8, 11, 0.12)`): The featured personal player.
- **Module lift** (`0 16px 42px rgba(7, 8, 11, 0.08)`): Learning and Extr@ modules.
- **Book lift** (`0 18px 30px rgba(7, 8, 11, 0.16)`): Book covers at rest, strengthening on hover.
- **Card response** (`0 16px 30px rgba(7, 8, 11, 0.12)`): Creator hover feedback; institutions use a slightly wider companion shadow.
- **Overlay lift** (`0 28px 90px rgba(0, 0, 0, 0.42)`): Creator and book dialogs over the dark backdrop.
- **Jersey cut** (`drop-shadow(12px 12px 22px rgba(7, 8, 11, 0.14))`): The desktop hero V.

**The Hierarchy Earns Shadow Rule.** Resting cards begin with a rule and white surface. Strong shadow is reserved for featured media, lifted books, responsive hover state, and overlays.

## Shapes

Rounded rectangles keep the familiar portal comfortable while the V supplies the unmistakable silhouette. Media thumbnails use restrained eight-pixel corners; compact controls use ten pixels; actions use twelve; creator and route cards use fourteen; large learning, institution, and modal folios use sixteen. The mobile dialog intentionally removes rounding when it becomes a full-viewport surface.

The V itself is a nested polygon cut: black outside, red in the middle, gold inside, and a final jersey-paper channel. Smaller shelf markers use the same inward waist. Thin horizontal black-red-gold rules repeat the motif beneath headings, card images, list headers, book covers, and dialogs.

**The V Is the Signature Rule.** Use the literal nested V for decisive transitions and the thin three-stripe rule for repetition. Do not scatter unrelated flag blocks or sports emblems across the interface.

## Components

### Buttons

- **Shape:** Twelve-pixel corners, tracked condensed uppercase labels, and a minimum 46px height.
- **Primary:** Signal red with optic-white text and a restrained red shadow.
- **Quiet:** A translucent-to-white field with a gray border and display-ink text.
- **Hover / Focus:** Hover lifts two pixels; primary darkens to Deep Signal Red. Focus always uses the three-pixel Trophy Gold outline with a four-pixel offset.

### Navigation

- The shared site navbar remains black and unchanged in structure; German theming is limited to white type, a gold logo rule, and the existing red channel action.
- The sticky German chapter bar uses jersey paper, centered uppercase destinations, a four-pixel red active underline, a German mark on the left, and the channel action on the right.
- Under 900px, the mark compresses to the flag and the chapter track scrolls horizontally without a visible scrollbar.

### Learning Route and Modules

- Route cards are white, lightly ruled, and finished by a six-pixel black-red-gold seam. They form a quick path into Complete German, Linguno, Extr@, books, and creator voices.
- Complete German pairs a black copy panel with the verified SoundCloud embed inside a diagonal red-gold-paper frame.
- Linguno uses a gold training field, diagonal black and red cuts, and the local German-jersey mascot.

### Personal and Extr@ Players

- Aljohn's single verified German video stays in its own featured 16:9 player and clickable local-thumbnail list entry.
- Extr@ uses a separate player plus a vertically contained 13-episode list. The current episode receives a soft background and a red inset seam; durations use tabular numerals.
- Player and episode thumbnails remain local, lazy-loaded below the first viewport, and backed by a local fallback.

### Bookshelves

- Books form a contained horizontal shelf with visible previous/next controls, snap-aligned covers, and compact title, author, and CEFR copy.
- Covers preserve their canonical local art, add only a thin three-stripe foot, and open the German book dialog rather than navigating immediately.

### CEFR Filter, Creator Shelves, and Institutions

- The native select defaults to all levels and reports its result through the adjacent live status. Filtering uses only declared dataset ranges.
- Every creator category has a V marker, heading, optional note, visible desktop arrows, and an independent horizontal row.
- Creator cards keep a square local portrait, uniform height, white body, category, name, CEFR range, and details action.
- Goethe-Institut Philippinen and Germany in the Philippines remain outside the general creator shelves in a dedicated horizontal institution shelf. Goethe leads with the dark treatment; both open the same accessible details folio.

### Modal Folios

- Creator dialogs use a three-column desktop folio: black profile panel, white copy panel, and soft media panel. Intermediate layouts use two columns; compact layouts become full-height and single-column.
- Book dialogs pair a black cover panel with one reading column and become full-height on mobile.
- Both layers include the sticky three-stripe header, visible 44px close control, backdrop and Escape closing, body-scroll lock, focus trapping, and trigger-focus restoration. Verified video absence shows a clear in-frame state without hiding external links.

### Local Media and Provenance

- Durable raster assets ship locally under the German surface or an established shared asset directory. Public data and markup do not hotlink preview artwork.
- Generated rasters carry the exact prompt in an adjacent JSON sidecar. Sourced or pre-existing rasters carry their origin, retrieval context, and non-generated status in the same sidecar format.
- Documentary people, official marks, video thumbnails, creator portraits, book covers, and institutional identities are not replaced by generated substitutes.

## Do's and Don'ts

### Do:

- **Do** keep the black-red-gold V as the page's structural seam, not merely a colored accent.
- **Do** preserve both navigation layers and derive sticky offsets from their real shipped heights.
- **Do** keep Aljohn's personal player, Extr@, books, creator shelves, and institutions as distinct modules.
- **Do** keep every long shelf bounded, snap-aligned, and independently scrollable.
- **Do** preserve local media, adjacent provenance metadata, meaningful alternatives, intrinsic dimensions, and fallbacks.
- **Do** preserve the gold focus outline, reduced-motion behavior, dialog focus management, and explicit unavailable-video state.

### Don't:

- **Don't** turn the surface into a sports shop, team dashboard, equipment wall, or generic flag skin.
- **Don't** introduce official football logos or additional sports branding; the jersey V and knit material already carry the reference.
- **Don't** flatten creator categories into one grid or mix the two institutions back into general creator shelves.
- **Don't** replace the real featured player, the Extr@ episode list, or local thumbnail previews with generic embeds or text-only rows.
- **Don't** tint or generate identity media when verified documentary or official assets exist.
- **Don't** add broad entrance animation; the single jersey-cut reveal is the only opening gesture and must respect reduced motion.
