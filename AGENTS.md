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
- `data/` — the pools (`formats.js`, `headlines.js`), the landmark issues (`editions.js`), the calendar (`calendar.js`). Plain ES modules, imported by both the browser and the edge.
- `modules/issue.js` — the issue arithmetic and composition, shared by both runtimes; `modules/calendar.js` — matches dated items; `modules/front-page.js` — renders the front page; `modules/archive-list.js` — the archive.
- `functions/` — Cloudflare Pages Functions: the feed, the social card, the middleware; `lib/issue.mjs` is a UTC adapter over `modules/issue.js`, `lib/card.mjs` holds the card layout and its one renderer.
- `assets/cuts/` — the line-cuts, posable through CSS custom properties. See `assets/cuts/README.md`.
- `fonts/` — Fraunces: variable woff2 for the page, two static TTFs for the card.

## Change priorities
1. Preserve spec-compliant behavior and accessibility.
2. Prefer small, targeted edits over broad refactors.
3. Keep no-build/static-host compatibility: the browser and edge import the same ES modules; no bundler.
4. Keep the paper's voice: flat, specific, past tense, numbers and names, no adjectives where a fact will do.

## Local testing
- `bun run serve` (static, :8001); the pages are ES modules, so open them over HTTP.
- With the edge: `bun run edge` (Pages Functions, :8800).
- `bun run lint`, `bun run assets:check`, `bun run test:smoke` before merge.

## When changing content
- A lead needs all seven fields: headline, deck, byline, correction, followUp, classified, letter.
- Dated items go on the calendar, not in the pools.
- Regenerate the still cards after changing the card layout or copy: `bun run og:generate`.

## When changing visible UI
- Capture a screenshot with available browser tooling.

## Guardrails
- Do not add inline scripts for behavior changes.
- Do not add input handling to the front page. It is a paper.
- Avoid introducing dependencies for straightforward DOM work.
