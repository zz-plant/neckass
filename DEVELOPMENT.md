# Development Guide

This guide is for maintainers, contributors, and coding agents changing implementation details.

## Local development
- No build step required.
- Primary flow: open `index.html` in a modern browser.
- If your tooling requires HTTP (screenshots/automation):

```bash
bun run serve
```

Then open `http://127.0.0.1:8001/`. The edge functions — the feed, the
card, the middleware — only run under workerd:

```bash
bun run edge
```

serves the same tree through `wrangler pages dev` on `http://127.0.0.1:8800/`.

## Why the data files are classic scripts, not JSON or ESM

`data/*.js` are IIFEs that assign onto `window.Neckass.data`, and every module
is a plain `<script defer>` rather than an ES module. This is deliberate, and
it buys one thing: **the site opens from `file://`**. Nothing in the browser
path calls `fetch`, so `open index.html` works with no server. JSON data would
need a fetch and ESM needs a module graph; both are blocked by CORS on
`file://`, and both would break that.

The cost is paid in three places, and it is the price of that feature:

- Load order in `index.html` *is* the dependency graph. A module that reads
  `Neckass.foo` must be listed after the one that assigns it.
- The Workers runtime cannot read an IIFE that assigns to `window`, and it
  forbids `eval`, so `scripts/build-feed-data.ts` runs `data/formats.js` and
  `data/editions.js` in a `node:vm` sandbox at build time and writes
  `functions/lib/leads.mjs`. Run `bun run feed:build` after editing leads or
  landmarks; `bun run feed:check` fails on drift.
- `functions/lib/issue.mjs` hand-mirrors the epoch, the RNG, the round
  dealing and the landmark lookup from `modules/issue.js`. The smoke test
  *worker and browser agree on the lead for a given issue* pins the two
  together across six dates, one of them a landmark, and will fail if either
  side moves.

If `file://` support is ever dropped, all three costs go with it: the data
becomes JSON, both runtimes import it, and the sandbox, the generator, the
check and the drift test are all deleted.

## Architecture overview

### The front page
`index.html` loads, in this order, and the order is the dependency graph:

1. `data/headlines.js` — the briefs pool (`data.HEADLINES`).
2. `data/formats.js` — every other pool: `LEADS` (each with deck,
   correction, follow-up, classified, letter), `CORRECTIONS`,
   `ROUTINE_CORRECTIONS`, `NOTICES`, `WEATHER`, `CLASSIFIEDS`, `LETTERS`,
   `COLOPHON`.
3. `data/editions.js` — the landmark issues, keyed by number.
4. `data/calendar.js` — what runs on which day.
5. `modules/calendar.js` — matches the calendar against a date.
6. `modules/issue.js` — composes an issue from a date. `selectLead` is pure
   in the issue number, so any issue can name any other issue's lead; that
   is what lets today correct and continue yesterday.
7. `modules/front-page.js` — swaps the standing issue in the markup for the
   composed one, sets the title, the weather cut's layers, the map's rings,
   the editorial, the clipping link and the back-issue notice.

There is no bootstrap, no state, no storage and no input handling. The page
ends when `front-page.js` has rendered.

### The archive
`archive.html` loads the same data and `modules/issue.js`, then
`modules/archive-list.js`, which lists the whole run from
`issue.recentIssues()`.

### Data and assets
- `data/` — see above. Pool sizes are load-bearing; see the comments in
  `data/formats.js`.
- `assets/cuts/` — line-cuts for the paper. Each is a rig: its joints and
  layers are CSS custom properties with fallbacks, so the files work as plain
  `<img>` and pose when inlined. The weather cut and the map are inlined in
  `index.html`; `assets/cuts/README.md` lists every property.
- `fonts/` — Fraunces as a variable woff2 for the browser, and two static
  TrueType cuts for the card renderer at the edge.

### Edge
- `functions/feed.xml.js` — RSS for the last 30 issues, per request.
- `functions/card.png.js` — the issue's social card, drawn with `workers-og`.
- `functions/_middleware.js` — per-issue title, description and image tags
  on the front page.
- `functions/lib/issue.mjs` — the issue arithmetic, mirrored from
  `modules/issue.js`; `functions/lib/leads.mjs` — generated.

## Source-of-truth hierarchy
1. `SPECIFICATIONS.md` for user-facing behavior and accessibility.
2. Existing in-code behavior for non-specified edge handling.
3. Contributor/maintainer docs (`README`, `CONTRIBUTING`, this file).

## Validation checklist (manual)
1. Today's issue renders whole: lead, seven briefs, three notices, four
   corrections, weather, five classifieds, two letters, the map, the colophon.
2. `/?issue=2024-09-29` is the first edition, with its editorial and one
   correction; `/?issue=2026-09-29` is the second anniversary.
3. The first brief continues yesterday's lead and the second correction
   retracts a detail of it.
4. The map's rings match what the notices and letters name.
5. `bun run edge`, then `/card.png` is a PNG of today's lead and `view-source:/`
   carries `og:image` pointing at it.
6. Print preview: ink on white, two columns, no site links.
7. Layout remains usable across small and wide viewports, in both themes.

## Smoke test harness
```bash
bun install
bun run test:smoke
```

Playwright starts `bun run serve` and `bun run edge` itself. The suite covers
what a reader opens (the issue, a back issue, the archive, no-JS), the
arithmetic (the corrections chain, the calendar, the landmarks, no repeats
inside a round, both runtimes agreeing) and the edge (the feed, the card, the
rewritten tags).

## UI change requirements
- Include screenshot(s) for visible changes.
- Keep the regions labelled and the inline cuts `aria-hidden`.
- Avoid introducing motion or transitions that reduce readability/accessibility.

## Change strategy
- Prefer incremental edits over broad rewrites.
- Content changes go in `data/`; a new kind of thing on the page goes in
  `modules/issue.js` (composition) and `modules/front-page.js` (rendering),
  in that order.
- Preserve static-host/no-build compatibility.

## Analytics

Not wired in code, and it should not be: Cloudflare Web Analytics is enabled
for a Pages project from the dashboard (Web Analytics → the project → enable),
which injects the beacon at the edge. It is cookieless and collects no
personal data, so it does not compromise the site's privacy stance, and doing
it in the dashboard avoids committing a site token.

Until it is switched on there is no measurement of whether the daily issue
brings anyone back, which is the one assumption the whole format rests on.
