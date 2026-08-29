---
version: 1
slug: "languages-russian-index-html"
primary_target: "languages/russian/index.html"
related_targets: ["languages/russian/css/page-language-russian.css","languages/russian/js/data/russian-playlist-data.js","languages/russian/js/data/russian-openrussian-data.js","languages/russian/js/data/russian-books-data.js","languages/russian/js/renderers/russian-playlist-renderer.js","languages/russian/js/renderers/russian-openrussian-renderer.js","languages/russian/js/renderers/russian-books-renderer.js","languages/russian/js/renderers/russian-creator-renderer.js","languages/russian/js/russian-modal-controller.js","languages/russian/js/russian-entry.js","library/js/data/book_data.js"]
---

# Russian language page surface brief

## Scope and mode

- Primary target: `languages/russian/index.html`
- Visitor mode: Experience with a reading-led learning path.
- Audience: Russian learners and viewers following Aljohn Polyglot’s real language journey.
- Job: understand why Russian matters to Aljohn, watch his Russian videos, follow an evidence-grounded practice route, then discover relevant Russian-language creators.
- Primary action: play Aljohn’s Belarusian conversation; secondary actions are choosing another verified playlist entry and opening creator details.

## Proof and constraints

- Evidence: 15 reviewed long-form channel videos, using Aljohn’s manually uploaded English SRT cache when present; three supplied Facebook immersion reels; the current description and 16:03 NBA segment of Aljohn’s routine video `ht9q5ENjlV4`; official Russian playlist `PLHC88jnBSUqI0F5kPFzexi_H0Ah4p7b1x`; local verified creator portraits and dataset; Aljohn-supplied OpenRussian resource; canonical shared-library Russian book records and covers.
- The Belarusian conversation is the initial featured video. The public playlist UI contains five verified, playable Russian-relevant entries; it omits one private item and four unrelated Tagalog shorts from the official YouTube playlist.
- Copy is Russian-first. Aljohn remains separate from the curated creator library.
- Preserve the global shared navbar and add a secondary Russian chapter bar with a real sticky offset.
- No political symbols, leaders, soldiers, military imagery, state slogans, flags, ideological claims, or fabricated documentary scenes.

## Approved direction

- World: an archival constructivist print workshop used as editorial grammar, not political messaging.
- Approved comp: `.impeccable/mocks/russian-archive-comp-03-approved.png` (user-approved).
- Memorable moment: a diagonal monumental `РУССКИЙ` statement hands directly into a 60/40 video-and-playlist worktable, with the Belarusian conversation already selected.
- Visitor path: compact opening statement with the player entering the first viewport → personal player/playlist → three-stage learning route and full story → OpenRussian word and grammar workbench → daily immersion → Russian bookshelf → independent thematic creator shelves → closing first-person note.

## Comp implementation inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Shared global navbar | Existing project navbar remains visible and usable | Shared loader/component |
| Russian chapter bar | Compact Russian destinations, horizontally scrollable on small screens | Semantic HTML + CSS |
| Diagonal `РУССКИЙ` field | Giant wide Cyrillic type, red ink, diagonal rule, registry marks | Semantic HTML + CSS geometry |
| First-person opening | Russian copy at 28–38ch with direct playlist action | Semantic HTML |
| Featured Belarusian video | Dominant 16:9 playable embed with honest title | YouTube iframe |
| Five-entry playlist ledger | Numbered buttons, active state, local thumbnails, player update | Local sourced rasters + semantic buttons + JS |
| `Мой путь` sequence | Three necessary stages: foundation, immersion, conversation | Semantic HTML + CSS |
| Story evidence note | Films, Peppa Pig flashcards, Discord, sport and skating | Semantic HTML |
| OpenRussian workbench | Instant Cyrillic typeahead, direct lookup, contained on-screen keyboard, and official resource routes | Local mascot + semantic combobox/form/buttons + JS |
| Immersion reel strip | Three supplied Facebook reels, one at a time with snap scrolling and visible controls | Facebook embeds + semantic controls + JS |
| Russian bookshelf | Canonical shared titles in a contained shelf with Russian reading guidance and an accessible native modal | Shared local covers + semantic buttons + JS |
| Creator shelves | Independent language, culture, sport, and food rows; Russian with Max and Russian Progress lead the language row | Local verified portraits + semantic buttons + JS |
| Creator modal | Profile, separate personal note, CEFR, embedded sample, external links | Native dialog-like overlay + iframe + JS |
| Print material | Paper field, halftone dots, registration lines and ink misalignment; no illustrative raster | CSS-native surface geometry; paper grain accepted as code-native ornament per project asset rule |

## Sampled comp palette and component grammar

- Paper field: `#e6d8be`
- Ink field: `#000002`
- Oxidized red: `#932317`
- Dusty teal: `#124249`
- Mustard registration accent: `#dab680`
- Geometry: square frames, 1–2px ink rules, no pills, restrained depth, numbered ledgers and diagonal bands.
- Type: wide geometric Cyrillic display (Unbounded family), readable Russian body (PT Sans family), tabular numerals in playlist ledgers.
- Motion: one print-registration reveal in the opening; state changes otherwise immediate and reduced-motion safe.

## Approved-comp translation notes

- Do not literalize the generated abstract thumbnail art or any generated person; ship only real YouTube thumbnails and verified local creator portraits.
- Do not copy invented playlist titles from the comp; use the five verified, playable Russian-relevant videos.
- Preserve the composition and hierarchy while expanding the remainder of the page into the same editorial system.

## Unresolved decisions

- None blocking. Future Russian resources or community modules can join only when real evidence and local media are available.
