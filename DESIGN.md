---
name: "Mon parcours en français — L’atlas cousu"
description: "A stitched documentary atlas for Aljohn’s personal French-learning library."
colors:
  indigo-950: "#111820"
  indigo-900: "#1a2c40"
  indigo-800: "#2a4257"
  indigo-700: "#3f5a70"
  linen-100: "#e2d8c7"
  linen-200: "#d9cebe"
  linen-300: "#c5b8a5"
  chambray: "#a7b8c7"
  thread: "#8a2b1f"
  thread-bright: "#b33a2e"
  stitch-light: "rgba(226, 216, 199, 0.82)"
  stitch-dark: "rgba(138, 43, 31, 0.74)"
  focus: "#ffd668"
  pp-cobalt: "#0645d8"
  pp-cobalt-deep: "#0336ad"
  pp-red: "#df2b1f"
  pp-yellow-focus: "#ffdb00"
  pp-ink: "#11151a"
  pp-muted: "#5e6670"
  pp-paper: "#fbfbfa"
  pp-line: "#cfd4da"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(3rem, 7vw, 7.5rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "normal"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5.6rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "0.025em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  body:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.06em"
  handwriting:
    fontFamily: "Caveat, cursive"
    fontSize: "clamp(1.35rem, 2.5vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  pp-display:
    fontFamily: "PP Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(4rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  pp-body:
    fontFamily: "PP Body, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  square: "0"
  seam-soft: "0.2rem"
  control: "0.25rem"
  pocket: "0 0 1.15rem 1.15rem"
  final-pocket: "0 0 1.75rem 1.75rem"
  circle: "50%"
spacing:
  xs: "0.45rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "clamp(4.75rem, 9vw, 8.5rem)"
components:
  nav-masthead:
    backgroundColor: "{colors.indigo-900}"
    textColor: "{colors.linen-100}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0.8rem clamp(0.7rem, 1.35vw, 1.25rem)"
    height: "4.5rem"
  atlas-spine-entry:
    backgroundColor: "{colors.linen-200}"
    textColor: "{colors.indigo-900}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0.6rem 0.5rem"
    height: "4.1rem"
  button-primary:
    backgroundColor: "{colors.thread}"
    textColor: "{colors.linen-100}"
    typography: "{typography.label}"
    rounded: "{rounded.seam-soft}"
    padding: "0.72rem 1rem"
    height: "3rem"
  button-secondary:
    backgroundColor: "{colors.linen-100}"
    textColor: "{colors.indigo-900}"
    typography: "{typography.label}"
    rounded: "{rounded.seam-soft}"
    padding: "0.72rem 1rem"
    height: "3rem"
  search-field:
    backgroundColor: "{colors.linen-100}"
    textColor: "{colors.indigo-900}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.85rem 1rem 0.85rem 2.85rem"
    height: "3.3rem"
  destination-index:
    backgroundColor: "{colors.linen-100}"
    textColor: "{colors.indigo-900}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0.75rem 1.3rem"
    height: "3.8rem"
  creator-card:
    backgroundColor: "{colors.linen-100}"
    textColor: "{colors.indigo-900}"
    rounded: "{rounded.square}"
    padding: "0"
    height: "7rem"
  creator-shelf:
    backgroundColor: "{colors.indigo-900}"
    textColor: "{colors.linen-100}"
    rounded: "{rounded.square}"
    padding: "0"
    width: "100%"
  photo-carousel:
    backgroundColor: "{colors.indigo-950}"
    textColor: "{colors.linen-100}"
    rounded: "{rounded.square}"
    padding: "0"
    height: "34rem"
  carousel-control:
    backgroundColor: "{colors.indigo-950}"
    textColor: "{colors.linen-100}"
    rounded: "{rounded.square}"
    size: "3rem"
  modal-folio:
    backgroundColor: "{colors.linen-200}"
    textColor: "{colors.indigo-900}"
    rounded: "{rounded.square}"
    width: "min(96vw, 88rem)"
    height: "min(92dvh, 58rem)"
  pp-search-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.pp-ink}"
    typography: "{typography.pp-body}"
    rounded: "{rounded.square}"
    padding: "0 1rem"
    height: "3.625rem"
  pp-filter-tab:
    backgroundColor: "{colors.pp-paper}"
    textColor: "{colors.pp-ink}"
    typography: "{typography.pp-display}"
    rounded: "{rounded.square}"
    padding: "0.65rem 1rem"
    height: "2.875rem"
  pp-filter-tab-active:
    backgroundColor: "{colors.pp-red}"
    textColor: "#ffffff"
    typography: "{typography.pp-display}"
    rounded: "{rounded.square}"
    padding: "0.65rem 1rem"
    height: "2.875rem"
  pp-paper-action:
    backgroundColor: "{colors.pp-red}"
    textColor: "#ffffff"
    typography: "{typography.pp-display}"
    rounded: "{rounded.square}"
    padding: "0.65rem 1rem"
    height: "3rem"
---

# Design System: Mon parcours en français — L’atlas cousu

## Overview

**Creative North Star: "L’atlas cousu"**

This system turns Aljohn’s French-learning library into a physical atlas assembled from cloth, thread, photographs, and personal notes. Indigo denim establishes the field; cream linen becomes the paper and labels; oxblood thread marks choices and seams. The system is tactile and editorial, but the documentary evidence remains the hero.

The French surface is intentionally distinct from the shared site chrome. Within `languages/french/`, large square folios, stitched rails, real photographs, and horizontal library shelves replace generic digital cards. Depth should feel made by overlap, seams, and fabric weight—not by translucent glass or ornamental interface effects.

**Key Characteristics:**

- Documentary photography leads; decoration supports it.
- Indigo textile fields alternate with cream linen folios and faded chambray pacing bands.
- Two stitched navigation layers orient the visitor without flattening the atlas into one menu.
- Square geometry dominates, with restrained softness reserved for sewn pockets and a single circular ritual marker.
- Horizontal shelves and one-photo-at-a-time albums keep dense collections browsable without compression.
- Personal notes use a restrained handwritten accent; all functional copy stays crisp and condensed or plainly readable.

## Colors

The palette feels worn-in and archival: dark maritime indigos, warm unbleached linen, faded workwear blue, and sparse oxblood repair thread.

### Primary

- **Atlas Indigo** (#1a2c40): The main denim field for the page masthead, hero ground, shelf frames, playable-video chrome, and modal headers.
- **Oxblood Thread** (#8a2b1f): The decisive action and selection color for pockets, active index tabs, controls, and red stitches.

### Secondary

- **Shelf Indigo** (#2a4257): A lighter textile field for shelf headers and major pacing bands.
- **Faded Chambray** (#a7b8c7): A quiet blue cloth used behind personal notes and section transitions.
- **Bright Repair Thread** (#b33a2e): A brighter red reserved for fine active underlines and small state changes.

### Tertiary

- **Golden Focus** (#ffd668): The high-contrast keyboard-focus ring. It is functional and should not become a decorative accent.

### Neutral

- **Selvedge Ink** (#111820): Deepest page ground, body ink, media wells, and the dark outer ring around focused controls.
- **Seam Blue** (#3f5a70): Secondary blue-gray used in dividers and quiet structural strokes.
- **Label Linen** (#e2d8c7): High-contrast text on indigo and the primary cream surface for labels, cards, and controls.
- **Spine Linen** (#d9cebe): The atlas spine and larger cream folios.
- **Worn Linen** (#c5b8a5): A darker neutral for subdued cloth variation.
- **Cream Stitch** (rgba(226, 216, 199, 0.82)): Dashed seams on indigo fields.
- **Red Stitch** (rgba(138, 43, 31, 0.74)): Dashed seams on linen fields.

**The Thread Is Sparse Rule.** Oxblood identifies a primary action, an active destination, or a sewn accent. Do not let it become a broad background across multiple neighboring surfaces.

**The Material Pairing Rule.** Cream stitches belong on indigo cloth; red stitches belong on cream linen. This reversal is what keeps the seams legible.

## Typography

**Display Font:** Barlow Condensed (with sans-serif)
**Body Font:** Instrument Sans (with sans-serif)
**Label Font:** Barlow Condensed (with sans-serif)
**Handwritten Accent:** Caveat (with cursive)

**Character:** Barlow Condensed gives the atlas its tall, block-printed index language; Instrument Sans keeps long French copy calm and legible. Caveat appears only where Aljohn’s memory or a photograph caption should feel personally annotated.

### Hierarchy

- **Display** (700, clamp(3rem, 7vw, 7.5rem), line-height 0.86): Creator names in the full-screen sewn folio and other singular display moments.
- **Headline** (700, clamp(2.75rem, 6vw, 5.6rem), line-height 0.86): Major section openings, set in uppercase with compact vertical rhythm.
- **Title** (700, 1.5rem, line-height 1): Folio subheads, creator-modal headings, and strong card titles.
- **Body** (400, 1rem, line-height 1.75): Explanations and narrative copy, generally held near 58–66 characters per line.
- **Label** (700, 1.05rem, 0.06em letter-spacing, uppercase): Navigation, buttons, filters, counters, and shelf labels.
- **Handwriting** (600, clamp(1.35rem, 2.5vw, 2.25rem), line-height 1): Personal photo notes and full-screen captions only.

**The Three-Voices Rule.** Condensed block type operates the atlas, Instrument Sans explains it, and Caveat signs the human moments. Never use the handwriting face for controls or general body copy.

## Layout

The first viewport uses an approximately 18/82 atlas split: a cream spine (`clamp(16rem, 18vw, 20rem)`) beside a documentary photo quilt. The quilt gives one group photograph the dominant two-row area and places two supporting images in the narrower column. The French masthead sits below the shared site header and stays sticky on desktop.

The content system has two spatial modes. Curated creators use edge-to-edge horizontal shelves: a fixed category rail (`clamp(11rem, 17vw, 16rem)`) and a horizontally scrolling row of cards (`clamp(17rem, 24vw, 22rem)`) with proximity snapping. Long-form modules use generous centered folios up to 92rem wide, with section breathing room of `clamp(4.75rem, 9vw, 8.5rem)`. Playlists split a featured player from its list; place and community resources alternate photograph and copy.

Resource albums show exactly one photograph in the viewport at a time, with previous/next controls and a live position label. Selecting the photograph opens the same album in a full-screen lightbox rather than expanding the inline layout.

At 1100px and below, playlists, resource spotlights, Extr@, and modal bodies collapse to one column. At 980px the atlas spine and quilt narrow. At 760px and below, the page masthead becomes a two-row horizontal scroller, the spine becomes a horizontal stitched index above a stacked pocket, the hero quilt stacks its dominant image over two supporting images, headings and toolbars become single-column, and action rows become full-width. At 520px, labels, card rails, and media dimensions tighten again without reducing tap targets.

**The Shelf Independence Rule.** Each creator category owns its own horizontal shelf. Never merge categories into one mixed row or replace the shelves with a dense card grid.

## Elevation & Depth

Depth is structural and textile-led. Most surfaces remain flat and square, separated by 2px dashed seams and changes in material. Large folios use hard offset blocks to suggest stacked cloth; only sticky chrome, floating notes, and overlay dialogs receive softer ambient shadows. Glass blur is not part of this system.

### Shadow Vocabulary

- **Atlas edge** (`box-shadow: 10px 0 28px rgba(7, 16, 25, 0.2)`): Separates the linen spine from the photo quilt.
- **Stacked folio** (`box-shadow: 14px 16px 0 rgba(17, 24, 32, 0.24)`): Gives playlists and resource folios a physical offset layer.
- **Indigo folio** (`box-shadow: 14px 16px 0 rgba(7, 16, 25, 0.34)`): The stronger dark offset under nocturnal story panels.
- **Pinned note** (`box-shadow: 0 12px 30px rgba(7, 16, 25, 0.28)`): Lifts a personal annotation just above documentary photography.
- **Overlay folio** (`box-shadow: 0 30px 90px rgba(0, 0, 0, 0.52)`): Reserves maximum separation for the creator details dialog.

**The Sewn-Not-Floating Rule.** A resting content surface earns depth through a seam, textile change, or hard offset. Do not apply generic soft shadows to every card.

## Shapes

The default silhouette is stitched-square (`0` radius) with visible 2px dashed seams. Small operational controls use only a cloth-softened corner (`0.2rem` to `0.25rem`). The hero and final calls to action are literal bottom-rounded pockets (`0 0 1.15rem 1.15rem` and `0 0 1.75rem 1.75rem`). The circular 3 h ritual badge is a deliberate exception; it reads as a sewn time marker, not a reusable button shape.

Photography is cropped into square-edged patches and protected with `object-fit: cover`; full-screen lightbox images switch to `object-fit: contain`. Category filters are contiguous rectangular index tabs divided by stitches, not pills. Creator category and CEFR metadata remain plain type rather than enclosed tags.

**The Square-First Rule.** Start every new surface, card, field, and media frame at zero radius. Add softness only when the object is specifically a pocket or a small physical control.

## Components

### Buttons

Buttons feel like sewn labels: compact, uppercase, and physically responsive.

- **Shape:** Nearly square cloth-softened corners (`0.2rem`) with a 2px dashed border.
- **Primary:** Oxblood cloth with cream text, condensed label type, and `0.72rem 1rem` padding.
- **Secondary:** Linen texture with indigo text and the same geometry.
- **Hover / Focus:** Hover lifts 3px and strengthens the shadow; keyboard focus uses a 3px Golden Focus outline, a 3px gap, and a 6px Selvedge Ink outer ring.

### Inputs / Fields

Search and level controls are flat linen fields with square corners, a 2px dashed blue-gray seam, a minimum height of 3.3rem, and readable Instrument Sans copy. Focus keeps the global Golden Focus treatment. On small screens the search and level selector stack into one column.

### Navigation

The French surface uses two coordinated navigation layers. The indigo masthead carries brand, a horizontally scrollable destination row, and search; active and hover destinations grow a thin Bright Repair Thread underline. The cream atlas spine repeats the four action-oriented entrances with icons and stitched dividers. On mobile, both become horizontal scrollable indexes, while the story pocket sits beneath them.

### Category Index

Creator filters form one continuous linen strip with rectangular tabs, no gaps, and dashed vertical dividers. The active tab becomes oxblood with cream text. The strip scrolls horizontally instead of wrapping.

### Creator Shelves and Cards

Each shelf joins an indigo category rail to a cream horizontal card row. Cards are image-first buttons: a square profile image occupies the left strip; creator name, category, and CEFR range remain compact on the right. Hover gently enlarges only the image; focus moves inside the card as a double inset Golden Focus and Selvedge Ink ring. Activating a card opens the details folio instead of navigating away.

### Playlists and Extr@

Playable modules join a real featured embed to a stitched list. The selected list item reverses to oxblood and cream without changing shape. Extr@ keeps the same physical grammar but remains its own standalone module, with a horizontal episode row rather than being absorbed into the general playlist.

### Resource Albums

Resource spotlights alternate a large documentary photograph and a linen story folio. Albums keep one active photograph in the inline viewport; square previous/next controls sit over the image, captions remain honest, and a compact live counter reports position. The photograph itself is the lightbox trigger.

### Restaurant Addresses

Restaurant shelves use a local, verified brand mark or storefront sign as the card image so each place is recognizable before opening it. The accessible details folio keeps the separate documentary venue or food photograph at full size, followed by address, contact details, verified social links, and Aljohn’s related video when one exists. Brand assets and documentary photographs remain separate dataset fields; neither role uses an Aljohn video thumbnail.

### Modal and Lightbox

The creator modal is a near-full-screen sewn folio: indigo image-and-title header, linen notes, a chambray personal comment, and an indigo sample-video panel. The photo lightbox fills the viewport with Selvedge Ink, contains the image, and keeps square oxblood controls above the media. Both overlays trap focus, close with Escape or the backdrop, lock body scroll, and return focus to their trigger. The lightbox also accepts left/right arrow keys.

Motion is restrained: state changes use 180–220ms, cloth-like transforms use `cubic-bezier(0.16, 1, 0.3, 1)`, and photograph scaling runs more slowly. Reduced-motion mode removes the transforms and reduces all transitions and animations to effectively instantaneous changes.

## Do's and Don'ts

### Do:

- **Do** lead with real documentary photographs and preserve faces through deliberate crop positioning.
- **Do** pair cream seams with indigo fields and red seams with linen folios.
- **Do** keep creator categories in independent horizontal shelves with visible category rails.
- **Do** keep only one active photograph visible in each inline resource album, with controls, status, and a full-screen viewing path.
- **Do** preserve the Golden Focus ring, focus trapping, Escape behavior, and focus restoration in overlays.
- **Do** retain generous 92rem folios, long-form line lengths near 58–66 characters, and ample vertical section spacing.

### Don't:

- **Don't** turn the system into glassmorphism, floating digital cards, or a generic resource portal.
- **Don't** introduce pill-shaped filters, tags, buttons, or logo containers; the shipped grammar is rectangular and stitched.
- **Don't** use decorative or generated imagery where a real project photograph, profile image, logo, or video frame exists.
- **Don't** combine creator categories into a single mixed shelf or replace one-photo carousels with crowded contact sheets.
- **Don't** use Caveat for functional controls, metadata, or long-form body copy.
- **Don't** hide focus outlines or rely on motion to communicate state.

## Scoped Surface: Polyglot Papers — Language Lab Foldout

This contract applies only to `blog.html` and `#polyglot-papers-preview` in `index.html`, implemented by `css/polyglot-papers-preview.css`, `js/blog_main.js`, and `js/homepage_blog_preview.js`. It extends the project with a separate editorial visual world and does not replace or dilute the French `L’atlas cousu` system above. The approved visual authority is `.impeccable/mocks/polyglot-papers-01-language-lab-foldout.png`.

**Creative North Star: "Language Lab Foldout"**

Polyglot Papers behaves like an instruction-manual archive: a decisive cobalt masthead folds into a bright paper workspace, then resolves one featured essay into compact indexed rows. Measurement marks, red selection blocks, and a small yellow inventory accent provide the laboratory character. Real article titles, excerpts, dates, categories, reading times, links, and local cover assets remain the content authority.

### Palette and Type

- **Cobalt** (`#0645d8`) establishes mastheads, numbered references, and the homepage archive action; **Deep Cobalt** (`#0336ad`) is the darker supporting blue.
- **Selection Red** (`#df2b1f`) marks active filters and primary paper actions. **Inventory Yellow / Focus** (`#ffdb00`) is reserved for small instructional accents and the visible focus outline.
- **Ink** (`#11151a`), **Muted** (`#5e6670`), **Paper** (`#fbfbfa`), and **Line** (`#cfd4da`) create a flat, high-contrast editorial workspace.
- `PP Condensed` is the local alias for bold Barlow Condensed and owns display headings, labels, indexes, and controls. `PP Body` is the local alias for regular Barlow and owns search, metadata, excerpts, and supporting copy.

### Layout and Geometry

- Geometry is square. Use rules, color fields, and contained folds for separation; do not introduce rounded cards, pills, soft card shadows, or a generic card wall.
- The archive follows one reading path: cobalt masthead and search, compact filter controls, one 16:9 featured cover with editorial copy, then numbered index rows.
- Filter rows stay in a single contained horizontal scroller. Controls remain at least 44px high, and the document itself must not overflow horizontally.
- The homepage preview is a compact fold rather than a second archive: its selected feature sits beside recent indexed rows and a single archive action.
- At 980px and below, the featured archive and homepage preview become one-column compositions. At 700px and below, the masthead fold, title, feature, index metadata, and homepage feature stack; the homepage section uses `scroll-margin-top: 76px` to clear the fixed shared navbar.

### Components and States

- Search is a square white field inside the cobalt masthead, with an explicit accessible label and yellow `:focus-within` border.
- Topic and language filters expose pressed state with `aria-pressed`; the selected tab reverses to red with white text. Sorting remains a native square select, reset restores the default archive state and returns focus to search, and the live result count announces changes.
- Paper actions are square red controls. The featured action includes the only motion detail: a restrained arrow translation on hover. `prefers-reduced-motion: reduce` removes that transition.
- Covers stay at 16:9 with meaningful alternative text. Failed images are removed without breaking the reading path.
- Preserve the shared navbar and footer loaders, the existing article dataset, and every real destination link. The homepage fold must remain isolated from unrelated homepage sections.

**The One Fold Rule.** Lead with one featured paper and quieter indexed rows. Never flatten the archive into equal-weight cards.

**The Measured Motion Rule.** Motion is limited to the paper-action arrow microinteraction and must disappear under reduced-motion preferences.
