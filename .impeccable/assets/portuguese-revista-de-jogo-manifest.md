# Portuguese — Revista de Jogo asset manifest

Asset audit for approved comp A (`exec-1b820e64-3426-4d93-b809-347211fa325d.png`). The comp is a composition reference only and must not ship. No people or documentary imagery were generated.

## Hero and community photography

| Exact local asset | Role | Intrinsic size / aspect | Crop recommendation | Alt-text intent | Provenance / status |
| --- | --- | --- | --- | --- | --- |
| `languages/portuguese/images/community/calvin-castiel-with-aljohn.jpg` | Primary hero photograph; approved-comp lead image | 960 × 1280 / 3:4 portrait | Desktop: wide crop around the three faces, `object-position: 50% 40%`; mobile: retain portrait frame and all three people. Never stretch. | Aljohn, Calvin Castiel, and another attendee together outdoors at night. | User-supplied event photo documented in `community/SOURCES.md`; decoded and visually verified. **Hero-safe.** |
| `languages/portuguese/images/community/angolan-event-group-portrait.jpg` | Hero inset / documentary secondary image | 1280 × 960 / 4:3 landscape | Keep native 4:3; trim background only, retaining all four foreground people. | Aljohn with three attendees at an Angolan community event. Do not name the unconfirmed attendee. | User-supplied event photo documented in `community/SOURCES.md`; decoded and visually verified. **Hero-safe.** |
| `languages/portuguese/images/community/angolan-event-interview-blue-suit.jpg` | Story/interview editorial photograph below hero | 960 × 1280 / 3:4 portrait | Keep vertical; crop small ceiling area while retaining both speakers, microphone, and camera. | Aljohn interviewing a guest in Portuguese beside a camera at an event. | User-supplied event photo documented in `community/SOURCES.md`; decoded and visually verified. **Editorial-safe.** |
| `languages/portuguese/images/community/angolan-portuguese-interview.jpg` | Story/interview editorial photograph below hero | 960 × 1280 / 3:4 portrait | Keep vertical; retain both full figures and visible recording context; avoid tight face-only crop. | Aljohn holding a microphone while speaking with a guest in Portuguese. | User-supplied event photo documented in `community/SOURCES.md`; decoded and visually verified. **Editorial-safe.** |
| `languages/portuguese/images/community/calvin-castiel.jpg` | Calvin community/homepage profile; not hero media | 800 × 800 / 1:1 | Use native square with centered face and creator award; do not substitute for the event-led hero. | Calvin Castiel holding his YouTube creator award. | Decoded and visually verified; referenced by the Portuguese cross-reference data and homepage, but absent from `community/SOURCES.md`. **Usable in its existing profile role; provenance ledger gap.** |

Hero decision: comp A can be reproduced entirely with the first two verified real event photos. YouTube thumbnails are prohibited from the hero.

## Aljohn playlist thumbnails

All eight files are readable 480 × 360 JPEGs (4:3) with the thumbnail composition already baked in. Render at native 4:3 with `object-fit: cover` or `contain`; never force them into a tall card or stretch them. Their only valid role is inside Aljohn's featured playlist/player. Alt intent is already declared in `portuguese-playlist-data.js`.

| Exact local asset | Role / alt-text intent | Provenance / status |
| --- | --- | --- |
| `languages/portuguese/images/playlist/D1GjiRb9m3U.jpg` | Daiana Menezes conversation preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/EGnzCddwFnc.jpg` | Day-one/day-sixty Portuguese progress preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/gOzMcdrX0aU.jpg` | Two Filipino polyglots / six-language conversation preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/nupBNppwYEk.jpg` | Filipino-Canadian four-language interview preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/oDoST-RuizU.jpg` | Five-language remote polyglot conversation preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/kpas6rd-jHQ.jpg` | Portuguese/Italian event conversation preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/2MYSQ4MUwh8.jpg` | Angolan creator conversation preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/playlist/1Me1in8m5Es.jpg` | African gala Portuguese-immersion preview. | Matches video ID and declared alt; decoded and visually verified. No separate image-source ledger. |

## Podcast covers

| Exact local asset | Role | Intrinsic size / aspect | Crop recommendation | Alt-text intent | Provenance / status |
| --- | --- | --- | --- | --- | --- |
| `languages/portuguese/images/podcasts/bola-presa.jpg` | Bola Presa podcast shelf and modal cover | 800 × 800 / 1:1 | Native square; no crop. | Cover of the Bola Presa podcast. | Dataset links identify the show and official destinations; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/podcasts/braincast.jpg` | Braincast podcast shelf and modal cover | 800 × 800 / 1:1 | Native square; no crop. | Cover of the Braincast podcast. | Dataset links identify the show and official destinations; decoded and visually verified. No separate image-source ledger. |
| `languages/portuguese/images/podcasts/nerdcast.jpg` | NerdCast podcast shelf and modal cover | 800 × 800 / 1:1 | Native square; no crop. | Cover of the NerdCast podcast. | Dataset links identify the show and official destinations; decoded and visually verified. No separate image-source ledger. |

## Creator portraits

Use every creator image only for its matching record in `brasil-creators-data.json`. Alt text should be the creator or organization name plus “retrato” or “imagem de perfil”; do not describe inferred relationships. Square assets should stay square; the verified non-square portraits can use an editorial 4:5 card crop while keeping faces and club marks visible. Sources and the 2026-08-30 retrieval date are recorded in `languages/portuguese/images/creators/SOURCES.md`.

### Dataset-backed square portraits with adequate card resolution

All are decoded, visually readable 1:1 JPEGs. Crop: native square, centered; role: matching creator card/modal portrait; provenance: dataset-backed local assets, but this folder's source ledger does not record their public sources.

- 900 × 900: `languages/portuguese/images/creators/tinocando-tv.jpg`, `languages/portuguese/images/creators/portuguese-with-leo.jpg`, `languages/portuguese/images/creators/muuhpro.jpg`, `languages/portuguese/images/creators/supa-strikas-em-portugu-s.jpg`, `languages/portuguese/images/creators/dilsinho.jpg`, `languages/portuguese/images/creators/bola-presa.jpg`, `languages/portuguese/images/creators/desimpedidos.jpg`, `languages/portuguese/images/creators/sem-zika.jpg`, `languages/portuguese/images/creators/sport-imperativo.jpg`, `languages/portuguese/images/creators/nba-brasil.jpg`.
- 720 × 720: `languages/portuguese/images/creators/gabriel-poliglota.jpg`, `languages/portuguese/images/creators/crescendo-com-luluca.jpg`, `languages/portuguese/images/creators/fala-serio.jpg`, `languages/portuguese/images/creators/t3ddy.jpg`, `languages/portuguese/images/creators/teen-videos.jpg`, `languages/portuguese/images/creators/conselho-de-valor.jpg`, `languages/portuguese/images/creators/jao.jpg`, `languages/portuguese/images/creators/hugo-henrique.jpg`, `languages/portuguese/images/creators/anitta.jpg`, `languages/portuguese/images/creators/neymar-jr.jpg`, `languages/portuguese/images/creators/cazetv.jpg`, `languages/portuguese/images/creators/vini-vainer.jpg`, `languages/portuguese/images/creators/vini-jr.jpg`, `languages/portuguese/images/creators/richarlison.jpg`, `languages/portuguese/images/creators/bruna-marquezine.jpg`, `languages/portuguese/images/creators/jade-picon.jpg`.

### Source-documented replacement set

Twenty-nine former 150 × 150 avatars were replaced in place with verified official-channel, club, official-site, broadcaster, or talent-agency imagery. Filenames and dataset references did not change.

| Final intrinsic size | Exact local filenames |
| --- | --- |
| 900 × 900 | `ana-castela.jpg`, `basquete-brasil-cbb.jpg`, `bianca-costa.jpg`, `carol-biazin.jpg`, `cristiano-ronaldo.jpg`, `day-e-lara.jpg`, `debora-aladim.jpg`, `duda-paiva.jpg`, `duda-rocha.jpg`, `isadora-pompeo.jpg`, `lis-avancini.jpg`, `manel-carrapatoso.jpg`, `mariana-fagundes.jpg`, `marina-sena.jpg`, `sandy-junior.jpg`, `selecao-brasileira.jpg`, `thiaguinho.jpg` |
| 600 × 708 | `kika-nazareth.jpg`, `raphinha.jpg` |
| 650 × 809 | `w-luiz.jpg` |
| 700 × 1000 | `madalena-aragao.jpg` |
| 984 × 1476 | `marjorie-estiano.jpg` |
| 1045 × 1306 | `vozinha.jpg` |
| 1200 × 750 | `ronaldinho-gaucho.jpg` |
| 1496 × 2160 | `margarida-corceiro.jpg` |
| 1500 × 2000 | `endrick.jpg`, `nuno-lopes.jpg`, `rodrygo.jpg` |
| 2000 × 2000 | `marquinhos.jpg` |

`marquinhos.jpg` is now a real official PSG player portrait rather than the former tiny trophy image. The footballer cutouts from Real Madrid and FC Barcelona were mechanically composited onto a warm neutral background before JPEG export; no identity content was generated or altered.

### W. Luiz official-site replacement

`languages/portuguese/images/creators/w-luiz.jpg` is now a 650 × 809 JPEG converted from W. Luiz's own official-site portrait at `https://wluizoficial.com.br/wp-content/uploads/2025/02/wluiz.webp`. The page `https://wluizoficial.com.br/` identifies the subject as W. Luiz, Preparador e Cientista Vocal. The former avatar-only treatment is removed.

### Non-square dataset portrait

| Exact local asset | Role | Intrinsic size / aspect | Crop recommendation | Alt-text intent | Provenance / status |
| --- | --- | --- | --- | --- | --- |
| `languages/portuguese/images/creators/alba-baptista-profile.jpg` | Alba Baptista creator card/modal portrait | 1213 × 1491 / 0.814, near 4:5 | Prefer 4:5 editorial frame; if square is unavoidable, keep face and upper torso with `object-position: 50% 42%`. | Portrait of Alba Baptista. | Dataset-backed, decoded and visually verified. This exact file is absent from `creators/SOURCES.md`; source ledger is incomplete. |

## Unsafe, unused, missing, and duplicate findings

- `languages/portuguese/images/creators/alba-baptista.jpg` is a 480 × 360 video still with letterboxing, not a creator portrait. It is unused by the dataset and must not be used for a creator card or hero. The verified portrait file is `alba-baptista-profile.jpg`.
- `languages/portuguese/images/creators/filipa-mariza.jpg` is a readable 720 × 720 portrait but is unused by the current dataset and has no entry in `creators/SOURCES.md`; keep it out of the shipped library until identity, record, and source are verified.
- `languages/portuguese/images/community/calvin-castiel.jpg`, `languages/portuguese/images/creators/alba-baptista-profile.jpg`, all playlist thumbnails, and all podcast covers lack a dedicated local image-source ledger entry. This is a documentation gap, not corruption.
- All twenty-nine portraits from the former 150 × 150 cohort now have verified replacements with a minimum dimension of at least 600px.
- No unreadable/corrupt image was found. SHA-256 comparison found no exact duplicate files across the Portuguese image tree.
- No missing image reference was found in the playlist, podcast, or creator datasets.

## Verification performed

- Decoded all 74 JPEGs under `languages/portuguese/images/` with `System.Drawing` and recorded intrinsic dimensions; repeated this check after all 29 replacements were written.
- Computed SHA-256 for all 74 files; no exact duplicates.
- Visually inspected the approved comp, all five community images, both Alba Baptista candidates, the unused Filipa Mariza portrait, all eight playlist thumbnails, all three podcast covers, and every replacement candidate. Rejected placeholder, character-still, banner, and under-resolution candidates before writing the verified set.
- Compared creator filenames against all 56 published creator records; 56 references resolve, with exactly two unused creator files identified above.
- Read `images/community/SOURCES.md`, `images/creators/SOURCES.md`, playlist data, podcast data, and creator data.
