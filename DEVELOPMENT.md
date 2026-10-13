# Development Guide

This guide is for maintainers, contributors, and coding agents changing implementation details.

## Local development
- No build step required.
- Primary flow: `bun run serve`, then open `http://127.0.0.1:8001/`. The
  browser code is ES modules, so the pages are served over HTTP.

The edge functions — the feed, the card, the middleware — only run under
workerd:

```bash
bun run edge
```

serves the same tree through `wrangler dev` on `http://127.0.0.1:8800/`, with
the assets `.assetsignore` lets through and the Worker in front of them, as
production runs it.

## Why the code is ES modules, shared by both runtimes

`data/*.js` and the issue arithmetic are plain ES modules. The browser loads
them through one `<script type="module">` per page, whose import graph is
statically analyzed; the edge handlers import the same files directly.
There is one copy of each pool and of the lead-selection arithmetic, so the
feed and the card cannot drift from the page: they run the same code by
construction.

This shape was chosen over the earlier one (classic scripts assigning onto
`window`, with a generated copy of the leads and a mirrored copy of the
arithmetic for the edge). That layout existed to let the site open from
`file://`; it cost a build-time extraction script (`scripts/
build-feed-data.ts`), a generated data file (`functions/lib/leads.mjs`), a
drift check, and a test that pinned the mirror. Dropping `file://` support
removed all of it. If you need to open a page from disk, run `bun run serve`
first.

The one intentional difference between the runtimes is the clock: the
browser composes issues on the reader's local date, so the masthead matches
the paper on their table; the edge runs on UTC, the only clock a Worker has.
`modules/issue.js` holds the runtime-agnostic arithmetic (the epoch, the
RNG, the round dealing, landmark lookup); `functions/lib/issue.mjs` is a
thin adapter that applies it to UTC dates.

## Architecture overview

### The front page
`index.html` loads one ES module, and the imports are the dependency graph:

1. `modules/front-page.js` — the entry point. It imports:
2. `modules/issue.js` — composes an issue from a date. `selectLead` is pure
   in the issue number, so any issue can name any other issue's lead; that
   is what lets today correct and continue yesterday. It imports:
3. `data/formats.js` — `LEADS` (each with deck, correction, follow-up,
   classified, letter, pose), `CORRECTIONS`, `WEATHER`, `CLASSIFIEDS`,
   `LETTERS`; `data/poses.js` — the file cut's poses (`POSES`);
   `data/headlines.js` — the briefs pool (`HEADLINES`); `data/editions.js` —
   the landmark issues, keyed by number; and:
4. `modules/calendar.js` — matches the calendar against a date. It imports:
5. `data/calendar.js` — what runs on which day.

`front-page.js` swaps the standing issue in the markup for the composed one,
sets the title, the file cut's pose, the weather cut's layers, the
editorial, the clipping link and the back-issue notice, and publishes the composed issue as
`window.Neckass.currentIssue`.

There is no bootstrap, no state, no storage and no input handling. The page
ends when `front-page.js` has rendered.

### The archive
`archive.html` loads `modules/archive-list.js`, which imports the same
`modules/issue.js` and lists the whole run from `recentIssues()`.

### Data and assets
- `data/` — see above. Pool sizes are load-bearing; see the comments in
  `data/formats.js`.
- `assets/cuts/` — line-cuts for the paper. Each is a rig: its joints and
  layers are CSS custom properties with fallbacks, so the files work as plain
  `<img>` and pose when inlined. The file cut and the weather cut are
  inlined in `index.html`, styled in `styles.css`; `assets/cuts/README.md`
  lists every property, and `data/poses.js` holds the file cut's poses.
- `fonts/` — Fraunces as a variable woff2 for the browser, and two static
  TrueType cuts for the card renderer.

### Edge
- `worker.js` — the Worker's entry, and the router Pages used to generate
  from `functions/`. It sends GET `/card.png` and `/feed.xml` (any case, one
  trailing slash or none, as Pages matched them) to their handlers and runs
  the middleware in front of every request it sees. It drops the ETag from
  what it fetches from the assets, since the front page is rewritten per
  day, and answers a path with no file with `404.html`, 404, `no-store`.
- `wrangler.jsonc` — the Worker: the Pages project's compatibility date,
  the repository root as the assets directory, and the front page in
  `run_worker_first`, since the middleware has to see it before the asset
  is served. Every other file is served without running the Worker.
- `.assetsignore` — the allowlist of what the site publishes; see the
  README's Deployment section. `_headers` and `_redirects` restore the
  headers and the 308s Pages sent by default.
- `functions/feed.xml.js` — RSS for the last 30 issues, per request.
- `functions/card.png.js` — the issue's social card, drawn with Satori and
  resvg.
- `functions/_middleware.js` — per-issue title, description and image tags
  on the front page.
- `functions/lib/issue.mjs` — UTC date adapters over `modules/issue.js`.
- `functions/lib/cut.mjs` — the file cut flattened for the card, in any
  pose. A smoke test holds it, the rig and the front page's copy to the same
  parts, pivots and house pose.
- `functions/lib/card.mjs` — the card's layout and the one renderer
  (`renderCardPng`) shared with `scripts/generate-og.ts`; `initCardRenderer`
  loads the WebAssembly engines once per runtime, from imported modules on
  the edge and from files in the build script.

## Source-of-truth hierarchy
1. `SPECIFICATIONS.md` for user-facing behavior and accessibility.
2. Existing in-code behavior for non-specified edge handling.
3. Contributor/maintainer docs (`README`, `CONTRIBUTING`, this file).

## Validation checklist (manual)
1. Today's issue renders whole: lead, seven briefs, four corrections,
   weather, five classifieds, two letters, the colophon.
2. `/?issue=2024-09-29` is the first edition, with its editorial and one
   correction; `/?issue=2026-09-29` is the second anniversary.
3. The first brief continues yesterday's lead and the first correction
   retracts a detail of it.
4. `bun run edge`, then `/card.png` is a PNG of today's lead and `view-source:/`
   carries `og:image` pointing at it.
5. Print preview: ink on white, two columns, no site links.
7. Layout remains usable across small and wide viewports, in both themes.

## Smoke test harness
```bash
bun install
bun run test:smoke
```

Playwright starts `bun run serve` and `bun run edge` itself. The suite covers
what a reader opens (the issue, a back issue, the archive, no-JS), the
arithmetic — run directly against `modules/issue.js`, without a browser —
(the corrections chain, the calendar, the landmarks, no repeats inside a
round) and the edge (the feed, the card, the rewritten tags).

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
for the proxied hostname from the dashboard (Web Analytics → Add a site →
neckass.com, automatic setup), which injects the beacon at the edge. It is
cookieless and collects no personal data, so it does not compromise the
site's privacy stance, and doing it in the dashboard avoids committing a site
token.

Until it is switched on there is no measurement of whether the daily issue
brings anyone back, which is the one assumption the whole format rests on.
