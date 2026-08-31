---
name: "Bahasa Indonesia — Panggung Kepulauan"
description: "A cinematic island stage where Aljohn's Indonesian story moves from music and conversation into documented community."
colors:
  twilight-sea: "#071b2a"
  twilight-sea-soft: "#0d2c3d"
  merah-putih-red: "#d91f32"
  merah-putih-red-dark: "#a91222"
  warm-cream: "#f7f3e9"
  paper-white: "#fffdf7"
  deep-ink: "#12232d"
  bamboo-amber: "#f3b13f"
  island-turquoise: "#48c6bd"
  bamboo-brown: "#8c5a2b"
  quiet-slate: "#62727a"
  structural-border: "rgba(7, 27, 42, 0.18)"
typography:
  display:
    fontFamily: "Chivo, sans-serif"
    fontSize: "clamp(3.25rem, 7vw, 7.4rem)"
    fontWeight: 900
    lineHeight: 0.91
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Chivo, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5.2rem)"
    fontWeight: 900
    lineHeight: 0.96
    letterSpacing: "-0.055em"
  title:
    fontFamily: "Chivo, sans-serif"
    fontSize: "clamp(1.45rem, 2.4vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  body:
    fontFamily: "Commissioner, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Saira Condensed, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.055em"
rounded:
  stage-square: "0"
spacing:
  page-edge: "clamp(1.15rem, 4vw, 4.5rem)"
  content-stage: "1200px"
  hero-stage: "1440px"
  section: "clamp(5rem, 9vw, 9rem)"
  control-gap: "0.8rem"
  shelf-gap: "1rem"
components:
  chapter-navigation:
    backgroundColor: "{colors.twilight-sea}"
    textColor: "{colors.warm-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.stage-square}"
    padding: "0.7rem clamp(0.95rem, 2vw, 1.6rem)"
    height: "53px"
    width: "100%"
  action-primary:
    backgroundColor: "{colors.merah-putih-red}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.stage-square}"
    padding: "0.78rem 1.15rem"
    height: "48px"
  action-cream:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.twilight-sea}"
    typography: "{typography.label}"
    rounded: "{rounded.stage-square}"
    padding: "0.78rem 1.15rem"
    height: "48px"
  playlist-item:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.stage-square}"
    padding: "0.85rem 1rem"
    height: "76px"
    width: "100%"
  podcast-card:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    padding: "0"
    width: "clamp(250px, 25vw, 320px)"
  podcast-modal:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    width: "min(1050px, 100%)"
    height: "calc(100dvh - clamp(1.2rem, 5vw, 4rem))"
  creator-level-filter:
    backgroundColor: "{colors.twilight-sea}"
    textColor: "{colors.warm-cream}"
    activeColor: "{colors.merah-putih-red}"
    rounded: "{rounded.stage-square}"
    minControlHeight: "44px"
  creator-card:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    padding: "0"
    width: "clamp(238px, 22vw, 318px)"
  restaurant-card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    width: "clamp(270px, 30vw, 350px)"
    media: "verified venue logo, profile mark, or storefront-sign crop"
  book-card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    width: "min(560px, calc(50% - 0.5rem))"
    media: "canonical local cover from library/images/books/id/"
  book-modal:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    width: "min(960px, 100%)"
  restaurant-modal:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    width: "min(940px, 100%)"
    media: "separate local venue image when verified public photography is available"
  carousel-control:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.twilight-sea}"
    rounded: "{rounded.stage-square}"
    size: "44px"
  creator-modal:
    backgroundColor: "{colors.warm-cream}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.stage-square}"
    width: "min(1050px, 100%)"
    height: "calc(100dvh - clamp(1.2rem, 5vw, 4rem))"
---

# Design System: Bahasa Indonesia — Panggung Kepulauan

## Overview

**Creative North Star: "Panggung Kepulauan"**

The Indonesian page is a cinematic stage spread across an inhabited archipelago. Its visual world is twilight sea, red-white signals, bamboo warmth, concert-poster type, rehearsal-pass controls, local photographs, and documentary sequencing. The composition may carry the depth and wonder of a fantasy landscape, but it is an original Indonesian–Filipino expression rather than an imitation of, or branded reference to, Wonderland.

The story moves in a deliberate sequence: Aljohn's reason for learning, his own videos, a dedicated podcast shelf for longer listening, the voices he listens to, a canonical Indonesian bookshelf, BIPA and KBRI Manila, a tribute to Bapak Agus Widjojo, the food places featured in his videos, then a quiet first-person closing. Wonder is the threshold; real people, media, and community records are the evidence. Bahasa Indonesia is the primary visitor language.

**Key Characteristics:**

- A blue-hour archipelago field creates cinematic depth without pretending to document a real place.
- Red, cream, amber, and turquoise act like stage signals against deep teal-black fields.
- Heavy Chivo headlines have concert-poster scale; Commissioner carries the story; Saira Condensed operates the controls.
- Real photographs appear in framed, one-at-a-time narratives with literal arrow controls.
- Aljohn's personal player, compact podcast shelf, creator shelves, BIPA/KBRI story, memorial, and final venue shelf remain visually and conceptually separate.
- Square edges, hard color bands, borders, and crops create depth; generic floating-card decoration does not.

### Documentary boundary and generated-asset provenance

Two supporting raster scenes were generated specifically for this surface with the built-in OpenAI ImageGen workflow, then stored locally as PNG masters with JPG and WebP delivery derivatives:

- `images/hero/archipelago-stage-generated.*` is the atmospheric hero setting. The shipped CSS uses the JPG. It is an illustrative composite, not a photograph of a named Indonesian location, event, or collaboration.
- `images/hero/cenderawasih-unity-generated.*` is the illustrated pacing divider between Aljohn's player and the creator library. The shipped markup uses the JPG. It is symbolic supporting art, not wildlife documentation.

Generated scenery must never replace or be confused with evidence. Christian Bautista, KBRI Manila, the BIPA competition, Bapak Agus, creators, venues, and future real people or events require verified local documentary media. Do not generate identity-bearing portraits, event records, logos, or testimonial scenes.

### Finish status

The code and scoped system are documented, but the in-app browser was unavailable for the required rendered review. The finish verdict is **RECAPTURE**: browser QA must be recaptured at wide desktop, intermediate/laptop, and narrow mobile widths before the surface can receive a final visual-acceptance verdict. The recapture must include the full page, both navigation layers, hero and media carousel states, playlist selection, the podcast shelf at desktop/laptop/mobile widths, podcast arrow and keyboard scrolling, a long-content podcast modal with and without an Aljohn note, every CEFR filter state and rendered creator shelf, creator modal with and without an Aljohn note, Indonesian bookshelf and book modal, venue shelf and venue modal, lightbox, long content, external actions, focus states, and reduced-motion behavior. This checklist records unverified states; it does not constitute visual acceptance.

## Colors

The palette begins in a deep twilight sea and uses warm, sparse signals that feel equally at home on a concert poster and a community stage.

### Primary

- **Twilight Sea**: The hero, local chapter navigation, playable-media wells, modal media pane, closing panel, and atmospheric dividers. It is the main spatial field.
- **Merah Putih Red**: Primary actions, active navigation, selected markers, card bands, the community field, and decisive structural edges. The darker red is reserved for hover emphasis and alert/error states.

### Secondary

- **Bamboo Amber**: Highlighted words, stage labels on dark fields, the approved BIPA feature, tribute framing, and hover feedback on pale controls.
- **Island Turquoise**: A cool listening signal used for supporting labels, selected-media context, and the global keyboard-focus ring.

### Tertiary

- **Bamboo Brown**: A restrained annotation color for documentary captions and Aljohn-note labels on warm surfaces.

### Neutral

- **Warm Cream**: Primary light surface and high-contrast text against night fields.
- **Paper White**: The cleanest story and creator-library field.
- **Deep Ink**: Main copy on light backgrounds.
- **Quiet Slate**: Secondary descriptions and metadata on light surfaces.
- **Structural Border**: Low-contrast division between adjacent light sections and rows.

**The Signal-Not-Wallpaper Rule.** Red, amber, and turquoise communicate stage, selection, or emphasis. Do not distribute all three evenly through every component.

**The Red-White Discipline Rule.** Red and cream carry the Indonesian signal through blocks and edges; avoid flag-striping every section or reducing the page to a literal flag skin.

## Typography

**Display Font:** Chivo (with sans-serif fallback)
**Body Font:** Commissioner (with sans-serif fallback)
**Label Font:** Saira Condensed (with sans-serif fallback)

**Character:** Chivo gives the story the confidence of a concert bill and holds tight at very large sizes. Commissioner keeps first-person Bahasa Indonesia readable and warm. Saira Condensed makes navigation, counters, metadata, and CTAs feel like rehearsal passes and stage directions.

### Hierarchy

- **Display** (900, `clamp(3.25rem, 7vw, 7.4rem)`, line-height 0.91): The hero statement; constrain it to roughly 12 characters per line and let the amber-emphasized phrase carry the turn.
- **Headline** (900, `clamp(2.5rem, 5vw, 5.2rem)`, line-height 0.96): Major chapter openings, the BIPA and community statements, the tribute, and the closing note.
- **Title** (700, `clamp(1.45rem, 2.4vw, 2.35rem)`, line-height 1.1): Now-playing titles, shelf headings, creator names, and subchapter titles.
- **Body** (400, 1rem, line-height 1.65): First-person story and neutral descriptions, generally held between 50 and 66 characters per line.
- **Label** (700, about 1.05rem, expanded tracking, uppercase): Navigation, stage labels, buttons, CEFR/category metadata, counters, and captions.

**The Three-Voices Rule.** Chivo performs, Commissioner narrates, and Saira Condensed directs. Do not use the condensed label face for paragraphs or the heavy display face for long explanations.

## Layout

The page uses full-bleed color and image fields around a consistent 1200px editorial content stage. `--id-page-pad` controls responsive horizontal breathing room and `--id-section-space` keeps the major story layers visibly separate. Section headings often split into a wide statement and a shorter explanatory column; the text and media themselves must not stretch to the full width of an ultrawide monitor. The hero is the intentional exception: its equally important story and documentary carousel share a wider 1440px stage.

The first viewport is a centered two-column stage, at most 1440px wide: approximately 0.92fr story and 1.08fr real-photo contact sheet over a full-bleed generated blue-hour archipelago. Display type stops at 6rem with a -0.04em tracking floor so the headline remains dramatic without colliding with the carousel. The contact sheet is intentionally a carousel despite its name: only one Christian Bautista photograph is exposed at a time, inside a strong cream frame and red control base. Its stage adopts the active photograph's intrinsic ratio and uses `object-fit: contain`; cropping documentary photographs to force one shared frame is forbidden.

The playlist uses a wide featured 16:9 player beside a vertically scrollable numbered list inside the 1200px stage. Immediately after it, the podcast chapter forms its own night-colored listening stage before the creator library. Its compact horizontal shelf uses square cover-led cards at `clamp(250px, 25vw, 320px)`, one-card snap points, contained inline overscroll, a thin visible scrollbar, and literal previous/next controls. Cards keep only publisher and CEFR, title, format, and a details action beneath the square local cover; descriptions and listening guidance do not expand the shelf.

The creator chapter, story strip, KBRI composition, and closing note also use the 1200px measure so their text and media remain connected on ultrawide displays. The closing note owns a dedicated inner grid: a minimum 390px statement column, a flexible supporting paragraph, and an action that drops to its own row at intermediate widths. The creator chapter places a square-edged CEFR control band before the shelves; it filters cards in place while preserving each category as its own row and hiding only rows with no match. Creator categories each own an independent horizontal shelf with `clamp(280px, 28vw, 330px)` cards, scroll snapping, overscroll containment, and literal previous/next controls. The BIPA announcement and KBRI documentary chapter remain broad but bounded. The final memorial uses the 1200px stage to pair its long-form tribute with one carousel containing the portrait and vertical tribute reel before the dark closing panel.

### Responsive behavior

- **Above 1050px:** Preserve the two-column hero, player/list console, BIPA feature, broad KBRI composition, bounded creator stage, and two-column tribute composition.
- **1050px and below:** The playlist and community stack; the BIPA feature becomes single-column; the tribute carousel and copy stack cleanly; the closing becomes two columns.
- **780px and below:** The hero, story strip, split headings, BIPA feature, podcast modal, creator modal, tribute, and closing become single-column. The hero contact sheet moves below the copy; podcast cards become `min(72vw, 310px)` and shelf headings reorganize without losing arrow controls. The chapter bar remains horizontally scrollable.
- **520px and below:** Actions become full width, playlist thumbnails reduce to 72 × 50px, podcast cards become `min(82vw, 285px)`, creator cards become `min(82vw, 290px)`, BIPA details become one column, media heights tighten, and the tribute becomes one column. Podcast modal links stack full-width, its cover column clears the visible close button, and all tap targets remain at least 44px.

### Dual-navigation offset

The shared global navbar is mandatory and remains above the Indonesian chapter navigation. The page starts with fallback offsets of 72px for the shared navbar and 53px for the chapter bar (50px at the compact breakpoint). `syncNavigationOffsets()` measures both real elements with `ResizeObserver`, writes the actual values to `--id-global-nav-height` and `--id-chapter-nav-height`, offsets the sticky chapter bar beneath the shared header, pads the body, and updates anchor scroll padding. Never replace the global navbar, hard-code a new competing offset, or let the local bar cover it.

The chapter links sit on a centered `max-content` track bounded by the 1200px stage. When that track is wider than the viewport, the night-colored bar becomes the horizontal scroll container with inline overscroll containment, touch momentum, hidden decorative scrollbars, and no page-level overflow. Keyboard focus scrolls the active link to the center with reduced-motion support; every link keeps a minimum 50px height and a visible red active/focus state.

**The One-Frame Narrative Rule.** The hero, KBRI documentary sequence, and Bapak Agus tribute show one photograph or media frame at a time with visible previous/next arrows and a position status. A grid or gesture-only treatment breaks the intended story rhythm.

## Elevation & Depth

The system is flat by default. It creates depth through cinematic image layers, full-bleed tonal shifts, thick borders, bottom or side color bands, dark media wells, and controlled overlaps—not ambient shadows or translucent glass. The selected playlist item uses a single inset red rail; it is a state marker rather than card elevation. Modals separate from the page through an opaque night backdrop and strong color contrast.

**The Stagecraft Rule.** A surface earns hierarchy through scale, crop, color blocking, or a structural edge. Do not add generic soft shadows to every card.

**The No-Glass Rule.** The visual world is printed, staged, and photographic. Avoid blur-backed glass panels, translucent pill clusters, and glossy app-dashboard depth.

## Shapes

The recurring silhouette is square and poster-like: buttons, cards, frames, navigation tabs, media wells, panels, and modals use zero corner radius. Strong 1–8px rules, contact-sheet frames, selected rails, and colored bottom edges create the physical grammar. Creator portraits remain square; video players stay 16:9; vertical Facebook media keeps a phone-like proportion through framing rather than rounded device chrome.

Arrow and close controls are literal square buttons. The visible × belongs in the predictable top-right corner of every overlay. Metadata is plain condensed text, not a collection of pill-shaped tags.

**The Square-Stage Rule.** Begin at zero radius. Do not introduce rounded bento cards, pills, or fake handset shells into this surface.

## Components

### Actions and links

Primary actions are red with cream text; actions on red or night fields may reverse to cream. Outline actions keep their background transparent and use amber for hover/focus emphasis. All action labels use the condensed face, uppercase treatment, a minimum 48px height, and clear external-link marks where relevant.

### Local chapter navigation

The secondary navigation is sticky beneath the shared navbar, dark, horizontally scrollable, and finished with a red bottom edge. Each link is at least 50px high. IntersectionObserver assigns `aria-current="location"`; the current, hovered, or focused destination turns red. The bar must remain usable without hiding the shared navigation.

### Hero contact sheet and documentary carousels

The hero carousel, six-frame KBRI carousel, and two-frame tribute carousel expose one active frame. Previous/next buttons are always visible, status is announced through `aria-live`, hidden slides receive `aria-hidden`, and inactive media triggers—including the tribute iframe—leave the tab order. Left and right arrow keys change frames when the carousel has focus. KBRI and tribute photographs are buttons that open the full-screen lightbox; the embedded tribute reel becomes keyboard-focusable only while its slide is active; the hero contact sheet stays inline.

Real photo sequences use local files with meaningful Bahasa Indonesia alternative text, intrinsic dimensions, lazy loading below the fold, and deliberate `object-fit`/`object-position`. The first hero image remains eager/high-priority.

### Personal playlist/player

Aljohn's work lives in a dedicated featured player and numbered clickable list. `js/data/indonesian-playlist-data.js` is the source of truth; each item carries `id`, local `thumbnail`, `title`, `context`, and first-person `note`. The renderer uses privacy-enhanced YouTube embeds, gives every item an accessible play label, updates the title/note/position and `aria-current`, and falls back to the local creator fallback if a thumbnail fails.

No canonical public playlist URL was verified at ship time, so this module is an intentional list of verified public videos from Aljohn's official channel rather than a generic playlist embed. When updating it, verify public availability and relevance, save each recognizable thumbnail under `images/videos/`, preserve intrinsic dimensions and alternative text, and keep the official channel CTA.

### Podcast shelf and details modal

The dedicated podcast chapter sits between Aljohn's personal playlist and the creator library. It uses a full-width Twilight Sea field with a bounded 1200px stage, a cream square-card shelf, red bottom rails, and amber hover/focus edges. Every compact card leads with a durable local square cover and shows only publisher with CEFR, title, format, and **Lihat detail**; the whole card is a named button that opens the modal instead of navigating directly to a platform.

The shelf is a contained horizontal scroller with snap points, touch/trackpad support, a visible thin scrollbar, and literal previous/next buttons whose disabled state reflects the scroll limits. When the shelf itself has focus, Left/Right moves one card and Home/End moves to the bounds. Announce arrow movement politely without exposing listening counts or private ordering evidence. Smooth shelf movement becomes immediate under `prefers-reduced-motion`.

The details modal owns the long neutral description, listening guidance, optional Aljohn note, and verified external listening links. Its desktop layout pairs a square cover on a Twilight Sea media pane with the cream copy pane; at 780px it stacks to one column, and at 520px external actions become full-width. The note panel is omitted when its dataset field is blank. Keep the visible top-right ×, opaque backdrop, internal vertical scrolling, Escape and intended-backdrop closing, Tab focus trapping, body-scroll lock, and focus restoration to the invoking card. External anchors remain genuine links and must not be intercepted by card or backdrop handlers.

### Creator shelves and modal

`js/data/indonesian-creators-data.json` stores `categories` plus creator records with identity, country, category fields, CEFR range, local image and alt text, neutral descriptions, `personalComment`, listening guidance, sample video, and verified links. `indonesian-creator-renderer.js` renders every complete verified record. A blank `personalComment` remains `null`; the modal simply omits the note panel instead of inventing a relationship or exposing editorial placeholder copy.

The accessible CEFR control defaults to **Semua** and derives only the levels actually represented in the dataset. Its pressed-state buttons filter cards inside their original shelves, hide empty shelves, preserve the untouched editorial order, and announce the active level without publishing counts. Each rendered category owns a separately labeled horizontal shelf with scroll snapping and visible arrow controls. Cards lead with a real local square portrait, category/CEFR metadata, name, and short neutral description. Activation opens the accessible modal instead of navigating directly. The modal keeps the local portrait alone in its visual identity column; the playable sample video or explicit unavailable state belongs in the main details column after the neutral description. A documented Aljohn note follows when present; guidance and keyboard-focusable external links remain available in both modal states.

When updating creators, preserve the existing JSON schema and category IDs, keep every public image local under `images/creators/`, and verify at least one official link and the sample video. Never synthesize Aljohn's note, publish private frequency/evidence metadata, expose dataset statistics, or flatten categories into a mixed grid. A complete verified record may render with `personalComment: null`; the absence of a note is represented by absence of the note panel, not visitor-facing review language.

### Indonesian bookshelf and book modal

The Indonesian bookshelf derives its two records from the canonical `library/js/data/book_data.js` catalogue and uses the canonical covers under `library/images/books/id/`. The language page owns only its Bahasa Indonesia descriptions, CEFR reading guidance, shelf treatment, and native modal. Do not duplicate or relocate the covers, route a card into the general library modal, or add a general-library CTA inside the language-page modal.

The shelf remains horizontal and min-width-safe, with literal previous/next controls, snap points, visible focus, and a compact mobile card. Each card opens the Indonesian modal. The modal has a visible top-right ×, an opaque night backdrop, internal scrolling, Escape and backdrop closing, focus trapping, body-scroll lock, focus restoration, and a verified external source action when available.

### Approved resource and community boundary

Learning resources may appear only when Aljohn supplied or explicitly approved them. The shipped exception is the BIPA 2026 community feature: it uses Aljohn's supplied Facebook reel, the approved Atdikbud Manila page for future announcements, explicit dates and an ended-registration state. Preserve the exact supplied destinations and update time-sensitive status copy when a new approved wave is supplied.

KBRI Manila is presented as a documented cultural-community chapter with local event photographs, a canonical internal center profile, and its official site—not as a generic learning-resource card. The 2025 singing-contest result is a compact milestone within this same chapter, and its three supplied photographs join the three existing KBRI photographs in one six-frame carousel; it must not return as a separate feature. Unused legacy selectors in the stylesheet do not authorize shipping dormant modules or unapproved recommendations.

### KBRI and Bapak Agus ending

The final narrative movement must remain human and evidence-led: BIPA and KBRI show how the language became a Manila community, then the Bapak Agus Widjojo chapter narrows into remembrance and a first-person commitment to the Indonesia–Philippines bridge. Preserve the verified local portrait and supplied tribute reel together in their single two-frame carousel, along with the neutral historical context, source action, and distinct closing note. Do not turn this ending into a generic institution directory or replace its documentary media with illustration.

### Modal and lightbox behavior

Both overlays have a visible top-right ×, close on the intended backdrop and Escape, trap Tab focus, lock body scrolling, scroll internally when content is long, and restore focus to the invoking card or photograph. The lightbox contains documentary media without cropping. External modal actions must remain real anchors that are not intercepted by backdrop/card handlers.

### Accessibility and motion

The page uses `lang="id"`, a skip link, named landmarks, contextual `aria-label`s, live position text, meaningful alternative text, and a global 3px Island Turquoise focus outline with a 4px offset. Interactive controls remain at least 44px; primary actions remain 48px. Error rendering uses `role="alert"`.

Reduced-motion mode disables smooth document scrolling, carousel fades, and image scaling. Creator-shelf arrow scrolling changes from smooth to immediate when the media query matches. State and meaning must never depend on animation.

## Do's and Don'ts

### Do:

- **Do** keep Panggung Kepulauan recognizably Indonesian–Filipino: twilight sea, red-white signals, bamboo warmth, music, and real community evidence.
- **Do** use the generated archipelago and Cenderawasih rasters only as clearly illustrative atmosphere and pacing.
- **Do** preserve local, verified documentary photography for every real person, creator, event, institution, and collaboration.
- **Do** keep every photo narrative one image at a time with literal arrows, position status, keyboard support, and the existing lightbox path where supplied.
- **Do** maintain the personal playlist as a real featured player with local thumbnail previews and data-driven notes.
- **Do** keep the compact podcast shelf between the personal playlist and creator library, with local square covers, literal arrows, contained scrolling, and long copy reserved for its accessible modal.
- **Do** keep creator categories as independent shelves and neutral creator copy visibly separate from Aljohn's documented note.
- **Do** preserve the measured two-navbar offsets, 44px controls, visible focus, reduced-motion behavior, focus trapping, and focus restoration.
- **Do** treat **RECAPTURE** as an open finish gate until the unavailable in-app browser review is completed at desktop, laptop, and mobile widths.

### Don't:

- **Don't** copy Wonderland branding, characters, motifs, or composition; the inspiration is cinematic depth, not imitation.
- **Don't** treat generated scenery as documentary evidence or generate real people, events, venues, logos, or relationships.
- **Don't** expose all photographs as a collage or grid merely because the hero component is called a contact sheet.
- **Don't** publish a learning tool, media recommendation, or resource card without Aljohn's explicit approval; dormant CSS is not content approval.
- **Don't** add a generic YouTube playlist embed, remote thumbnail hotlinks, incomplete creator cards, public ranking metadata, or visitor-facing catalogue statistics.
- **Don't** expand podcast cards into long-description panels, bury podcasts in the creator grid, or let external platform links replace the details modal.
- **Don't** flatten creator shelves, hide the visible ×, weaken external modal actions, or let either navigation layer cover the other.
- **Don't** introduce rounded bento cards, pills, glassmorphism, or generic soft shadows that dilute the stage-and-poster grammar.
