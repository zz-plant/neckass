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
- `index.html` — the front page: a complete standing issue in the markup, and the script order, which is the dependency graph.
- `styles.css` — all visual/layout styling, including the inlined cuts' and print.
- `data/` — the pools (`formats.js`, `headlines.js`), the landmark issues (`editions.js`), the calendar (`calendar.js`).
- `modules/issue.js` — composes an issue from a date; `modules/calendar.js` — matches dated items; `modules/front-page.js` — renders; `modules/archive-list.js` — the archive.
- `functions/` — Cloudflare Pages Functions: the feed, the social card, the middleware, and the mirrored issue arithmetic in `lib/`.
- `assets/cuts/` — the line-cuts, posable through CSS custom properties. See `assets/cuts/README.md`.
- `fonts/` — Fraunces: variable woff2 for the page, two static TTFs for the card.

## Change priorities
1. Preserve spec-compliant behavior and accessibility.
2. Prefer small, targeted edits over broad refactors.
3. Keep no-build/static-host compatibility.
4. Keep the paper's voice: flat, specific, past tense, numbers and names, no adjectives where a fact will do.

## Local testing
- Default: open `index.html` directly.
- With HTTP: `bun run serve` (static, :8001); `bun run edge` (Pages Functions, :8800).
- `bun run lint`, `bun run feed:check`, `bun run test:smoke` before merge.

## When changing content
- A lead needs all seven fields: headline, deck, byline, correction, followUp, classified, letter.
- After editing leads or landmarks, run `bun run feed:build`.
- Dated items go on the calendar, not in the pools.

## When changing visible UI
- Capture a screenshot with available browser tooling.

## Guardrails
- Do not add inline scripts for behavior changes.
- Do not add input handling to the front page. It is a paper.
- Avoid introducing dependencies for straightforward DOM work.
