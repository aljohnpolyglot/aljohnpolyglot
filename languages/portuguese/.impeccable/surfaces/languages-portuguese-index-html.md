---
version: 1
slug: "languages-portuguese-index-html"
primary_target: "languages/portuguese/index.html"
related_targets: ["languages/portuguese/css/page-language-portuguese.css","languages/portuguese/js/portuguese-page.js"]
---

Mode: Read and Experience.

Audience: Portuguese learners and visitors following Aljohn Polyglot's language journey across Brazil, Angola, Portugal, and the Philippines.

Job: Understand that Aljohn's Portuguese became real through people and events, then choose a concrete next action: watch his own conversations, discover independent voices by theme and CEFR range, practise sustained listening, train, read, or meet a community.

Proof: Verified local event photographs featuring Aljohn and people he met; local playlist thumbnails and playable videos; verified creator portraits and samples; local podcast covers; canonical book records; Filipinhos identity; and Calvin Castiel's verified portrait, channel, and collaboration video.

Constraints: Preserve the shared global navbar plus a centered secondary navigation. Keep Aljohn's personal playlist separate from the curated creator library. Hero imagery is event photography only, never a YouTube thumbnail. Keep independent labeled creator shelves with visible previous/next controls and owned horizontal scroll, visible default-all CEFR and country/variety filters, visible country flags on creator records, a separate Criancas e animacao shelf, a standalone Filipinhos section, accessible detail modals, local durable assets, and native Portuguese copy. The page and every rail must avoid document-level horizontal overflow.

Approved comp: `.impeccable/mocks/portuguese-revista-de-jogo-cover-story-approved.png` (Option A, approved 2026-08-30). Its composition is the implementation contract, not a loose mood board.

Direction: Revista de Jogo — a contemporary Brazilian sports-weekly cover fused with intimate Filipino-Brazilian documentary photojournalism. Deep green supplies the field of ink, yellow carries decisions and headlines, cobalt blue acts as the precise editorial accent, and warm paper sections create reading rhythm. It must feel authored and print-led, never like a football dashboard or a recolored generic language template.

Composition contract: The first viewport is a cover-story split. The shared white navbar remains fully visible; the slim yellow chapter navigation is the second visible layer. Below them, the left editorial panel carries the first-person headline, concise story, and two actions. The right side is dominated by the verified Calvin event group photograph, cropped to keep the people visible rather than the ceiling lights. A smaller verified event photograph overlaps the fold without obscuring faces. The cover flows directly into the story spread without an extra contents strip. This silhouette, balance, image hierarchy, and fold are binding across desktop adaptation; mobile reflows them into an intentional cover sequence rather than shrinking the desktop collage.

Component and asset inventory:

| Element | Source | Implementation decision |
| --- | --- | --- |
| Shared navbar | `../../js/navbar-loader.js`, shared navbar CSS | Reuse unchanged; measure its real height for the sticky local bar. |
| Chapter navigation | Portuguese page-owned HTML/CSS | Centered yellow single row on desktop; contained horizontal scroller on narrow screens. |
| Primary hero photograph | `images/community/calvin-castiel-with-aljohn.jpg` | Fill the right cover panel with a careful documentary crop; preserve faces; explicit dimensions and object positioning. |
| Secondary hero photograph | — | No secondary hero inset; the cover is led by one documentary event photograph. |
| Supporting event photographs | `images/community/angolan-event-interview-blue-suit.jpg`, `images/community/angolan-event-group-portrait.jpg`, `images/community/angolan-portuguese-interview.jpg` | Use in one square-frame, native-ratio-preserving carousel with swipe, keyboard, previous/next controls, and current-slide status; never use as YouTube substitutes. |
| Personal playlist | `js/data/portuguese-playlist-data.js`, `images/playlist/` | One featured 16:9 player plus a compact thumbnail rail with fixed aspect ratios. |
| Creator library | `js/data/brasil-creators-data.json`, `images/creators/` | Each labeled shelf is a min-width-safe contained section with previous/next controls, touch/trackpad scrolling, snap points, and a visible themed scrollbar. The same square-edged authored scrollbar system applies to playlist, podcast, and book rails so Windows-native arrows never leak into the visual world. Cards and modal metadata distinguish Brazil, Portugal, and Cabo Verde with FlagCDN raster flags because emoji flags are not reliable on the target web surface; CEFR and country filters combine without flattening shelves. All twenty-nine former 150×150 portraits now have verified replacements at least 600px on the shorter edge, including W. Luiz's 650×809 official-site portrait. |
| Podcasts | `js/data/portuguese-podcasts-data.js`, `images/podcasts/` | Compact cover-led shelf; details stay in the modal. |
| Books/resources/community | Existing dedicated data and verified local assets | Render as editorial modules with varied composition, not one generic card system. Filipinhos owns a compact contained Brazil–Philippines editorial spread with its 1024px local identity asset instead of appearing as a small note under Calvin. |
| Linguno practice mascot | `images/apps/linguno-brazil-jersey.png` | Let the transparent Linguno penguin in Brazil’s canary-yellow and green football shirt carry the practice section; the heading states the short-session benefit directly, with no extra pill controls or decorative number competing with it. |

Memorable moment: The real nighttime event portrait fills the right half of the opening cover while the line “Meu portugues aconteceu entre pessoas” turns the page from a football theme into a human story.

Validation: Capture the rebuilt surface from the document top at desktop and mobile widths. Confirm both nav layers, event-photo crops, playlist thumbnail ratios, portrait sharpness, modal focus/escape/restore behavior, combined CEFR/country filtering, visible country flags, contained shelves, and zero document-level horizontal overflow. Run the detector only after the first capture pair, batch fixes once, recapture once if required, then obtain an independent finish-review disposition before documenting the shipped system.
