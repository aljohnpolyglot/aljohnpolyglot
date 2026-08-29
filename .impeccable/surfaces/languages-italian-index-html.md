# Surface brief: `languages/italian/index.html`

## Route and purpose

- Route: `/languages/italian/index.html`
- Purpose: present Aljohn's Italian-learning story, his own videos, a deep personally curated creator library, Italian media, and the Philippine communities that made the language social.
- Primary visitor paths: watch Aljohn's story, browse a thematic creator shelf, open a creator fiche, explore RaiPlay, or continue to Tropamici/PIA/Dante.

## Experience premise

The page is a Renaissance studiolo rather than a catalogue: parchment, fresco teal, oxblood, antique gold, fine archival rules, and real framed photography. It must remain recognizably Italian and must not imitate the French stitched atlas.

## Content order

1. Shared global navigation.
2. Local studiolo navigation.
3. Story-led hero and three-photo carousel.
4. Featured Aljohn player plus clickable playlist.
5. Short listening/learning bridge.
6. Seven category-led creator shelves.
7. RaiPlay media chapter.
8. Dedicated Tropamici, PIA, and Dante Manila chapters with separate media narratives.
9. Closing call to continue Aljohn's Italian story.

## Component contract

- Hero carousel: one active slide, previous/next buttons, live position, keyboard arrows/Home/End, swipe, inactive-slide hiding, no collage compression.
- Personal player: real selected video, clickable list, dedicated data source, no private/unavailable entries.
- Creator shelves: one horizontal rail per category, visible scroll controls, touch/trackpad scrolling, snap points, no page overflow.
- Creator card: local portrait/mark, category, name, short description, CEFR range, modal trigger.
- Creator modal: visible `×`, neutral description, separate editable Aljohn note, CEFR guidance, sample video, external links, Escape/focus trap/focus restoration.
- Community galleries and lightboxes: dedicated per institution/group, visible controls and `×`, meaningful captions.
- PIA and Dante links use canonical `languagecenters.html#institute-*` deep links so the destination modal opens.

## Responsive and navigation behavior

- Keep the shared navbar even when the local studiolo bar is present.
- Offset the sticky local bar beneath the actual shared-header height.
- Move hero, player, modal, and community chapters to one column before copy or imagery becomes cramped.
- Every flex/grid child that can shrink uses `min-width: 0`.
- Horizontal movement belongs inside rails only; document and body overflow must remain zero at 1440px, 1320px, and 390px.

## Asset and privacy rules

- Real people, channels, groups, institutions, and events use authentic local assets.
- Creator/data exports and viewing-frequency signals are private evidence only. Never ship raw JSON, counts, signed URLs, deleted/private entries, or unrelated activity.
- Aljohn's own videos stay in the personal player and never become curated creator cards.
- First-person story changes require Aljohn's own sources; prefer his uploaded native English subtitle/SRT tracks over automatic transcription.

## Review checklist

- Global and local navs are both visible and usable.
- Hero shows one undistorted photograph and the carousel advances by controls, keyboard, and swipe.
- All seven shelves scroll internally and have visible controls.
- Cards and modal content use local creator assets; no Aljohn creator card exists.
- Modal and every image enlargement have a visible `×` and keyboard-safe focus behavior.
- RaiPlay, Tropamici, PIA, and Dante remain dedicated chapters.
- No visitor-facing implementation meta-copy appears.
- Desktop and mobile audits report zero page overflow, failed images, and uncaught JavaScript errors.
