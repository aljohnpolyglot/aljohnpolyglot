# Polyglot Papers — Spaced Repetition

## Direction contract

- **Selected direction:** Memory Forest (`spaced-repetition-03-memory-forest.png`)
- **Premise:** Vocabulary behaves like a living forest. Recall strengthens roots; missed reviews expose weak growth without punishing the learner.
- **Visual language:** deep botanical black-green, chlorophyll green, soil brown, field-note cream, coral review pulses, hard rules, tree-ring notation, and condensed editorial type.
- **Composition:** a decisive forest-observatory hero; a scroll-driven memory nursery; cream editorial explanations; generated lifecycle sprite art; and the original WIP tree art presented as a single-stage field specimen rather than a card grid.
- **Interaction:** scrolling advances one neutral example word through reviews on days 1, 3, 7, 14, and 30; scrolling upward reverses the same sequence. A separate missed-review case decays and restores with the reader's position.
- **Motion:** short sprite-frame growth and decay, review pulses, and one top-down scale transition. No looping ambience, parallax, canvas, gradients, glass, rounded app UI, or decorative motion without state meaning.
- **Truth constraints:** no invented user totals or performance claims. The experience is an explanatory simulation, not a spaced-repetition program or data-entry tool.
- **Responsive behavior:** forest and timeline split on wide screens and stack on narrow screens; sticky stories become static end states for reduced motion; the document never overflows horizontally.
- **Accessibility:** semantic article structure, descriptive SVG titles, visible focus, live status, non-color timeline labels, and reduced-motion support.

## Approved comp inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Global navigation | Existing shared white Aljohn navbar | Shared template loader |
| Hero copy | Monumental two-tone condensed headline with one coral planting action | HTML/CSS |
| Growth specimen | Three generated lifecycle stages rising above a shared soil cutaway | Transparent Sprite Forge frames + inline SVG roots |
| Root network | Visible roots and coral review nodes | Inline SVG |
| Living forest | One word visibly maturing through six frames | Transparent Sprite Forge frames + native JavaScript |
| Review timeline | Six labeled moments plus a 30-day calendar synchronized with tree growth | HTML/CSS + native JavaScript |
| Missed-review case | Reversible decay from healthy canopy to a dormant bare tree | Transparent Sprite Forge frames + scroll progress |
| Vocabulary scale | Drone-view canopy expands from one word to one representative working vocabulary | Transparent Sprite Forge frames + scroll progress |
| Original tree art | One image at a time with literal previous/next controls | Existing local raster carousel |
| Archive thumbnail | Approved Memory Forest comp | Local raster copied from approved comp |

Approval: Aljohn selected `spaced-repetition-03-memory-forest.png` after seeing all three directions. Direction seed: `df9ad045`; form position: 3.

The twelve-frame lifecycle sheet and four-frame aerial forest sheet were generated with built-in ImageGen, converted to transparent local frames by the installed Agent Sprite Forge processor, checked for complete non-empty output frames, and stored as local PNGs with embedded prompt provenance. Raw working sheets and QC metadata remain private under `local-data/`.

## Motion thesis

- **Focal moment:** vertical travel is elapsed review time; scrolling forward strengthens a word and scrolling backward visibly restores the earlier memory state.
- **Continuity:** the same botanical grammar carries successful recall, missed recall, and the aerial language-scale view.
- **Feedback:** the active day, caption, lifecycle frame, missed-review state, and forest-scale label update together.
- **Budget:** one requestAnimationFrame scroll coordinator; discrete local sprite swaps plus transform and opacity only; no dependency, loop, canvas, or layout animation.
