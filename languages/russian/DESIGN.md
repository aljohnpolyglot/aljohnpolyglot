---
name: Russian Living Print Archive
description: A personal Russian-language journal built from archival print geometry, real media, and Aljohn's documented learning history.
colors:
  paper: "#e6d8be"
  paper-light: "#f3ead7"
  paper-dark: "#cbbb9e"
  ink: "#000002"
  oxidized-red: "#932317"
  oxidized-red-deep: "#68150f"
  archive-teal: "#124249"
  registration-mustard: "#dab680"
typography:
  display:
    fontFamily: "Unbounded, Arial Black, sans-serif"
    fontSize: "clamp(2.2rem, 4.5vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.06em"
  title:
    fontFamily: "Unbounded, Arial Black, sans-serif"
    fontSize: "clamp(1.45rem, 2.15vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "PT Sans, Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Unbounded, Arial Black, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  square: "0px"
  registration-circle: "50%"
spacing:
  xs: "8px"
  sm: "14px"
  md: "18px"
  lg: "24px"
  xl: "42px"
  section: "74px"
components:
  action-primary:
    backgroundColor: "{colors.oxidized-red}"
    textColor: "{colors.paper-light}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "18px 20px"
  creator-card:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0 0 18px"
  chapter-navigation:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-light}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    height: "54px"
---

# Design System: Russian Living Print Archive

## Overview

**Creative North Star: "The Living Print Archive"**

This surface treats archival constructivist print as editorial grammar rather than political messaging. Oversized Cyrillic type, numbered ledgers, paper fields, registration marks, and hard ink rules organize Aljohn's real conversations, videos, and learning history. The mood is tactile, direct, and personal: a working language journal, not a themed costume.

The Russian page remains its own world inside the shared site. It keeps the global navbar and accessibility behavior, then introduces a compact chapter bar and a Russian-native narrative. Real media carries documentary meaning; CSS supplies atmosphere. Political symbols, leaders, military imagery, flags, state slogans, and invented documentary scenes do not belong.

**Key Characteristics:**

- Square, rule-bound composition with decisive red, teal, and mustard fields.
- Russian-first copy and real Aljohn media before discovery content.
- One dominant media action at a time: featured player, snap reel, or modal sample.
- Restrained motion that reads like print registration and disappears under reduced-motion preferences.

## Colors

Warm paper neutrals hold the page together while oxidized red, archive teal, and registration mustard act as ink plates.

### Primary

- **Oxidized Red:** the main statement ink for diagonal fields, active actions, and chapter emphasis.
- **Deep Oxidized Red:** hover and pressed depth for red actions.

### Secondary

- **Archive Teal:** contrast panels, supporting actions, and the closing field.

### Tertiary

- **Registration Mustard:** numbered states, active labels, focus support, and rare high-visibility accents.

### Neutral

- **Archive Paper:** the default page field.
- **Light Archive Paper:** readable cards, copy panels, and modal surfaces.
- **Dark Archive Paper:** quiet tracks and inactive material depth.
- **Printer's Ink:** primary type, hard rules, dark media fields, and the playlist chapter.

**The Four-Plate Rule.** Red, teal, mustard, and black each need a job; do not scatter them as interchangeable decoration.

## Typography

**Display Font:** Unbounded (with Arial Black and sans-serif fallbacks)
**Body Font:** PT Sans (with Arial and sans-serif fallbacks)

**Character:** Unbounded gives Cyrillic headings the wide, engineered pressure of a poster press. PT Sans stays familiar and highly legible across long Russian paragraphs, captions, and modal descriptions.

### Hierarchy

- **Display** (800, fluid 2.2–5.5rem, 0.98): chapter statements and major section titles.
- **Title** (700, fluid 1.45–2.6rem, 1.08): hero thesis, featured items, and modal names.
- **Body** (400, 1.05rem, 1.55): narrative copy, creator descriptions, and notes; keep paragraphs near 64ch.
- **Label** (700, 0.68rem, 0.12em tracking, uppercase): archive numbers, chapter labels, controls, and stamps.

**The Wide-Type Rule.** Unbounded is for hierarchy and navigation, never for long prose.

## Layout

The page uses a 1680px outer ceiling and 1500px content ceiling with fluid horizontal padding. Desktop begins with a compact 500–560px poster field so the 60/40 video worktable enters the first viewport beneath the two navigation layers. Editorial spreads use asymmetric two-column grids; learning stages use three equal rule-bound columns.

At 900px, dense split layouts stack, the player and ledger become one vertical worktable, and the story spread becomes sequential. At 640px, chapter navigation scrolls horizontally, shelves use roughly 78vw cards, and modal content becomes a single compact reading surface. Every horizontal track owns its overflow, snap behavior, and minimum-width safety; the document never scrolls sideways.

## Elevation & Depth

The system is flat by default. Depth comes from material overlap and offset solid-ink shadows rather than diffuse glass or ambient card shadows. The hero copy, immersion manifesto, creator hover, and modal may use a hard 7–14px offset plate; ordinary surfaces stay on the paper field.

**The Printed-Plate Rule.** A shadow must look like a second ink plate with a clear purpose; soft floating-card shadows are out of character.

## Shapes

Frames, buttons, cards, media windows, and dialogs are square. One- to three-pixel rules define joins and section splits. Circles are reserved for registration marks and inherited profile identities, not general controls. Diagonal geometry belongs to large statements, never to body-copy containers.

## Components

### Buttons

- **Shape:** square with a 2px ink rule.
- **Primary:** oxidized red field, light paper text, and compact Unbounded label type.
- **Hover / Focus:** hover deepens the ink; keyboard focus uses a 4px mustard outline with 4px clearance.
- **Secondary:** archive teal or a transparent ink field depending on the surrounding plate.

### Cards / Containers

- **Corner Style:** square.
- **Background:** light paper for reading, dark ink for media-led modules.
- **Shadow Strategy:** none at rest; a hard red offset plate may appear on creator-card hover.
- **Border:** 2px printer's ink.
- **Internal Padding:** 18–42px according to reading density.

### Navigation

The shared global navigation remains untouched. The Russian chapter bar sits below it, uses an ink field, keeps a mustard chapter mark, and centers its chapter links between the archive mark and channel action on wide screens. At compact widths the link rail becomes independently horizontally scrollable without covering the global bar or widening the page. Active destinations receive a short red underline rather than a filled pill.

### Playlist Ledger

The personal playlist is a numbered vertical register attached to the featured player. The active row inverts to light paper and updates the player in place. Thumbnails are real local 16:9 assets; numbering and duration remain HTML text.

### Reel Strip

The Facebook field notes show one centered vertical 9:16 card per full-width snap point. Touch, trackpad, scrollbar, arrow buttons, and a live position counter all operate the same track. The strip, never the page, owns horizontal overflow.

### OpenRussian Workbench

The dictionary chapter is a compact blue-and-paper workbench within the archive system. Its instant Cyrillic typeahead, contained keyboard, direct word lookup, and official resource routes are practical controls rather than decorative replicas. The keyboard may scroll inside its own frame on narrow screens; it must never widen the document.

### Russian Bookshelf

The bookshelf reuses the canonical project book records and cover assets while giving each title Russian-native reading guidance and its own accessible page modal. The shelf is deliberately open-ended: current public-domain titles establish the module, but the heading and component language remain broad enough for later genres and contemporary additions.

### Creator Dialog

The dialog uses a square light-paper reading surface over an ink backdrop, a visible red × button, an internal scroll region, a separate Aljohn note, a playable sample, and verified external actions. Escape, backdrop close, focus trapping, body lock, and focus restoration are mandatory.

### Creator Shelves and CEFR Filter

The creator library keeps language, children’s media, sport, public personalities, culture, and food in independent horizontal shelves. Athletes curated chiefly through competition, training, or sport media remain in sport; actors, presenters, entertainers, and life-led public figures use the separate `Личности и публичные голоса` shelf. A visible square-button CEFR rail sits above them and defaults to the full collection; selecting a level filters cards inside each shelf and removes only shelves with no matching record. The filter never flattens categories or exposes private ranking and activity data. Athlete and personality cards follow the same complete modal contract as channel cards: a local portrait, specific Russian biography, listening range, playable public sample, and verified official destinations.

## Do's and Don'ts

### Do:

- **Do** lead with Aljohn's first-person Russian story and real playable media.
- **Do** keep the global navbar and the Russian chapter bar independently visible.
- **Do** use local documentary imagery and embed provenance in every shipping raster.
- **Do** keep horizontal media and creator tracks contained, labelled, and keyboard reachable.
- **Do** preserve visible focus, reduced motion, and square close controls.

### Don't:

- **Don't** use hammer-and-sickle motifs, political stars, leaders, soldiers, flags, military imagery, or state slogans.
- **Don't** recolor another language page and call it Russian.
- **Don't** turn every panel into a floating card, rounded pill, or decorative stamp.
- **Don't** invent a personal note when Aljohn has not supplied one; keep the pending state honest.
- **Don't** let generated imagery stand in for a real person, place, meeting, or collaboration.
