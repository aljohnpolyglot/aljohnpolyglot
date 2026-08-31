# Italian language surface

## Premise

The Italian page is Aljohn's personal Renaissance studiolo: a warm, collected room for story, moving image, voices, and real community encounters. It should feel editorial and lived-in, not like a generic course directory or a French page recolored in Italian tones.

## Typography

- `Italiana`: display titles, creator names, and chapter headings.
- `Alegreya Sans`: body copy, controls, navigation, and explanatory text.
- `Alegreya Sans SC`: folios, eyebrow labels, CEFR marks, and small archival annotations.
- Keep body lines readable and generous. Small-cap labels may be compact; narrative text may not.

## Palette and materials

- Parchment: `#f3e7c8`
- Deep fresco teal: `#173f4b`
- Oxblood: `#7e2831`
- Antique gold: `#ad8338`
- Use thin gold rules, inset frames, faint diagram lines, paper grain, and restrained shadows.
- Prefer square or lightly framed geometry over rounded product-card styling.
- Real photographs document people, institutions, and events. Decorative geometry may support them but must not pretend to be documentary evidence.

## Page composition

1. Shared global navbar, followed by the sticky local studiolo index.
2. First-person story hero with one visible photograph in a compact carousel.
3. Aljohn's featured YouTube player with a clickable playlist beside it.
4. A short listening/learning bridge.
5. An independent horizontal podcast folio for native listening, kept separate from creator cards and ordered through private listening evidence without exposing that signal.
6. Seven independent creator-library shelves.
7. A distinct RaiPlay media panel.
8. Separate Tropamici, Philippine Italian Association, and Dante Manila chapters.
9. A horizontally browsable restaurant folio drawn from the places in Aljohn's videos, with an accessible details sheet for address, contact, and episode links.
10. A quiet closing invitation.

## Components and interactions

- The hero carousel shows one image at a time. It supports visible previous/next controls, status text, keyboard arrows, Home/End, swipe, meaningful alt text, and `aria-hidden` on inactive slides.
- Creator categories are independent horizontal rails. Cards use real local portraits or channel marks, a category, name, concrete neutral description, and CEFR range.
- The creator library has two explicit filter axes: thematic category and CEFR level. Both default to the complete library, expose `aria-pressed`, preserve the independent shelf structure, and hide only shelves with no matching cards.
- The podcast folio uses local square cover art, literal previous/next buttons, touch and trackpad scrolling, keyboard arrow/Home/End support, native Italian descriptions, CEFR guidance, and verified Pocket Casts or official listening actions.
- The curated data modules are the publication set. A blank `personalComment` never hides a creator or personality; only the separate Aljohn-note panel is omitted from the dialog.
- Artists, athletes, performers, presenters, and other public personalities receive the same substantial native-language biography, local portrait, official links, listening guidance, and representative sample treatment as channels.
- Rails scroll by touch/trackpad and visible arrow controls. Use scroll snapping and overscroll containment; never let a rail increase document width.
- Creator cards open a dialog rather than navigating immediately. The dialog contains a neutral description, Aljohn's separate personal note, CEFR guidance, sample video, and external links.
- Every dialog and lightbox has a visible `×`, Escape support, focus containment, focus restoration, and internal scrolling without horizontal overflow.
- The featured player/list is Aljohn's own layer. Aljohn never appears as a curated creator card.
- Community photographs live in their subject's own slideshow; do not flatten Tropamici, PIA, and Dante into one anonymous gallery.
- Restaurant cards keep the studiolo's framed-photo and parchment grammar and appear as the final substantive chapter before the closing invitation. Their shared interaction layer may match other language pages semantically, but the visible surface stays Italian.

## Responsive contract

- Preserve the global and local navigation layers at every width; offset sticky elements by the real shared-header height. Center the local studiolo index on desktop and keep its full track reachable through contained horizontal scrolling on narrow screens.
- Collapse the hero and community chapters to one column before either side becomes cramped.
- Use `min-width: 0` on grid/flex children and contained horizontal scrolling for shelves.
- Modals become a single internal scroll column on narrower viewports.
- Verify desktop, the 1320px reference viewport, and 390px mobile with zero page-level horizontal overflow.

## Content and asset rules

- Curation data belongs in dedicated JavaScript data files; rendering and page logic stay separated.
- Creator images are local project assets. Do not ship expiring URLs or private activity/Instagram exports.
- Use viewing history privately to support selection and order, while the public interface remains thematic and human-edited.
- Personal claims require Aljohn's own videos, native English subtitle tracks, supplied posts, or other documented evidence.
