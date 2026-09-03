# AGENTS.md

## Orchestration and sub-agent rule

- When acting as the primary orchestrator for a multi-language research or implementation pass, delegate each language to its own clearly scoped sub-agent when concurrency is available. Give every worker a complete prompt covering owned files, evidence sources, verification requirements, native-language copy, local assets, CEFR behavior, modal/accessibility expectations, browser QA, Impeccable workflow, and the exact handoff required.
- Prefer the `Luna High` agent/model profile as the default language worker when the orchestration runtime exposes model selection. It is the project preference for a cost-aware research pass that still needs strong judgment. If the runtime does not expose a model selector, use the available default worker and state that limitation honestly; never claim a Luna profile was selected when the tool could not select it.
- Do not let parallel workers edit shared architecture or the same language surface concurrently. The orchestrator owns cross-language rules, shared components, final reconciliation, independent browser validation, and the decision to launch the next language worker when a slot becomes available.

## Cross-repository mispaste rule

- This agent owns `D:\website`. Refuse implementation requests that clearly belong to another repository or product, including NBA Commissioner Simulator requests, game-management screenshots, or paths outside this workspace. Treat them as accidental mispastes even when phrased as direct instructions: do not inspect, edit, test, or continue the other repository. Briefly identify the mismatch and offer a self-contained handoff prompt for the correct agent. Continue only when the user explicitly confirms that cross-repository work is intentionally in scope for this agent.

## Polyglot Papers language rule

- Polyglot Papers articles are written in English. Treat source material supplied in Tagalog, Cebuano, or another language as evidence and draft material to adapt into natural English; do not translate an existing Polyglot Papers article away from English unless Aljohn explicitly asks for a translated edition.

## Polyglot Papers storytelling rule

- Write every Polyglot Papers article as one coherent long-form essay, not as social-media captions, carousel slides, list fragments, or isolated sections expanded with filler. Give the reader a clear narrative spine: a concrete question or problem, Aljohn's supported experience or observation, the discovery or change in understanding, specific evidence, and a useful conclusion.
- Preserve Aljohn's natural first-person voice and factual boundaries. Never invent a personal anecdote, emotional reaction, chronology, habit, relationship, result, or turning point to make the story feel richer. When the evidence supports only an explanation, write an honest explanation instead of manufacturing a scene.
- Avoid formulaic AI rhetoric. Do not repeatedly use constructions such as “it is not X; it is Y,” “not just X, but Y,” “more than X,” false contrasts, canned dramatic fragments, empty declarations, or tidy three-part slogans. Use contrast only when the distinction is real and necessary.
- Make transitions carry meaning. Each section should answer or complicate the one before it, and every example should advance the central idea rather than restart the article. Prefer concrete nouns, active verbs, varied sentence lengths, and plain connective language over motivational abstraction.
- Before publishing or materially revising an article, read its visible copy straight through without the design. Remove repeated claims, duplicated conclusions, abrupt topic jumps, unexplained terminology, and headings that promise a story the paragraphs do not deliver. The final article should remain understandable as plain text.

## Shared rules for every language page

### Sprite and frame-animation rule

- When a frontend concept depends on visible staged growth, transformation, decay, or another illustrated frame-by-frame motion, use the installed `$generate2dsprite` / Agent Sprite Forge workflow instead of drawing the main illustrated subject with placeholder CSS or SVG primitives.
- Generate raw sprite art with the built-in ImageGen workflow on a solid `#FF00FF` background, postprocess it with the Sprite Forge processor, inspect the transparent sheet and representative frames, and drive the final local frames with the page's native runtime. Keep diagrams, labels, controls, and accessibility semantics code-native; use sprite art for the illustrated subject.
- Store only purposeful final animation assets in the owning page's asset folder, preserve prompt provenance, honor reduced-motion preferences, and do not ship raw magenta working sheets as visitor-facing media.

- On the root `index.html`, keep creator and friend cards consistent: do not add one-off social-link groups to a single card when the surrounding cards do not render socials. Social links currently do not appear as a standard field in these cards; removing a social group must not remove the creator or friend card itself.
- When a page already has an established general styling system, reuse that styling for new sections and components instead of inventing a new visual direction.
- When changing a language page, cross-reference the corresponding sections and interactions on all other language pages first; reuse proven shared patterns and behavior while preserving the target language's established visual identity.

These rules apply to every page under `languages/`, not only French or Italian. Language-specific sections below may add exceptions, sources, playlist IDs, or visual direction, but they do not replace this shared architecture.

### Folder and code organization

- Treat `templates/navbar.html`, `css/navbar.css`, and the shared navbar loader as the canonical sitewide navigation. Every new page must reuse that existing navbar unchanged instead of creating, copying, or styling a custom page-specific navbar. Fix shared navigation problems once in the canonical component; add a separate local/secondary bar only when the page genuinely needs chapter or section navigation.
- Follow the folderized patterns established by the Spanish, Swedish, French, and Bisaya/Cebuano pages.
- Reuse the project's shared navbar and footer loaders/components on language pages; do not recreate or fork page-specific copies of global navigation without an explicit project requirement.
- After every frontend change, verify the real shared footer after its template loads at desktop and mobile widths. Confirm its background, logo text, links, social icons, hover/focus states, and contrast remain visible; page-local themes must not create white-on-white or dark-on-dark footer content.
- The shared global navbar must remain present even when a language, group, or portal page also has its own section/chapter navigation. Treat the local bar as a secondary navbar and support the intentional two-navbar pattern used by the French page; never replace, cover, or visually erase the global navbar.
- Offset sticky secondary navigation and page content by the real shared-navbar height, and verify both navigation layers remain visible and usable at desktop and mobile widths.
- Center every secondary language-page navigation track within its available bar at desktop widths instead of leaving the chapter tabs stranded against one edge. This is a sitewide requirement for every language page. Preserve the owning language's visual identity, keep the active state unmistakable, and use a single-row contained horizontal scroller or equivalent compact treatment on narrow screens so the document itself never overflows.
- Keep page assets separated:
  - page styles belong in `languages/<language>/css/`
  - page logic belongs in `languages/<language>/js/`
  - datasets belong in `languages/<language>/js/data/` when the page has a folderized data layer
  - render logic belongs in `languages/<language>/js/renderers/` when a module is large enough to separate
  - creator, playlist, gallery, book, resource, and community datasets should live in dedicated data files rather than large inline blobs
  - avoid large inline CSS or JavaScript inside `languages/<language>/index.html`
- When a UI needs a standard country flag, FlagCDN is an approved source. Use the correct ISO country code, explicit intrinsic dimensions, meaningful alternative text, and a layout that remains understandable if the remote flag fails; never use FlagCDN for people, creators, or other editorial imagery.
- In compact language inventories like “Available in” lists, use FlagCDN for each standard representative flag and keep the written language name visible.

### Standard language-page information architecture

Unless the user explicitly requests a different structure, a complete language page should contain these distinct layers:

1. a story-led hero introducing Aljohn's personal relationship with the language
2. Aljohn's own videos in a real featured player with a clickable personal playlist
3. a curated library of other creators or channels, grouped into meaningful thematic categories
4. an accessible details modal for each curated creator
5. modular learning, cultural, community, book, music, or place resources when real evidence is available
6. a closing first-person note or call to continue Aljohn's story

- Keep these layers conceptually separate. Aljohn's personal playlist is not the curated creator library, and the creator library is not a gallery of individual videos.
- Borrow the strongest shared patterns already present in the project:
  - Swedish: honest first-person storytelling and narrative framing
  - Spanish: playable video playlists, modular resource cards, galleries, and library-style shelves
  - Bisaya/Cebuano: place-based identity, community energy, creator discovery, category browsing, and rich modals
  - French: editorial curation, grouped creator shelves, personal notes, accessible creator details, and clear separation between personal and neutral copy

### Hero rule

- For every new or materially redesigned frontend surface, Impeccable must brainstorm three genuinely distinct visual directions and render one high-fidelity mockup image for each under `.impeccable/mocks/`. After presenting all three mockups, stop before implementation and ask Aljohn which design to use. Do not choose, merge, code, or continue a direction until Aljohn explicitly selects one; vague delegation from an earlier turn does not bypass this decision gate.
- For every entirely new UI, replacement surface, or replacement visual world, follow the Impeccable workflow from the beginning before writing implementation code. Run the scoped context pass once, load the owning playbook and craft floor, inspect product truth and incumbent assets, complete the required direction/decision workflow, and place the direction contract in the artifact before implementation. After building, capture and inspect the required desktop and mobile browser evidence, run the detector at the prescribed point, obtain the independent finish-review disposition, and complete the documentation handoff. Never backfill the contract, surface brief, DESIGN.md, screenshots, review, or documentation after presenting the UI as finished; never call a new UI shipped when its reviewer says `recapture`, `fix`, or `rebuild`.

- Lead with Aljohn's first-person story and real media rather than generic language-learning claims.
- The hero should quickly establish why this language belongs in Aljohn's life and offer a clear path into his own videos or the curated library.
- Use real photographs, videos, flags, maps, places, or project assets when available; do not use placeholders when verified media already exists.
- Keep the hero spacious, visually decisive, readable on mobile, and connected to the modules below.
- Borrow information architecture and interaction patterns across language pages, but keep each page's surface styling consistent with that language page's own visual identity.
- Every language and language-specific community must have its own deliberate visual language. Sharing the global navbar, accessibility behavior, data shape, or section architecture does not authorize copying another language's typography, palette, ornament, image treatment, card geometry, or motion style.
- Keep language-specific art directions contained. For example, the Italian Renaissance/plaster/gilded-studiolo treatment belongs to Italian; a Portuguese or Brazilian-Filipino surface such as Filipinhos should use its own Lusophone/Brazilian-Filipino references and must not look like a recolored Italian page.
- Always use the Impeccable skill and its complete workflow whenever creating, redesigning, or materially polishing any frontend UI in this project. This is a sitewide requirement, not a language-specific preference; include the skill's implementation, responsive/browser review, finishing review, and scoped design documentation steps alongside these project rules.
- Before styling another page, portal, or community for a language that already has a deliberate visual identity, inspect that language's existing surface and reuse its established visual system: typography, palette, material references, spacing rhythm, image treatment, and interaction character. Do not substitute the identity of another language.
- If the language is genuinely new and has no established visual system, create an original art direction from scratch, grounded in that language's culture, Aljohn's story, and the page's real content. A generic under-construction or maintenance template does not count as an established language identity; the first finished language/community surface may establish the visual system that later pages should inherit.
- Treat the visible uniqueness of the French, Swedish, and Spanish pages as the creative quality bar: their shared architecture does not make them visual variants of one template. Every language surface must make specific, imaginative choices in composition, typography, material, imagery, copy rhythm, and interaction that belong to that language and to Aljohn's story.
- Do not “skin” one finished language page into another by changing only colors, flags, and headings. Use Impeccable to articulate and test the language-specific design premise before polishing the surface.
- When two pages share a structural stylesheet, add a dedicated theme layer or page stylesheet whenever tokens alone do not create a clearly distinct identity.

### Aljohn personal playlist/player rule

- Aljohn Polyglot is the author and curator of the page, never one of the curated creator cards.
- Keep Aljohn's own videos in a separate personal playlist/player module.
- Use a real featured YouTube player plus a clickable playlist list, following the working Spanish and French modules.
- Every visible playlist entry must include a recognizable thumbnail preview, not text alone. Store durable playlist thumbnails as validated local page assets with meaningful alternative text, intrinsic dimensions, lazy loading, and a local fallback; do not hotlink YouTube thumbnail URLs in the shipped interface.
- Never crop video or podcast thumbnails. Preserve the complete original frame with `object-fit: contain`; when its aspect ratio differs from the container, use intentional letterboxing or a compatible background instead of enlarging, clipping, or cutting off faces, titles, captions, or other thumbnail content.
- Do not substitute a generic playlist embed when a featured player/list experience is expected.
- Keep playlist entries and playlist metadata in a dedicated data file.
- Use the verified official playlist for the language when one exists.
- Do not include private, unavailable, or unrelated videos in the clickable playlist UI.
- Link appropriate story and playlist calls to Aljohn's official channel: `https://www.youtube.com/@aljohnpolyglot`.

### First-person story research rule

- Before writing or substantially revising Aljohn's first-person story for a language page, review the available transcripts or watch at least 15 relevant videos from Aljohn's playlist and channel for that language.
- Aljohn normally uploads a native English subtitle/SRT track with his own YouTube videos. Use that creator-provided English subtitle track as the primary transcript source; retrieve the uploaded `en` subtitles/SRT directly when available instead of running local speech-to-text over the audio.
- Never treat auto-generated multilingual transcription as equivalent to Aljohn's uploaded English SRT. If the native English track is unavailable for a specific video, verify that absence first, then use another reliable transcript source or watch the video; do not build personal-story copy from garbled machine transcription.
- When the relevant playlist contains fewer than 15 usable videos, review every usable playlist video and enough closely related videos from Aljohn's official channel to reach 15 where possible.
- Treat transcripts as evidence for voice, chronology, recurring motivations, places, people, and turning points; do not copy transcript phrasing mechanically or infer experiences the source does not establish.
- Keep private transcript notes and downloaded subtitle files out of the public website and Git unless Aljohn explicitly asks to publish them.

#### Local Aljohn English-subtitle cache

- Before fetching any Aljohn YouTube video, search the repository by video ID for an existing transcript, description, metadata record, or page-source copy. Use those local sources first; do not fetch YouTube merely to recover transcript or description text already present in the repository. Fetch video media only when the task genuinely requires visual inspection or when a required source is missing and must be verified.
- The private cache of Aljohn's long-form channel videos is at `D:\website\local-data\transcripts\aljohn-english-srt\`.
- Start with `D:\website\local-data\transcripts\aljohn-english-srt\index.json`; its `videos` rows identify the source video, subtitle status, track key, and local SRT filename.
- The manifest also contains `transcriptChecklist.manualEnglishSrtPresent` and `transcriptChecklist.manualEnglishSrtUnavailable` arrays for quick review.
- The downloaded `.srt` files are Aljohn's manually uploaded English tracks when present. Automatic captions are excluded; missing manual tracks must not be treated as available transcripts.
- This cache is private and Git-ignored. Do not publish, commit, copy, or link the subtitle files from the public site. The refresh helper is `D:\website\local-data\fetch-aljohn-english-srt.py`.

### Curated creator-library rule

- Creator curation passes edit the existing creator data collections only. Do not add catalog, importer, evidence, adapter, ranking, search, filter, or other UI architecture as part of a data pass.
- Treat a requested research, discovery, population, or curation pass as data-only unless Aljohn explicitly requests UI work in the same instruction. A data-only pass may add verified local creator or podcast assets and complete data modules, but it must not create, replace, wire, restyle, or expose new page sections, navigation, renderers, filters, modals, or portal surfaces. Record remaining UI work for a later implementation pass instead of silently broadening scope.
- A curated library is Aljohn's personal selection of other creators and channels, made with taste, memory, and a specific reason for inclusion. It is not an exhaustive directory, an automatically generated catalogue, or a dump of liked videos.
- Never add Aljohn Polyglot as a curated creator. His work belongs only in the hero, personal story, and personal playlist/player layer.
- A creator belongs on a language page because the creator's actual public work substantially uses or represents that target language or culture. A multilingual or language-learning channel is not automatically a Spanish, French, Italian, Swedish, or other target-language creator merely because one saved video mentions that language.
- A personality, artist, athlete, show, or media brand named in an Instagram caption or YouTube title/topic may be a curation lead even when someone else uploaded the post or video. Keep the named subject separate from the uploader; verify the subject's identity, target-language relevance, official link, local image, and complete public object before publication. A documented Aljohn note strengthens the entry but is not required to publish it.
- Treat relevant personalities as a required part of creator curation, especially personalities surfaced by Aljohn's verified Instagram following. Do not limit a creator library to YouTube uploaders or formal language teachers: verified athletes, performers, presenters, actors, musicians, writers, chefs, and other public figures belong in honest thematic shelves when they materially represent the target language or culture.
- A personality card must be as complete as a channel card. Give it a factual native-language short description and substantial neutral biography, a verified local portrait, official public links, honest CEFR/listening guidance for the media actually available, and a representative playable sample when verified public video exists. Instagram provenance alone is not visitor-facing biography copy, and a missing Aljohn note must never reduce the rest of the record to a placeholder.
- Keep personality shelves semantically distinct from sport, music, education, and other subject shelves, following the French and Swedish separation. Place an athlete in sport when the curated value is competition, training, analysis, or athlete media; place actors, presenters, entertainers, and broader public figures in a native-language personalities shelf when their interviews, public life, or cultural presence is the reason for inclusion. Do not use "personalities" as a miscellaneous bin or duplicate one identity across both shelves.
- Do not include Language Simp, Olly Richards / StoryLearning, Steve Kaufmann / The Linguist, or Luca Lampariello in any public language-page creator library. Their source rows may remain private evidence, but they must not generate public cards.
- Every creator or personality admitted to the Spanish public curation must have a verified country. Never infer country from language, account bucket, accent, display name, or a single video; keep an unknown-country candidate in private review until the country is verified.
- Automatically generated creator cards normally require at least 10 combined corrected YouTube liked-video rows and audit-clean Instagram likes across the canonical identity. This numeric threshold does not remove existing manual entries and does not block an explicitly curated personality, a verified relevant Instagram-followed account, an existing complete record in a language's curated JSON, or a creator Aljohn explicitly asks to publish. Those editorial entries still require verified identity, target-language relevance, a stable official destination, and complete public metadata.
- Every public curated creator card must have a verified local creator image, at least one verified official social/channel link, and a specific neutral description. `personalComment` / `aljohnComment` may remain `null` until Aljohn writes one. Never generate or infer Aljohn's note from likes, reposts, captions, frequency, or fame, and never hide an otherwise complete curated record merely because its personal note is blank.
- Render creator and friend social-profile links as accessible platform-logo buttons rather than repeated text labels. Use the recognizable YouTube, TikTok, Instagram, Facebook, or other site mark, give every icon-only link an explicit `aria-label` and `title`, preserve keyboard focus and sufficient touch size, and keep non-social actions such as course enrollment as clear text CTAs.
- Never use a YouTube video thumbnail, episode still, banner, podcast cover, or other content thumbnail as a creator image. Creator cards and creator modals must use a verified portrait or official profile/channel avatar that represents the creator; if no suitable portrait can be verified, keep the candidate out of the public image field until one is available.
- Research the creator's current official output before publishing or materially revising that neutral description. Short and long descriptions must identify concrete recurring formats, subjects, series, media, or disciplines the creator actually publishes and, where useful, the listening conditions a learner will encounter. Replace generic phrases such as "culture and daily life," "interesting content," or "good for learners" with specific editorial copy grounded in the creator's real work.
- Choose a verified public sample that is representative of the creator's usual target-language work, not merely the first available upload. Keep temporary research notes, search evidence, and provenance out of visitor-facing copy.
- Treat the language page's curated creator JSON/data module as the publication set after its records have passed identity, relevance, asset, link, and media verification. Renderers must not apply a second hidden publication gate based on optional editorial fields such as `personalComment`, `aljohnComment`, evidence labels, or private counts.
- When an optional personal note is blank, preserve the complete creator card, neutral description, guidance, embedded sample, and external links. Hide only the personal-note panel; do not hide the creator or substitute public workflow copy.
- Keep a root `REVIEWNOTES.md` editorial queue for complete published creator or personality records whose optional Aljohn note is still blank. Group the queue by language, name the canonical dataset record, and state only what Aljohn still needs to review or remember. This internal queue must never be rendered, linked, quoted, or paraphrased in the visitor-facing UI, and a queue entry must never block an otherwise complete creator record from the page dataset.
- When private activity repeatedly features a named personality through fan channels, broadcasters, compilations, or interview uploaders, audit the named personality as a separate curation candidate. Prefer one verified canonical personality record with an official profile and local portrait; keep a fan/media channel as a separate entry only when that channel itself has distinct target-language value and a verified identity.
- Every included creator should have evidence grounded in Aljohn's viewing history, followed accounts, language-learning story, supplied sources, or stated interests.
- Each finished language library should include at least 50 distinct, verified, relevant creators when Aljohn's private activity and following data supports that depth. Start with at least the 50 most frequently occurring relevant YouTube channels for that language, or review every relevant channel when fewer than 50 exist; do not pad the library with weak matches merely to reach the target.
- Treat `local-data/youtube-watch-history.json` as watch-history/activity evidence, regardless of the misleading names of its original export files. Aggregate records by stable channel identity and order the candidate review by how frequently a channel occurs in Aljohn's history. Do not substitute public video view totals, global popularity, follower counts, a single liked video, or a generic “most liked” ranking for Aljohn's own frequency signal.
- Within every thematic creator shelf, place the relevant creator or channel with the highest verified occurrence frequency in Aljohn's YouTube history first. Use only the private normalized frequency evidence to choose that lead card, recompute it when the history is refreshed, and never publish the count, a ranking label, or “most watched” copy. The remaining cards may follow editorial order.
- Treat curation tier, source frequency, like/repost counts, evidence strength, ingestion provenance, and labels such as “manual selection,” “reviewed,” “discovered,” or “saved video” as private editorial metadata. Do not render those values or labels in cards, modals, filters, sort controls, headings, status copy, or other visitor-facing UI.
- Do not add visitor-facing creator-library filters or sorting controls as part of a data-ingestion pass. Merge qualifying creators into the existing shelves and existing modal/card system. Private occurrence frequency may determine the default shelf order, but the UI must not expose frequency-based sorting, counts, ranking labels, or a curation-tier selector.
- Every finished language page with CEFR-tagged material must include a visible CEFR filter. Its default state is “all levels,” it must expose an accessible name and selected state, and it must derive results only from the page's declared CEFR metadata rather than guessing difficulty from titles or popularity.
- Every curated creator library must include its own CEFR filter for creator cards. Filtering may narrow or temporarily hide cards and empty shelves, but the unfiltered default must preserve the independent labeled shelf structure; never flatten creators into one mixed grid to implement the filter.
- Treat CEFR filtering as standard language-page architecture, not as private curation metadata or optional sorting. A creator-data ingestion pass should connect new records to the existing CEFR control without adding unrelated search, ranking, evidence, or catalogue UI; when a legacy page lacks the required control, schedule or perform that bounded renderer upgrade explicitly rather than smuggling it into an unrelated data rewrite.
- Cross-reference those YouTube candidates with `local-data/instagram-following.json`. Give added curation weight to a verified person or organization that appears in both sources, while keeping the cross-platform match private and verifying that the accounts represent the same subject.
- Treat older language-specific review JSON, hand-curated lead maps, and `TODO.md` lists as starting points rather than exhaustive allowlists. Re-scan the freshest normalized Instagram following, YouTube history, and supplied listening exports during each language pass so newly followed or Instagram-dominant personalities are not omitted merely because they were absent from an earlier queue.
- Review the Instagram following beyond language teachers. Relevant footballers and other athletes, actors, television personalities, musicians, filmmakers, writers, chefs, journalists, cultural institutions, media brands, and other known public creators Aljohn follows belong in appropriate language and culture shelves when their public work meaningfully uses or represents the target language.
- A relevant verified Instagram-followed creator should not be omitted merely because the person is famous, is not a formal educator, or has no matching YouTube channel. Place such creators in honest thematic shelves and provide the same local portrait, source verification, description, CEFR/listening guidance where applicable, and accessible modal treatment as other curated entries.
- Never publish the raw activity JSON, watch/like counts, private or deleted entries, unrelated viewing history, or personal metadata. The frequency-led first card is an unlabelled curation rule, not a visitor-facing ranking; the public page must remain an intentional category-led library.
- Group creators into independent thematic categories or shelves, following the Spanish creator shelves and Swedish resource-category patterns.
- Keep children’s programming, youth-first channels, cartoons, and dubbed animation in a dedicated children’s/cartoon shelf instead of mixing them into general entertainment. Follow the separate treatments already established by Spanish animation, Swedish `kids-content`, and Russian `kids` (including Peppa Pig). Adult animation, animated explainers, and family content aimed primarily at adults may remain in their honest subject shelf; classify by intended audience and recurring format, not by the mere presence of animation.
- Render the library in an explicit repeated shelf structure: a visible category heading followed by that category's own row of creator cards, then the next category heading and its separate row (`CATEGORY → [A] [B] [C]`, `CATEGORY 2 → [A] [B] [C]`, and so on).
- Keep each creator-category row as a contained horizontal shelf when it holds more cards than fit in the viewport. The shelf may scroll horizontally by touch, trackpad, or visible previous/next controls, but the page itself must never acquire horizontal overflow; use a min-width-safe wrapper, overscroll containment, scroll snapping, and responsive card widths.
- Category filters may narrow or hide shelves, but the default complete view must preserve the distinct labeled rows. Do not flatten all creators into one mixed grid and rely on tags alone to communicate category.
- Do not turn the curated library into a list of individual videos, a featured-video player, or one mixed uncategorized grid.
- Creator cards should lead with the creator's real profile/channel image, name, category, and suggested CEFR range.
- Clicking a creator card should open an accessible details modal rather than navigating immediately.
- Each creator modal should support:
  - a longer neutral channel description
  - an editable and visibly distinct Aljohn personal comment when one is documented
  - CEFR guidance and a suggested listening range
  - a sample embedded video
  - verified external channel or social links
- Every creator modal must render a playable embedded sample video when verified public media exists; a bare outbound video link or collaboration CTA is not a substitute. Keep the embedded player inside the modal and preserve a clear unavailable state when no verified public video exists.
- Keep creator descriptions, personal comments, CEFR guidance, images, sample videos, and links editable in a dedicated creator dataset.
- Keep neutral descriptions and Aljohn's personal comments separate. Do not invent attachment, viewing habits, attendance, relationships, or recommendation reasons.
- When Aljohn's personal reason is not yet documented, keep the dataset field `null` and omit the personal-note block from the public modal. Do not render editorial placeholders such as “note pending,” “after review,” or “to be added”; the absence is a private editing state, not visitor-facing content.
- Do not add dataset-stat blocks such as total videos, creator totals, shelf counts, or last-updated dates.

### Private-source and creator-image rule

- Before sourcing a person's image, profile, social link, channel, course, or other destination for a language-page feature, search the entire repository for that identity's existing canonical friend, creator, group, or community record. Reuse those verified links and localize the existing image source when necessary; do not claim an asset or link is unavailable until the full-repository search is complete.
- Treat facts, links, anecdotes, corrections, transcripts, research leads, and operational context that Aljohn supplies as agent-only evidence by default. Use them privately to guide research, verification, ordering, and implementation; do not expose, quote, paraphrase, or allude to them in visitor-facing UI unless Aljohn explicitly asks to publish that specific information. A request to investigate, remember, or use information as context is not permission to display it.
- Never tell visitors that a fact, venue, person, address, or recommendation came from a video description, transcript, source file, cache, private export, research note, or Aljohn's memory. Keep provenance private and write only the natural public context, such as which Aljohn video or event featured it, followed by the verified visitor-useful details.
- Private exports may be read locally as evidence for curation, but the export itself, unrelated personal account data, cookies, tokens, and signed or expiring CDN URLs must never be copied into the public website or Git.
- Keep normalized private evidence only under the Git-ignored `local-data/` directory. Use `local-data/instagram-following.json` and `local-data/youtube-watch-history.json` as the canonical working files; do not scatter page-specific copies through `languages/` or commit either export.
- Rebuild `local-data/instagram-following.json` from `C:\Users\user-MSI\Downloads\instagram-accounts.json` when a fresher export is supplied. Normalize usernames case-insensitively and deduplicate by canonical Instagram username/profile URL without discarding the most complete verified public-profile fields.
- Rebuild `local-data/youtube-watch-history.json` by merging `C:\Users\user-MSI\Downloads\youtube-liked-videos.json` and `C:\Users\user-MSI\Downloads\youtube-liked-videos (1).json`. Deduplicate videos by YouTube video ID, channels by stable channel ID or canonical channel URL, and use a normalized channel name only as a fallback. Preserve the most complete record while preventing the same video or channel from inflating frequency counts.
- Rebuild `local-data/pocketcasts-history.json` by merging the freshest `C:\Users\user-MSI\Downloads\pocketcasts-history-*.json` exports. Deduplicate episodes by stable Pocket Casts episode ID, aggregate shows by stable podcast ID, and preserve the most complete verified show URL and artwork fields. The exports and normalized file are private listening evidence and must remain under Git-ignored `local-data/`.
- Refresh and deduplicate the canonical files before a substantial creator-library migration. Never delete or overwrite the original Downloads exports as part of normalization.
- Use the Instagram export as evidence not only for language-teaching accounts but also for artists, musicians, filmmakers, writers, cultural institutions, and other creators Aljohn already follows when they strengthen a language page's curated shelves.
- A followed Instagram account is a curation lead, not automatic inclusion. Verify the creator's identity, relevance, public profile, and usable public media before adding the creator to the site.
- Never ship an expiring signed Instagram CDN URL as a creator `profilePic`.
- Download verified creator images into `languages/<language>/images/creators/` and reference only the local asset from the public dataset.
- `https://github.com/edizbaha/instagram-pfp-downloader` is an approved helper for retrieving Instagram profile pictures. Inspect it before use, keep only downloaded creator images in the project, and do not add the helper repository or its dependencies to the website.
- Reuse the helper's current Instagram profile-picture API flow when it works and validate every response as an image.
- If that API stops working, immediately download the current `profileImageUrl` from Aljohn's local Instagram export, verify the file is a valid image, and still reference only the local copy from the dataset.

### Podcast-listening curation rule

- When the private Pocket Casts history contains relevant target-language shows, give the language page an independent podcast shelf or listening section following the established Swedish and Spanish patterns. Podcasts are a first-class listening resource and must not be buried inside a mixed creator grid.
- Keep podcast shelves compact and cover-led. A shelf card should show only the cover, title, publisher or format, CEFR range, and a clear details action; move the long description, listening guidance, optional Aljohn note, and external listening links into an accessible podcast-details modal. Activating the card or details action opens that modal instead of navigating directly to a listening platform. Do not make the shelf card itself read like the open modal.
- Keep podcasts in their own dedicated listening section and dataset, separate from creator shelves, creator cards, and creator modals. A podcast may be referenced contextually from a creator modal, but it must not be rendered as a creator card or mixed into the creator library.
- Order each language's podcast shelf by the deduplicated occurrence frequency in `local-data/pocketcasts-history.json`, highest-frequency relevant show first. This ordering is private editorial evidence: never publish play counts, history labels, dates, ranking badges, or explanations of the sorting signal.
- Verify each show's language, current title, publisher, official destination, representative subject matter, and continued availability before publication. Write a specific description in the page's native language, add honest CEFR/listening guidance, and distinguish learner-paced programmes from full-speed native conversation, news, sport, documentary, culture, and entertainment.
- A show needs a durable local cover image before it ships. Pocket Casts show and episode URLs may remain external listening actions, but Pocket Casts artwork URLs must be downloaded, validated, and referenced as local project assets.
- Deduplicate a podcast that already exists elsewhere on the page. It may appear in the dedicated podcast shelf and be referenced contextually from a creator modal, but it must not become duplicate public cards within the same shelf system.
- Preserve verified Spotify destinations verbatim for podcasts and music artists. Spanish and Swedish establish the pattern, and Cebuano already follows it: music-artist records carry their official Spotify artist link, podcast records carry their official Spotify show link, and each respective details modal exposes a native-language Spotify button only when that link exists. Apply the same data-and-modal pattern to every language page that has the corresponding modal; for pages intentionally without a podcast UI/modal (currently German and Portuguese), keep the verified data ready without inventing a new surface. Correct stale, malformed, or non-canonical existing Spotify URLs when verification finds the official destination; otherwise do not rewrite, proxy, or invent URLs.

### Local visual-asset rule

- Aljohn prefers narrative photo carousels over exposed multi-photo grids. Present gallery and event photography one image at a time with literal, visible previous/next arrow buttons; do not reveal every gallery photo at once. Preserve swipe/trackpad support where useful, but never make gestures the only navigation. Apply this preference consistently across language pages unless Aljohn explicitly requests a grid, contact sheet, or collage for a specific module.

- Treat every durable image displayed by the public site as a local project asset before shipping. This includes hero photographs, creator portraits, venue and place photos, book covers, film and television posters, programme thumbnails, logos, gallery images, and decorative raster textures.
- Do not leave third-party `http://` or `https://` URLs in public `<img src>` attributes, dataset image fields, CSS `url(...)` declarations, or dynamically generated image markup. External pages may remain as clickable destinations, and third-party media players may remain embedded, but their surrounding preview artwork must use validated local files.
- Download each image from a verified public source, confirm that the response is a decodable image rather than HTML, an error page, or a placeholder, inspect that it depicts the intended subject, optimize it to a suitable web format and size, place it in the relevant page asset folder, and reference it with a local path.
- Give content images meaningful alternative text and intrinsic dimensions. Use `loading="lazy"` and `decoding="async"` when appropriate, while keeping important above-the-fold media eagerly available.
- For data-driven cards and galleries, provide a local visual fallback so an unexpected missing file does not expose a broken-image icon. A fallback is resilience only; it does not replace shipping the verified intended image.
- After changing page imagery, audit every image reference on the affected page: confirm that each local file exists, decodes successfully, is served with an image MIME type and HTTP 200, and renders correctly at desktop and mobile widths. Do not treat a remote hotlink as temporary production content.
- Keep future language-specific assets scoped to their intended language and do not expose them in another language page by association. The Christian Bautista photos are reserved for a future Indonesian treatment; the German Eurovision photos are future assets only and must not be presented as a Goethe or other German partnership without explicit user direction.

### Restaurant-section and contextual-media rule

- On every language page that includes a restaurant, café, bar, or food-place shelf, place that shelf as the final substantive content section immediately before the page's closing first-person note or final call to action, following the Swedish page's reading order. Never place it directly after Aljohn's personal playlist or between learning, creator, book, media, place, and community chapters.
- Verify each venue's official Instagram handle and profile URL before publishing it. Display the verified handle with the link when one exists; if no official account can be verified, omit Instagram rather than infer or fabricate a handle.
- Restaurant and place cards should lead with a verified official venue logo, social-profile mark, or recognizable storefront-sign crop when one is available. Keep a separate verified food, storefront, or interior photograph inside the details modal so the card identity and documentary view serve different roles. Store every durable image locally and record its source.
- Aljohn Polyglot video thumbnails are reserved for entries inside Aljohn's own personal playlist/player. Never reuse them as artwork for restaurants, creators, places, resources, books, community groups, learning modules, galleries, or any other unrelated media. An Aljohn video may remain an explicitly labeled episode link inside a relevant detail view without supplying that view's image.

### Generated visual asset rule

- Codex ImageGen may be used for a new raster asset when a language page has a genuine visual gap and a generated illustration, texture, scene, or supporting image materially strengthens the chosen art direction.
- Web search may be used to find stronger real-world visual references or public assets when the repository does not already contain the right material. Verify the source, usage suitability, subject identity, and image quality before adopting an asset; save approved site assets locally rather than depending on fragile hotlinks.
- Treat web-sourced assets and Codex ImageGen as available art-direction tools, not last-resort exceptions. Choose between them according to the story: use authentic public media for real people, places, groups, institutions, artworks, and events; use generated imagery only for clearly illustrative or atmospheric supporting roles.
- Prefer verified project photography and real creator, group, event, place, and cultural-center media whenever those exist. Never replace documentary evidence or imply that a generated person, event, venue, artwork, or collaboration is real.
- Generated assets must be clearly suitable for their supporting role, contain no fabricated logos or identity claims, be saved inside the relevant project asset folder, and be referenced locally by the page.
- Do not generate decorative assets merely to fill space when typography, layout, CSS-native ornament, or existing project media already solves the design need more honestly.

### Copy, layout, and interaction rule

- Publish learning materials, study tools, media resources, and outbound resource recommendations only when Aljohn has explicitly supplied or approved them for the page. Do not independently web-research and add public resource recommendations, even when they appear authoritative or useful. Unapproved candidates may remain private review notes only and must not be rendered or shipped in public datasets.

- Write each visitor-facing language page primarily in its target language, including navigation, headings, stories, playlist notes, resource copy, creator shelves, modal content, and closing calls to action. Use English only when it materially improves comprehension or accessibility, and keep any bilingual support subordinate to the native-language experience.
- For Tagalog and Cebuano/Bisaya copy, use modern, natural language that present-day Filipino speakers would actually use. Prefer clear conversational phrasing and familiar loanwords such as “tutor,” “one-on-one,” and “online” when a purely formal equivalent sounds stiff; avoid archaic, overly deep, or textbook-style wording without making the copy awkwardly English-heavy.
- Avoid AI-slop copy: no generic filler, repeated recommendation formulas, vague praise, invented attachment, or mechanically paraphrased descriptions and personal comments.
- Never expose internal curation framing in visitor-facing UI. Do not use phrases such as “not an automated directory,” “not a directory,” “automated catalogue,” or explanations of how private likes, follows, rankings, evidence, or ingestion determine what appears. Keep that reasoning in internal documentation and let the page communicate through its personal story, specific descriptions, and visible organization.
- Language pages should guide visitors through a step-by-step learning path when the relevant material exists: hero and personal story → Aljohn’s video playlist → a structured course such as Language Transfer → focused practice such as Extr@, Linguno, or a study kit → books, media, creators, places, and community. Keep this learning sequence ahead of the broader discovery shelves, and adapt the order to the modules actually available on each language page.
- Swedish creator/resource discovery should lead with the dedicated “Topp-Poddar: Mina Lyssningsstips” shelf when its podcast data is available, with “The Swedish Linguist Podcast” and “Lätt Svenska med Oskar” first in that shelf and their supplied listening descriptions preserved.
- Never expose, quote, paraphrase, or call attention to `AGENTS.md`, internal curation criteria, implementation instructions, content-model rules, design decisions, or production process in public-facing website copy.
- Do not write visitor-facing meta-copy such as “not a directory,” “not in the same shelf,” “this deserves a dedicated section,” “these are not creator cards,” or explanations of why a carousel/card/layout was chosen. Let the information architecture communicate those distinctions while the copy stays inside Aljohn's story and the visitor's needs.
- Do not explain module boundaries in visitor-facing copy. Phrases such as “this collection is separate from the library,” “Aljohn’s playlist is separate from other creators,” or similar descriptions of the page’s architecture belong only in internal documentation; express the distinction through headings, placement, and interaction design.
- Prefer real project references and specific descriptions over placeholders.
- Do not make content-rich pages feel compressed or catalogue-like. Keep generous section spacing, readable line lengths, and strong visual separation between the hero, personal playlist, creator shelves, modal content, and resources.
- Preserve visible keyboard focus, meaningful alternative text, usable touch targets, and reduced-motion behavior.
- Creator modals and media lightboxes must support keyboard operation, Escape to close, backdrop close where appropriate, focus trapping, body-scroll lock, and focus restoration to the trigger.
- Every modal, dialog, image lightbox, and gallery overlay must also include a clearly visible, keyboard-focusable × close button in a predictable top corner. Escape and backdrop closing are supplementary, not substitutes for the visible close control.
- Treat every external action inside a creator or resource modal—including YouTube, Instagram, Spotify, Facebook, and official-site links—as release-critical functionality. Preserve the verified dataset URL, keep the action keyboard-focusable and genuinely clickable, prevent card/backdrop handlers from intercepting it, and regression-test the rendered link after modal or CSS refactors.
- Featured playlist items, category filters, searches, carousels, and modal controls must expose clear accessible names and state.

### Impeccable browser-QA finish gate

- Treat frontend work as unfinished until the affected rendered path has completed the Impeccable workflow: load the relevant product/design context, inspect the incumbent visual system, apply the owning Impeccable playbook and craft floor, implement the complete path, then perform browser QA before the final detector pass.
- Every UI fix, including a small CSS or copy correction, must be exercised through the project Playwright/browser workflow and screenshot-checked at both a representative desktop and mobile viewport before it is reported finished.
- Use the project browser-control/Playwright workflow to inspect every affected page at representative wide desktop, intermediate/laptop, and narrow mobile viewports. Capture screenshots of the full page and every changed interaction state, including each modal, lightbox, expanded card, carousel, filter, empty/error state, and long-content state that the change can produce.
- For every modal or overlay, verify opening from the real trigger, visible close ×, backdrop close where intended, Escape close, focus trapping, body-scroll lock, internal vertical scrolling, focus restoration, external CTA navigation, long localized copy, compact viewport behavior, and zero clipped or unreachable content.
- During the same bounded QA pass, check page-level horizontal overflow, card/shelf clipping, sticky navigation offsets, keyboard focus visibility, touch target size, reduced-motion behavior, broken images, incorrect fallbacks, console errors, failed network requests, and layout shift. Fix the causes in one batch and perform at most one confirmation round.
- Keep QA screenshots and temporary browser artifacts outside public site assets and Git unless Aljohn explicitly asks to publish them. They are implementation evidence, not website content.
- Run the Impeccable detector exactly once after the final UI change set, not before and not repeatedly as a substitute for visual inspection. A degraded or warning-only detector result must be reported honestly and does not waive browser QA.

### Cross-reference and community rule

- Treat the website as one connected body of work. Before creating new language-page copy or data, search the existing site for relevant people, groups, cultural centers, events, interviews, books, galleries, and first-person records.
- Before creating or expanding any language portal, cross-reference the homepage friend collection, canonical group pages, community and cultural-center records, Aljohn's playlist/transcript evidence, and existing language or event features. When an established person, group, or project materially belongs to the language story, prepare a contextual native-language portal record that points to the canonical local page or friend record instead of duplicating a thinner identity. Portuguese research must retain explicit cross-reference candidates for Filipinhos and Calvin Castiel from Angola, grounded in their existing group page and Aljohn's verified conversation respectively; UI exposure waits for an explicit implementation pass.
- Every language page must have a native-language book-resource collection. This is mandatory information architecture, not an optional enhancement. Populate that collection from the canonical catalogue in `library/index.html` whenever a book's language, subject, or documented reading context belongs to the page, even during a data-only pass; do not wire or invent the visible shelf until a UI pass is explicitly requested.
- Keep the relationship bidirectional. A relevant book already catalogued in `library/index.html` must be represented in the matching language-page book dataset, and a verified book first discovered during a language research pass must be added or queued for the canonical library catalogue as well. Reuse the canonical bibliographic metadata and cover asset in both directions while keeping language-page-specific reading notes separate.
- Treat `library/index.html` as the canonical cross-site book catalogue. When a Spanish, Italian, French, or other language page features the same book, reuse the same canonical local cover asset and shared bibliographic metadata instead of downloading, renaming, or maintaining a duplicate copy. Keep language-page-specific notes separate, add reciprocal contextual links between the library record and the relevant language page, and update shared book assets at their canonical source so every consumer stays in sync.
- A language-page bookshelf must still open its own native, accessible book-details modal styled and written for that language page, following the French implementation. Shared data and assets do not authorize routing a language-page book card directly into the general library modal. Never add a general-library CTA or link such as “Ver en la biblioteca general”, “Voir dans la bibliothèque générale”, or “Biblioteca completa” inside a language-page book modal; keep that modal focused on the native page's reading details and source actions. Preserve Escape/backdrop closing, focus trapping, body-scroll lock, and focus restoration.
- Reuse and cross-link the canonical existing page when a subject already has a fuller profile elsewhere; do not duplicate a conflicting or thinner version of the same story.
- Give real groups and cultural centers a visible place when they materially shaped Aljohn's relationship with the language. Distinguish community groups, teaching institutions, cultural associations, and media resources instead of mixing them into creator shelves.
- Where evidence exists, connect language pages to the project's dedicated group pages, cultural-center pages, library records, and event media with contextual links rather than generic “learn more” copy.
- Reuse each institution or group's verified logo from its canonical page or existing project assets inside the dedicated language-page section. If the canonical record still hotlinks a logo, download and validate a stable local copy before using it; do not omit the logo or substitute a generic icon when the real identity asset exists.
- Do not compress several important groups, cultural centers, collaborators, or community relationships into one generic card grid. When each subject has meaningful evidence, give each one a dedicated section or clearly independent editorial feature with its own story, media, and canonical links.
- Tropamici, the Philippine Italian Association, and Società Dante Alighieri Manila must each have a dedicated Italian-page treatment when Italian community content is being built; their different roles and Aljohn's different relationship to each must remain visible.
- When a language-page call to action refers to an institution already represented by a richer local detail modal, link to that modal's canonical deep-link hash instead of sending the visitor straight to a thinner external page. For the Italian community features, use `languagecenters.html#institute-pia` and `languagecenters.html#institute-dante-manila`; the destination page must resolve the hash, show the correct language list, and open the named modal automatically. Keep the institution's official website available inside the modal.
- When a language-page institution CTA points to a canonical language-centers record, use the exact canonical deep-link already supported by the destination, make every exposed CTA for that institution resolve to the same record, and use direct wording such as “Voir la fiche…” rather than “Voir mon carnet des centres.” For Alliance Française de Manille, the canonical path is `languagecenters.html#institute-af-manille` (for example, `http://127.0.0.1:5500/languagecenters.html#institute-af-manille`); do not invent a different compound hash for this record.
- On the main `groups.html` directory, group cards must remain logo-led. Do not use meetup photographs, member photographs, teacher/leader portraits, or other people photos as card covers there; keep those documentary images inside each group's dedicated page.

### Gallery, slideshow, and carousel rule

- When the project contains multiple meaningful photos for a group, cultural center, event, person, or chapter of Aljohn's story, create a dedicated photo section, slideshow, or carousel for that subject instead of reducing the images to one thumbnail or a compressed mixed collage.
- A dedicated carousel must have a visible subject-specific heading and context, previous/next controls, a visible close × on any expanded-image modal, keyboard operation, useful alternative text or captions, position status, touch-friendly controls, and reduced-motion behavior.
- Keep separate photo narratives separate. For example, a Tropamici meetup gallery, a PIA/Dantedì gallery, and a Dante language-exchange gallery should not be flattened into one anonymous “community photos” carousel.
- Multiple supplied photos usually indicate that the subject deserves its own visual chapter. Preserve enough image size and surrounding space for faces, place, and activity to remain legible.

## French-specific rules

- The French page combines Swedish narrative warmth with Spanish playlist and library strength while retaining its own French visual identity.
- Prefer real French project references already in the repo:
  - Alliance Francaise de Manille
  - Alliance Francaise de Cebu
  - Saging Ca Va?
  - French Embassy / French Film Festival assets
- Use Aljohn's verified French playlist: `https://www.youtube.com/playlist?list=PLHC88jnBSUqJKNya7qTUk48v9qS28l5I-`.
- Remove unrelated New Zealand Ambassador clips from the French clickable playlist unless the user explicitly asks to keep them.
- Treat `Extr@` as its own playlist/resource module rather than burying it in generic content.
- Treat Facebook reels supplied by Aljohn as primary personal sources alongside his own YouTube videos and transcripts.
- Keep supplied Facebook reel URLs exact when the canonical Facebook page URL cannot be verified; do not invent a Facebook handle.
- Do not add or restore a French France.tv/streaming module unless the user explicitly requests it and supplies usable page data. Do not add generic access rituals, Urban VPN instructions, TF1+/France.tv access steps, or an FR↔ES/RTVE cross-reference.
- The French page still needs a detailed evidence-backed YouTube creator-library build-out. Use the French-relevant records in the canonical `local-data/youtube-watch-history.json` to establish that depth, then cross-reference and expand it with `local-data/instagram-following.json`. Apply the shared 50-creator, cross-platform, local-image, and privacy rules.
- Keep French cards, shelves, albums, playlist modules, and modals consistent with the French page's own colors, typography, textile/atlas materials, spacing, and visual identity.

## Italian-specific rules

- Keep the Italian page's hero, player, creator shelves, and modal consistent with its Renaissance-inspired colors, typography, framing, and visual identity.
- Use Aljohn's verified official Italian playlist: `https://www.youtube.com/playlist?list=PLHC88jnBSUqK-LD66Omr5EMZ9vtFMIbGh`.
- Keep Aljohn's Italian playlist in a dedicated Italian data file and render it as a featured video player with a clickable list.
- The four New Zealand Ambassador shorts currently present at the end of the YouTube playlist are unrelated to Italian; exclude them from the Italian page's clickable playlist unless the user explicitly asks to keep them.
- Preserve the Italian page's existing detailed YouTube creator curation. Use the Italian-relevant records in `local-data/youtube-watch-history.json` to audit identities and fill genuine gaps, not to rebuild the library unnecessarily. The outstanding curation work is to cross-reference and expand the Italian shelves with relevant accounts from `local-data/instagram-following.json`, applying the shared cross-platform, local-image, and privacy rules.
- Do not use any Aljohn Polyglot video, thumbnail, or channel entry as a curated creator card. Aljohn's videos belong only in the personal hero/story and personal playlist/player modules.
- Include RaiPlay (`https://www.raiplay.it/`) as a distinct Italian media/resource section, with clear guidance about what it offers and any access or regional limitations that can be verified at implementation time.
- Include a dedicated Italian community feature for Tropamici and link to the project's canonical `groups/tropamici.html` page.
- Feature the Philippine Italian Association and Società Dante Alighieri Manila as distinct but related cultural-center stories, grounded in the existing `js/languagecenters-data.js` records and linked to `languagecenters.html` rather than rewritten as generic resource cards.

## German-specific rules

- When the German page is rebuilt beyond its current maintenance state, use Language Transfer's verified German course as the embedded audio source: `https://soundcloud.com/languagetransfer/sets/complete-german-more-on-the`.
