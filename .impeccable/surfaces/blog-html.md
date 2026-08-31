---
version: 1
slug: "blog-html"
primary_target: "blog.html"
related_targets: ["index.html","css/polyglot-papers-preview.css","js/blog_main.js","js/homepage_blog_preview.js"]
---

Mode: Read. Scope: replace the visual world of blog.html and the Polyglot Papers preview inside index.html while preserving the article dataset, filtering, sorting, search, global navigation/footer loaders, article links, and homepage context.

Audience job: quickly understand what Polyglot Papers contains, identify a useful essay, narrow the archive by topic or language, and begin reading. Primary action: open a paper. Proof/content: the four real published articles and their existing local cover assets.

Chosen direction: Language Lab Foldout, approved from .impeccable/mocks/polyglot-papers-01-language-lab-foldout.png. Cobalt instruction-manual fields, compressed display type, bright paper workspace, red selection blocks, yellow inventory accents, measurement marks, and one clean featured-to-index reading path. The homepage preview folds the same selected paper into a compact band.

Memorable moment: the giant cobalt masthead folds directly into the latest-paper workspace. Constraints: no green biotech, terminal jargon, invented metrics, generic card wall, page overflow, or replacement of unrelated homepage sections.

Shipped behavior: the archive keeps one featured paper followed by numbered index rows, with real 16:9 local covers, article metadata, and destination links. Topic and language filters use accessible pressed states inside contained horizontal scrollers; search, native sorting, reset-with-focus-return, and the polite results count preserve the existing dataset behavior. Interactive controls are at least 44px high and use the yellow focus treatment.

Responsive contract: the archive becomes one column and the homepage preview stacks below 980px. At 700px and below, the masthead fold, archive heading, featured paper, index metadata, and homepage feature stack; `#polyglot-papers-preview` uses `scroll-margin-top: 76px` for the fixed shared navbar. The page never gains horizontal document overflow.

Motion and integration: the only motion is the featured paper action's arrow translation, removed by `prefers-reduced-motion`. Preserve the shared navbar and footer loaders, all real content and article links, and the compact homepage fold without changing unrelated homepage sections.
