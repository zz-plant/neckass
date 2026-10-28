# AGENTS Instructions

## Mission
Maintain a static, browser-first daily newspaper about one man: one
deterministic issue per day, no build pipeline, no backend, minimal
complexity. The front page is the product.

## Critical references
- `SPECIFICATIONS.md` is the source of truth for UI/UX and accessibility behavior.
- `DEVELOPMENT.md` covers architecture and local validation flow.
- `CONTRIBUTING.md` defines contributor expectations/checklists.

## Project layout (current)
- `index.html` — the front page: a complete standing issue in the markup,
  and one `<script type="module">` whose import graph is the dependency
  chain.
- `styles.css` — all visual/layout styling, including the inlined cuts' and print.
- `data/` — the pools (`formats.js`, `headlines.js`), the landmark issues (`editions.js`), the calendar (`calendar.js`), when the pools grew (`growth.js`), the file cut's poses (`poses.js`) and what it can be drawn among (`scenes.js`). Plain ES modules, imported by both the browser and the edge.
- `modules/issue.js` — the issue arithmetic and composition, shared by both runtimes; `modules/calendar.js` — matches dated items; `modules/front-page.js` — renders the front page; `modules/archive-list.js` — the archive.
- `worker.js` — the Cloudflare Worker's entry: routes the feed and the card to their handlers in `functions/` and runs the middleware in front of them and the front page. `wrangler.jsonc` configures it.
- `functions/` — the edge handlers, written as Pages Functions and imported by `worker.js`: the feed, the social card, the middleware; `lib/issue.mjs` is a UTC adapter over `modules/issue.js`, `lib/card.mjs` holds the card layout and its one renderer.
- `.assetsignore` — an allowlist: the repository root is the Worker's assets directory, and only the files it lets back in are published. A new top-level directory the pages load from has to be added to it; the smoke suite fails if a page names a file the edge does not serve.
- `assets/cuts/` — the line-cuts, posable through CSS custom properties. See `assets/cuts/README.md`. The file cut has three copies (the rig, the front page's inline one, `functions/lib/cut.mjs`); the figure in all three is drawn by `scripts/draw-cut.ts`, so change it there and run `bun run cut:draw`. The smoke test checks that the copies agree.
- `fonts/` — Fraunces: variable woff2 for the page, two static TTFs for the card.

## Change priorities
1. Preserve spec-compliant behavior and accessibility.
2. Prefer small, targeted edits over broad refactors.
3. Keep no-build/static-host compatibility: the browser and edge import the same ES modules; no bundler.
4. Keep the paper's voice: flat, specific, past tense, sourced like a wire story, numbers and names, no adjectives where a fact will do.

## Local testing
- `bun run serve` (static, :8001); the pages are ES modules, so open them over HTTP.
- With the edge: `bun run edge` (the Worker under `wrangler dev`, :8800).
- `bun run lint`, `bun run assets:check`, `bun run test:smoke` before merge.

## When changing content
- A lead needs all eight fields: headline, deck, byline, pose, correction, followUp, classified, letter. The pose is a key of `data/poses.js`: what he is doing in the story, as the file cut can show it. A lead may also name a scene, keys of `data/scenes.js`: what the story happens among, as props the cut can hold or stand in front of. One or two; the box does not take more.
- Dated items go on the calendar, not in the pools.
- Set quotation marks and apostrophes curly (“ ” ’) in anything a reader sees. The smoke suite fails on a straight one.
- Pool items are keyed by number and dealt by it. Edit an item in place. To add one, give it the next number and add a step to `data/growth.js` at an issue that has not run yet; to drop one, retire its number in a step. Never renumber or delete an item: the back issues ran it, and the entry cites them.
- Regenerate the still cards after changing the card layout or copy: `bun run og:generate`.

## When changing visible UI
- Capture a screenshot with available browser tooling.

## Guardrails
- The paper is not placed anywhere: no town name, no named streets or
  roads, no dateline, no civic notices. It is The Gazette, and it covers
  one man.
- Do not add inline scripts for behavior changes.
- Do not add input handling to the front page. It is a paper.
- Avoid introducing dependencies for straightforward DOM work.
