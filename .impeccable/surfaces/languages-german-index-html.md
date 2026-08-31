---
version: 1
slug: "languages-german-index-html"
primary_target: "languages/german/index.html"
related_targets: ["languages/german/css/page-language-german.css","languages/german/js/german-page.js","languages/german/js/renderers/german-playlists-renderer.js","languages/german/js/renderers/german-creators-renderer.js","languages/german/js/renderers/german-books-renderer.js","languages/german/js/data/german-playlist-data.js","languages/german/js/data/german-extra-data.js","languages/german/js/data/german-creators-data.json","languages/german/js/data/german-learning-resources-data.js","languages/german/js/data/german-books-data.js"]
---

# German language portal — Trikot-Schneise

## Scope and mode

- Primary target: `languages/german/index.html`
- Visitor mode: Read, watch, and browse an evidence-led language portal.
- Audience: German learners and viewers following Aljohn Polyglot's personal language journey.
- Job: understand where German entered Aljohn's real life, watch his one verified German episode, choose a learning route, then discover books and German-language creators.
- Primary action: play Aljohn's German video. Secondary actions: open the official playlist, start a learning resource, filter creator shelves by CEFR, and open creator or book details.

## Proof and constraints

- Evidence: the complete one-video official playlist `PLHC88jnBSUqIHoAHrUt_vBVPHDtM_x604`; 15 reviewed long-form channel videos using Aljohn's manually uploaded English SRT cache; the user-supplied 13-episode `Extr@ auf Deutsch` playlist `PLtLp08LfvxttE4NbSXMYf9zl328IQ4FAP`; current local creator dataset and portraits; the verified Language Transfer German set; Linguno German; canonical German book records and covers; the highest-resolution matching official profile images for Goethe-Institut Philippinen and Germany in the Philippines.
- German-first visitor copy. Aljohn's own video remains separate from the curated creator library.
- Preserve the shared global navbar and add a centered sticky German chapter bar with a compact horizontal scroller on narrow screens.
- Keep the familiar language-portal information architecture selected by the user. The 1990 Germany jersey is the page-wide visual system, not a sports shop, equipment wall, team dashboard, or generic flag skin.
- No German podcast surface in this pass. Do not invent Goethe studies, attendance, proficiency, personal creator notes, or other private-source provenance.
- All durable images are local. Creator shelves keep their independent category rows and expose a visible all-levels-default CEFR filter. Creator and book modals are keyboard-operable, closable by button/backdrop/Escape, focus-trapped, and restore focus.

## Approved direction

- World: optic-white football-jersey mesh cut by literal black, red, and trophy-gold V chevrons, translated into seams, rails, filters, player framing, modal headers, and the final note.
- Approved comp: `.impeccable/mocks/german-familiar-portal-selected.webp` (user-approved in chat; based on `.impeccable/mocks/decision/german-canon.webp`).
- Sampled palette: nav field `#0a0b0e`, display ink `#07080b`, optic white `#f8f8f8`, signal red `#b40a0d`, trophy gold `#eaae0a`, card rule `#dddddd`.
- Type: self-hosted condensed athletic display voice with a readable German sans body; tabular numerals for durations and CEFR. No platform display fallback as the intended face.
- Motion: one stitched-chevron reveal in the opening; shelf and modal states remain immediate and reduced-motion safe.

## Visitor path

Shared navigation and centered German chapters → split story/player hero with the full-scale jersey V between them → compact learning-route strip → Language Transfer and Linguno practice → separate 13-episode `Extr@ auf Deutsch` player → native German bookshelf → independent creator shelves with CEFR filtering → standalone Goethe-Institut and German Embassy module → closing first-person note.

## Comp implementation inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Shared global navbar/footer | Existing project components stay visible and usable | Shared loaders |
| German chapter bar | Centered destinations and active state; narrow horizontal scroller | Semantic HTML + CSS + small JS |
| White jersey field | Subtle, seamless knitted performance fabric | New local sourced/generated raster with embedded provenance |
| Black/red/gold V | Literal layered 1990-shirt geometry repeated as seams and rails | CSS geometry / authored SVG only where useful |
| Story opening | Evidence-grounded first person, 28–38ch | Semantic HTML |
| Featured video | Real local thumbnail, playable YouTube embed, exact official title and playlist link | Local sourced raster + iframe |
| Learning route | Complete German, Linguno, Extr@, books, voices | Semantic links/cards using existing data |
| Practice modules | SoundCloud Complete German set and Linguno routes; German Linguno mascot matches the established French/Brazilian mascot family and wears the page's literal jersey V | SoundCloud iframe + semantic links + local ImageGen raster with provenance |
| Extr@ playlist | Thirteen verified episodes, one player, clickable list and local episode thumbnails | Local sourced rasters + YouTube iframe + semantic buttons + JS |
| German bookshelf | Canonical catalogue records resolved into a contained shelf | Shared local covers + semantic buttons + JS |
| Creator shelves | Repeated category heading and contained horizontal row; optional personal note omitted when null | Existing local portraits + JSON + semantic buttons + JS |
| CEFR filter | All levels selected by default; exact metadata only | Native select/buttons + JS |
| Creator modal | Neutral description, CEFR/listening guidance, embedded sample, verified links | Native overlay/dialog pattern + iframe + JS |
| Institutions | Goethe-Institut Philippinen leads a separate bottom horizontal shelf beside Germany in the Philippines; both use their contained official profile marks and open the accessible details modal | Highest matching official 400px/700px local profile rasters + semantic buttons + JSON + JS |
| Closing note | First-person return to conversation and correction | Semantic HTML + CSS chevron seam |

## Approved-comp translation notes

- Preserve the selected composition, scale, hierarchy, and familiar portal behavior.
- Use the exact verified video title and honest evidence-led story copy, not generated comp copy.
- Replace the comp's podcast route with the user-supplied `Extr@ auf Deutsch` playlist because German intentionally has no podcast UI.
- Use the existing real local video thumbnail; do not ship any generated person or invented German football identity.

## Unresolved decisions

- None blocking. Further German community or place modules can join only when documented evidence and durable local media exist.
