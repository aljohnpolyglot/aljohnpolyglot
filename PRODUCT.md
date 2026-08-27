# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is French learners, especially people learning and practising French in the Philippines, together with viewers following Aljohn Polyglot's language-learning journey. Aljohn is the curator and first-person narrator.

Visitors use the French page to discover videos, creators, cultural centres, community groups, events, and practical next steps connected to a real Filipino francophone experience.

## Product Purpose

`Mon coin français` is Aljohn's public personal notebook for French. It brings together his own videos, the creators he genuinely follows, and the places and communities that made French part of his life in Manila and Cebu.

Success means a visitor can understand Aljohn's relationship with French and leave with one concrete, trustworthy way to watch, practise, visit, or meet people.

## Positioning

This is not a comprehensive directory or an automatically generated catalogue. Its value comes from first-person curation grounded in Aljohn's actual viewing history, followed accounts, videos, Facebook reels, language-learning rituals, and in-person experiences in the Philippines.

## Operating Context

The page connects several parts of Aljohn's French life: his YouTube playlist and channel, his Star Academy viewing ritual, Alliance Française de Manille and de Cebu, Saging Ça Va ?, the French Embassy and French Film Festival, community meetups at Crêpe Glazik, and other resources he has personally used.

The experience must work as a public website on desktop and mobile. Visitors can watch featured videos, browse creator categories, open creator details, follow external source links, explore photo albums, and enlarge photographs in a full-screen lightbox.

## Capabilities and Constraints

- Preserve the existing static Vite multi-page architecture and the established `languages/french/` separation for HTML, CSS, logic, datasets, renderers, and local assets.
- Keep creator shelves grouped by meaningful categories rather than mixing category labels into combined rows.
- Creator cards lead with a real profile image, name, category, and suggested CEFR range. Their modal supports a description, Aljohn's editable personal comment, guidance, a sample video, and external links.
- Photo albums use local images, honest captions, keyboard-accessible full-screen viewing, and responsive horizontal browsing when a collection is large.
- Playlist modules use a real featured player with a clickable list. `Extr@` remains its own resource module.
- Do not add catalogue statistics, generic filler, invented personal attachment, private videos, unrelated clips, or expiring signed Instagram image URLs.
- Keep supplied Facebook reel URLs exact when a canonical page URL is not verified. Aljohn's official YouTube channel is `https://www.youtube.com/@aljohnpolyglot`.

## Brand Commitments

The product name is `Mon coin français`, presented as part of Aljohn Polyglot's personal website. The voice is French, first-person, warm, specific, and grounded in lived experience. The page must remain recognisably francophone while avoiding decorative clichés and generic AI-generated catalogue language.

Personal curation made with taste, memory, and heart is a binding identity constraint. Neutral descriptions and Aljohn's personal comments must remain distinct, editable, and honest about the evidence available.

## Evidence on Hand

- Aljohn's official YouTube channel and French playlist, including local playlist data under `languages/french/js/data/`.
- Facebook reels supplied directly by Aljohn for Star Academy, the French Film Festival, and a linguistic meetup at Crêpe Glazik.
- Local photographs and logos for Alliance Française de Manille, Alliance Française de Cebu, Saging Ça Va ?, Embassy and festival events, and community meetups.
- A dedicated French creator dataset with local profile images, channel descriptions, CEFR guidance, source links, and editable personal comments.
- Existing Spanish, Swedish, and Cebuano/Bisaya pages as information-architecture references, not as a visual identity to copy.

No unsupported testimonial, personal relationship, viewing claim, attendance claim, or recommendation reason may be fabricated.

## Product Principles

1. Personal evidence outranks exhaustive coverage.
2. Every resource should lead to a meaningful action: watch, practise, visit, or meet.
3. Aljohn's story and the visitor's ability to browse must reinforce each other without competing.
4. Specific descriptions, source links, photographs, and comments should make the collection feel human rather than generated.
5. Generous spacing and clear grouping should keep a content-rich page calm and usable.

## Accessibility & Inclusion

Interactive cards, filters, playlists, modals, and lightboxes must remain usable with keyboard and touch, expose clear accessible names, preserve visible focus, restore focus after dialogs close, and include meaningful alternative text for images. Responsive layouts must avoid clipped controls and unreadably dense content.
