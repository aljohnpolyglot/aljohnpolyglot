# Tagalog Surface Brief

## Approval

- Approved comp: `.impeccable/mocks/tagalog-rebuild-02-route-board-editorial.png`
- Mode: experience
- Build path: comp-led

## Direction contract

- **THESIS:** Aljohn's Tagalog archive behaves like a Manila jeepney route-board wall: destination lettering establishes the story, while the real Jared/Ryan and Koli videos remain the functional center.
- **OWN-WORLD:** Warm varnished wood, matte black hand-painted destination boards, locally hosted Barya Lang Po Sa Umaga lettering, bright lime, hot pink and orange paint, restrained cream tickets, chrome framing and visible fasteners.
- **STORY:** Choose a route, meet Jared and Ryan through the 24-hour challenge, continue to Koli's interview, then move into companions and next routes.
- **FIRST VIEWPORT:** A left destination index, stacked Tagalog headline boards, one large 16:9 featured player, and three full-frame playlist tickets visible without thumbnail cropping.
- **FORM:** User-approved Route-Board Editorial comp; direction seed `753cfad8`.

## Fidelity inventory

| Ingredient | Medium | Binding detail |
| --- | --- | --- |
| Shared global navigation | Existing canonical loader | Remains white and unchanged above the local page world. |
| Left route index | Semantic HTML/CSS | Narrow black board, one active cream route, collapses to horizontal scroller on mobile. |
| Headline boards | Semantic HTML/CSS + generated painted texture | Large lime `SAKAY SA TAGALOG`, hot-pink companion board, slight physical rotation, no rasterized UI text. |
| Wood ground | Generated `jeepney-wood.webp` | Covers the Tagalog surface at full opacity; no CSS imitation texture. |
| Featured video | Real YouTube embed + CSS chrome | Dominant 16:9 player; no synthetic people or screenshot substitute. |
| Playlist tickets | Semantic controls + validated local thumbnails | Exactly three entries; every thumbnail uses `object-fit: contain` and preserves the complete frame. |
| Black sign material | Generated `painted-signboard.webp` | Repeated on destination boards and labels beneath semantic text. |
| Chrome, bolts and ticket edges | CSS/SVG geometry | Responsive framing only; no core UI text baked into imagery. |
| Motion | CSS | One route-selection movement; removed under reduced motion. |

## Component grammar

- Square or lightly clipped ticket corners; no generic rounded cards or pills.
- Heavy painted display lettering contrasts with readable Archivo body copy.
- Thick black boards and cream paper tickets carry structure; chrome is reserved for the featured player.
- Desktop is intentionally asymmetric. Mobile becomes one reading column with the route index as a contained horizontal strip.
