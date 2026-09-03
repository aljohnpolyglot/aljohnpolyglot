---
name: Caderno de Jogo
description: A Canarinha matchday notebook for Aljohn's Portuguese journey.
colors:
  pitch-green: "#075c36"
  pitch-green-deep: "#033b25"
  pitch-green-dark: "#022a1b"
  canarinha-yellow: "#ffdf36"
  federation-blue: "#1546a0"
  federation-blue-deep: "#0b2b6b"
  warm-paper: "#fffdf2"
  editorial-ink: "#10261d"
  utility-muted: "#5a6d64"
  field-line: "rgba(255, 253, 242, 0.5)"
  night-pitch: "#001d13"
  training-paper: "#eef2e4"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(4rem, 8vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(3.5rem, 7vw, 7rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "normal"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
rounded:
  square: "0"
  control: "4px"
  circle: "50%"
spacing:
  page-inline: "clamp(1.1rem, 4vw, 4.5rem)"
  section-block: "clamp(4.75rem, 9vw, 8.75rem)"
  content-max: "1240px"
components:
  button-yellow:
    backgroundColor: "{colors.canarinha-yellow}"
    textColor: "{colors.pitch-green-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.1rem"
    height: "48px"
  button-blue:
    backgroundColor: "{colors.federation-blue}"
    textColor: "{colors.warm-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.1rem"
    height: "48px"
  filter-selected:
    backgroundColor: "{colors.canarinha-yellow}"
    textColor: "{colors.pitch-green-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0.5rem 0.8rem"
    height: "44px"
---

# Design System: Caderno de Jogo

## Overview

**Creative North Star: "Caderno de Jogo"**

The Portuguese surface is a Canarinha matchday notebook: a sports-editorial world where pitch markings, lineup rails, jersey colors, and documentary media give Aljohn's language journey a structure visitors can read and explore. The field metaphor organizes the experience instead of sitting on top of it as decoration. Chapters become match phases, Aljohn's playlist becomes the starting lineup, training becomes a tactics board, and each creator category keeps its own stand.

The page is energetic without becoming noisy. Deep greens hold the world together, yellow is reserved for decisions and active states, federation blue establishes structure, and warm paper gives long descriptions room to breathe. Real thumbnails, portraits, covers, logos, and photographs supply the evidence; the interface supplies the rhythm.

**Key Characteristics:**

- Canarinha matchday color blocking with legible warm-paper reading surfaces.
- Condensed scoreboard typography paired with a practical editorial body face.
- Squared cards, field geometry, strong rules, and restrained four-pixel control corners.
- Local documentary media used as content evidence, never generic ornament.
- Independent horizontal shelves that preserve category identity and contain their own overflow.

## Colors

Pitch greens establish place, Canarinha yellow marks consequential choices, federation blue provides structure, and warm paper protects reading clarity. The Linguno training chapter owns the bright yellow field; the podcast chapter shifts to deep federation blue so practice and listening read as separate modes at a glance.

### Primary

- **Pitch Green:** The main field for the hero and creator stands; it makes yellow states immediately legible.
- **Deep Pitch Green:** A supporting field tone for structural layers.
- **Dark Pitch Green:** The night-match background for Aljohn's personal playlist and other high-contrast passages.

### Secondary

- **Canarinha Yellow:** The decision color for primary actions, selected filters, active playlist entries, captions, and focus treatment.
- **Federation Blue:** The structural accent for secondary actions, metadata, borders around podcast covers, and modal controls.
- **Deep Federation Blue:** The grounded community backdrop and outer focus ring.

### Neutral

- **Warm Paper:** The default page and card surface for sustained reading.
- **Editorial Ink:** The principal text color on light surfaces.
- **Utility Muted:** Supporting copy and compact card descriptions.
- **Field Line:** Translucent pitch markings and separators on dark fields.
- **Night Pitch:** The featured-player board beneath Aljohn's own videos.
- **Training Paper:** The pale tactics-board and personal-note surface.

**The Yellow Means Action Rule.** Use Canarinha yellow for a decision, a current state, or a meaningful editorial emphasis; it is not ambient decoration.

**The Evidence Stays Natural Rule.** Do not recolor photographs, portraits, thumbnails, book covers, podcast artwork, or community identity assets to force them into the palette.

## Typography

**Display Font:** Barlow Condensed (with sans-serif fallback)  
**Body Font:** Archivo (with sans-serif fallback)

**Character:** Barlow Condensed gives headings, navigation, labels, and calls to action the compressed authority of a lineup board. Archivo keeps stories, guidance, and modal copy compact, contemporary, and comfortable at reading length.

### Hierarchy

- **Display:** Heavy, tightly stacked, uppercase type for the first-view statement and other decisive moments.
- **Headline:** Heavy, uppercase chapter titles that can fill the width without losing the matchday cadence.
- **Title:** Condensed names for creators, podcasts, playlist entries, books, and modal sections.
- **Body:** Sentence-case editorial copy, normally held near 44-58 characters per line in prominent passages.
- **Label:** Bold, uppercase scoreboard language for navigation, metadata, status, and actions.

**The Two-Voice Rule.** Barlow Condensed carries the stadium voice; Archivo carries explanation. Do not set long descriptions in the display face.

## Layout

The page uses a fluid inline gutter, generous vertical chapter rhythm, and a centered maximum content field. The shared global navbar remains present; the yellow chapter bar sits below it, centered at desktop widths and becoming a contained single-row scroller on narrow screens.

The hero is a split pitch: Aljohn's expanded first-person story faces an accessible carousel of real community photographs. His personal playlist follows immediately as the second chapter, pairing a featured player with a lineup rail. Podcasts, books, and creator categories use contained horizontal shelves with scroll snapping, while creator categories remain independent labeled rows. The document itself never gains horizontal overflow.

At 980px, the hero and playlist stack, the three match moments become a single column, and the tactics board simplifies. At 760px, headings, creator headers, community features, and modal bodies collapse to one column; navigation changes to a left-aligned horizontal track. At 520px, calls to action become full width, shelf cards switch to viewport-relative widths, and dialogs become edge-to-edge.

**The Two-Navbar Rule.** Offset the chapter bar and document anchors by the real shared-navbar height; neither navigation layer may cover or replace the other.

**The Shelf Owns Its Overflow Rule.** Every long row scrolls inside its own bounded track with overscroll containment; the page never scrolls sideways.

## Elevation & Depth

The system is flat by default. Thick color blocks, borders, pitch lines, and media framing create most hierarchy. Shadows appear only where a real object is meant to sit above the field: the hero photograph, featured playlist board, and modal dialog.

### Shadow Vocabulary

- **Documentary Lift:** A directional green-black shadow behind the hero media.
- **Lineup Lift:** A quieter black shadow behind the featured playlist board.
- **Dialog Lift:** The strongest directional shadow, reserved for the open details layer.

**The Flat Field Rule.** Cards and chapter surfaces stay flat at rest; depth is reserved for featured media and overlays.

## Shapes

The form language is squared, graphic, and rule-driven. Creator cards, filters, dialogs, media frames, and lineup rows use square corners. Primary action controls alone may soften to the established four-pixel radius. Circular geometry belongs to literal pitch markings, not to cards or decorative pills. Thick media borders and strong section rules should read like field paint and printed scoreboards.

**The No-Pills Rule.** Do not turn filters, tags, navigation items, or metadata into capsules; square geometry is part of the Portuguese identity.

## Components

### Buttons

- **Shape:** Compact editorial controls with a four-pixel corner and a minimum 48px touch height.
- **Primary:** Canarinha yellow on dark pitch green for the main next action.
- **Secondary:** Federation blue with warm or true-white text when the action belongs to structure rather than momentum.
- **Outline:** Transparent on dark fields with a current-color border.
- **Hover / Focus:** Hover lifts by two pixels. Keyboard focus uses a yellow outline, clear offset, and deep-blue outer ring.

### Chips

- **Style:** CEFR filters are square, bordered scoreboard controls in a horizontally scrollable row.
- **State:** Exactly one value is pressed; the selected state changes to Canarinha yellow with dark-green text. Filtering may hide empty shelves but never flattens the creator library.

### Cards / Containers

- **Corner Style:** Square.
- **Background:** Creator cards use warm paper on a pitch-green field; podcast and book cards keep transparent bodies so their cover art leads.
- **Shadow Strategy:** Flat at rest. Creator hover draws a yellow inner frame rather than adding a shadow.
- **Internal Padding:** Compact one-rem card bodies; larger feature panels use fluid padding.

### Navigation

- The secondary match navigation is yellow with blue structure and condensed uppercase labels.
- Desktop tracks are centered. Narrow tracks are left-aligned, single row, touch-scrollable, and do not wrap.
- Hover, focus, and current-location states switch to federation blue with white text.

### Personal Playlist

- Aljohn's videos occupy a dedicated dark lineup board, separate from all curated creators.
- Every entry includes a local thumbnail, uppercase title, and compact metadata.
- The current entry receives a yellow inset outline, green fill, and updates the privacy-enhanced featured player.

### Creator Stands

- Every theme owns a visible heading and its own horizontal row. `Crianças e animação` remains a dedicated shelf.
- Cards lead with a local portrait, then country/category metadata, name, CEFR range, and concise neutral description.
- The visible CEFR control filters only declared dataset ranges and preserves the independent shelf architecture in the unfiltered state.

### Details Dialogs

- Creator, podcast, and book cards open the shared details layer instead of navigating immediately.
- The dialog uses a green media panel and warm-paper copy panel, becoming one column and then edge-to-edge on small screens.
- Focus moves into the dialog, is trapped while open, returns to the trigger on close, and Escape or the backdrop closes the layer. Background scrolling is locked.

### Community Features

- Filipinhos is a compact logo-led editorial spread: deep green field, yellow rule, warm paper around the contained module, and a restrained identity block.
- Calvin Castiel is documentary-photo-led with a dark-pitch editorial field.
- Preserve each source's actual visual character inside the shared matchday frame.

## Do's and Don'ts

### Do:

- **Do** use field geometry to organize information and state.
- **Do** keep Aljohn's personal player, podcasts, creator stands, books, training, and community chapters conceptually distinct.
- **Do** use local thumbnails, portraits, covers, logos, and photographs as the page's visual proof.
- **Do** preserve visible focus, 44-48px touch targets, dialog focus restoration, and reduced-motion behavior.
- **Do** keep native Portuguese copy and distinct neutral versus personal commentary.

### Don't:

- **Don't** recolor another language page into Portuguese; this page owns a Canarinha matchday notebook, not a generic language dashboard.
- **Don't** flatten independent creator categories into one mixed grid or mix `Crianças e animação` into adult entertainment.
- **Don't** replace the featured player and clickable local-thumbnail lineup with a generic playlist embed.
- **Don't** use glass effects, rounded card systems, decorative pills, or unrelated stadium clichés.
- **Don't** claim desktop or mobile screenshot validation until those captures have been recaptured and independently reviewed.
