# AGENTS.md

## Project rules captured from ongoing French page work

- When working on `languages/french/`, follow the existing folderized patterns used by `languages/spanish/` and `languages/swedish/`.
- Keep French page assets separated:
  - page styles belong in `languages/french/css/`
  - page logic belongs in `languages/french/js/`
  - prefer `languages/french/js/data/` for datasets and `languages/french/js/renderers/` for page render logic
  - playlist/data files should live in dedicated JS data files rather than large inline blobs
  - avoid large inline CSS/JS inside `languages/french/index.html`

- The French page should combine:
  - Swedish-page strengths: more personal storytelling and narrative framing
  - Spanish-page strengths: playable video playlists, modular resource cards, and library-style shelves

- Prefer real project references over placeholders whenever French assets already exist in the repo.
  - Alliance Francaise de Manille
  - Alliance Francaise de Cebu
  - Saging Ca Va?
  - French Embassy / French Film Festival assets

- Playlist rule:
  - use a real featured video player plus a clickable playlist list
  - do not use a generic playlist embed when a Spanish-style player/list module is expected
  - keep playlist data in separate JS data files

- French playlist curation rule:
  - remove unrelated New Zealand Ambassador clips from the French playlist unless the user explicitly asks to keep them
  - do not include private videos in the clickable playlist UI

- Extra French rule:
  - treat `Extr@` as its own playlist/resource module rather than burying it in generic content

- Layout rule:
  - do not make the page feel compressed or cramped
  - keep generous spacing, readable line lengths, and strong visual separation between major sections
