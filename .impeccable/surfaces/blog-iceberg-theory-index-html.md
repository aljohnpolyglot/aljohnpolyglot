---
version: 1
slug: "blog-iceberg-theory-index-html"
primary_target: "blog/iceberg-theory/index.html"
related_targets: ["blog/iceberg-theory/css/iceberg-theory.css","blog/iceberg-theory/js/iceberg-theory.js"]
---

# Polyglot Papers — Iceberg Theory

## Mode

Read. The reader should understand Aljohn's argument, feel the distance between tested fluency and cultural belonging, and continue into his own media world.

## Audience and job

Language learners who currently measure progress through levels, plus viewers confused by the dense cultural references in Aljohn's videos. The page must make the theory graspable in one scroll without flattening its provocation or its Filipino examples.

## Content truth

The supplied essay and five supplied iceberg graphics are visual-reference material only. Ten levels descend through Survival, Functional, Mastery, Code, Action, Shared World: Factual, Shared World: Narrative, Nostalgia, Expertise, and Unspoken Code. Aljohn's first-person voice stays primary. The model is presented as a conceptual compass rather than a validated scale: depth is non-linear, culture is plural, and CEFR remains useful for the assessment job it was designed to do. The shipped interactive diagram must be code-native and contain no stock or photographic imagery.

## Chosen direction

“The Deep Route”: a literal moving iceberg crossed with the vernacular of a Filipino jeepney route-board. Candidate 6, concept seed `db315b9e`. Approved comp: `.impeccable/mocks/iceberg-comp-a.png`. The user's clarification delegated composition but fixed the non-negotiable: the page itself must behave like the infographic.

## Memorable moment

The first wheel/touch movement crosses a bright, physical waterline. The sky collapses into underwater blue; the same continuous iceberg slides upward; the route light moves from Level 3 to Level 4; the argument changes from language mechanics to cultural membership.

## Implementation fidelity inventory

- Component grammar: one continuous sticky visual chamber, a pre-dive CEFR comparison and three-band map, ten long-form depth stops with native expandable field notes, a jeepney route rail, painted route plaques, documentary bands, and a final surfaced essay. No card grid.
- Color: near-black `#06101a`, surface blue `#168fc8`, submerged cobalt `#063f72`, trench `#020711`, signal red `#c83725`, route yellow `#f4b51e`, ice `#e9f7fb`.
- Type: self-hosted Barlow Condensed for painted display lettering; Barlow for readable editorial text.
- Media: one inline, code-native SVG iceberg supplies all ten individually focusable and clickable strata. The supplied infographic PNGs inform the hierarchy and proportions but do not appear in the page. Aljohn's supplied CEFR-versus-Iceberg Drake meme appears once as an editorial interlude before the dive.
- Motion: scroll progress translates the continuous strata and waterline; active text and route stop update with IntersectionObserver; reduced-motion preserves the entire reading order without transforms.
- Semantics: all ten levels are structured HTML with headings, descriptions, examples, and accessible anchor navigation. The imagery is supportive, never the only copy.
- Editorial primer: the CEFR comparison is centered in a restrained reading column, with the heading and explanation in one continuous sequence before the table. Its hierarchy supports long-form reading rather than resembling separate social-post slides.

## Constraints

Reuse shared navbar/footer loaders. Keep article CSS, JS, data, and images folderized. Preserve keyboard access and `prefers-reduced-motion`. Do not expose private evidence. Do not modify unrelated dirty-worktree files.
