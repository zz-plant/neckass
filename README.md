# The Gazette

A static daily newspaper about a fictional Neckass, the one man who is news.
One issue per day, composed from its own date, so two readers on the same
day read the same paper and every past day has an issue.
No build system, no backend, no account, nothing stored.

**Live at [neckass.com](https://neckass.com)** · Open `index.html` and you are
reading.

## What this project is
- **A paper, not an app.** The front page is the product; there is nothing to
  click but links. It reads without JavaScript.
- **Deterministic.** Issue *n* is a pure function of *n*: the lead, the
  briefs, the corrections, the weather. The archive is derived, not
  stored, and costs nothing.
- **Continuous.** Today's paper retracts a detail of yesterday's lead and
  runs the next thing he did. It knows what day it is: the book
  club's Tuesday, the clocks, his birthday, the paper's own anniversary.
- **Static-first.** The browser and the edge import the same ES modules;
  any static host serves it. A Cloudflare Worker adds what a file cannot:
  the RSS feed and a social card drawn per issue.

## Quick start
1. Clone the repository.
2. `bun run serve`, then open `http://127.0.0.1:8001/`.
3. Come back tomorrow.

## Requirements
- **Runtime:** any modern browser (no build pipeline required).
- **Serving:** [Bun](https://bun.sh) for the local server and the smoke tests
  (Playwright is a dev dependency installed via `bun install`).

The modules are ES modules, so the pages are served over HTTP:

```bash
bun run serve
```

That serves the site on `http://127.0.0.1:8001/`. To run the edge functions
as well (the feed, the card, the middleware), `bun run edge` serves the same
tree through `wrangler dev` on `http://127.0.0.1:8800/`.

## Pages
- `index.html` — today's front page. `/?issue=YYYY-MM-DD` is any past one.
- `archive.html` — every issue, by month, with its lead; the landmark
  editions listed first.
- `about.html` — the encyclopedia entry for the word, which cites the paper
  by issue number, and the citations resolve.
- `prompts.html` — the Gazette's filing standards.
- `/feed.xml` — the paper as RSS, derived from the date like everything else.
- `/card.png?issue=YYYY-MM-DD` — the issue's front page as a 1200×630 image,
  drawn at the edge. It is what a shared link previews with.

## How an issue is built
The front page is one issue, composed deterministically from its own date
(`modules/issue.js`): the issue number is days since the first edition on
2024-09-29, and that number seeds the selection of lead, briefs, corrections,
weather, classifieds, and letters from `data/formats.js`. Two readers opening
the site on the same day get the same paper, and any past date renders its own
issue at `/?issue=YYYY-MM-DD` — so the archive costs no storage.

Leads are dealt in rounds of the pool's length, so no lead runs twice inside
a round. The other sections are dealt in rounds too, so a brief, an ad or a
letter stays away for most of its pool before it runs again. Every lead carries its deck, the correction the paper runs the next
day, the brief that runs the next morning, and the classified and the letter
from the person it happened to, so the page compounds: the item, the ad, the
letter, then tomorrow the retraction and what he did next.

A few issues are written rather than dealt (`data/editions.js`): the first
edition, the hundredth, No. 288, and the anniversaries, each with its own
lead and an editorial. The calendar (`data/calendar.js`) runs dated items on
the days they happen — the book club meets the first and third Tuesday and
Wednesday reports on it; the clocks go forward and back; his mother writes
in on his birthday.

A complete standing issue ships in `index.html` itself, so the paper reads with
JavaScript disabled and crawlers see copy rather than an empty shell.

## Edge functions

The site is static; a Cloudflare Worker adds what a static file cannot.
`worker.js` is its router: it sends `/card.png` and `/feed.xml` to their
handlers in `functions/`, which were Pages Functions and keep the Pages
signatures, and runs the middleware in front of them and the front page.

- `functions/feed.xml.js` — builds the RSS feed for the last 30 issues on
  request. No store and no cron: issues come from the calendar.
- `functions/card.png.js` — draws the issue's lead on the sheet as a PNG, on
  request, with Satori and resvg. About 150 ms; no browser.
- `functions/_middleware.js` — rewrites the front page's title and
  social-card tags to the active issue's lead, and points the image tags at
  the card for the same issue, so a shared link previews with the headline
  that is actually running.

All three compose the lead through `functions/lib/issue.mjs`, a thin UTC
adapter over `modules/issue.js` — the same module the browser runs, so both
runtimes pick the same lead by construction.

## Smoke tests
A Playwright suite covers what a reader opens: today's issue renders whole,
a back issue loads from the archive, the corrections chain points at the
lead it claims to, the calendar runs on its days, the landmarks are written,
and the edge serves the feed, a real card, every file the pages name and none
of the source. It starts the static server and `wrangler dev` itself.

```bash
bun install
bun run test:smoke
```

## Documentation map

### Product & behavior
- `SPECIFICATIONS.md` — canonical UI/UX + accessibility requirements.

### For contributors and maintainers
- `CONTRIBUTING.md` — contribution workflow, quality bar, PR checklist.
- `DEVELOPMENT.md` — architecture map, local validation, change strategy.
- `CHANGELOG.md` — notable project changes (Keep a Changelog style).

### Governance
- `CODE_OF_CONDUCT.md` — collaboration expectations and enforcement.
- `SECURITY.md` — vulnerability reporting and response process.
- `LICENSE` — project license.

### Agent-facing
- `AGENTS.md` — repository-specific instructions for coding agents.


## Deployment
[neckass.com](https://neckass.com) is served by a Cloudflare Worker with static
assets (Worker `neckass`, configured in `wrangler.jsonc`).

The repository root *is* the assets directory: there is no build output, so
the Worker serves the tree as committed, less what `.assetsignore` keeps back.
That file is an allowlist. It leaves everything out, then lets back in the
pages, the stylesheet, the images and icons at the root, and `assets/`,
`data/`, `fonts/` and `modules/`. Source, tooling, docs and anything untracked
in a working copy are never uploaded. A new page or image at the root is
public by its extension; a new directory has to be added to the list.

`_headers` sends the three headers Pages added to every static response, and
`_redirects` answers the `.html` and trailing-slash addresses with the 308
Pages gave them, where Workers would send a 307.

Pushing to `main` deploys through Workers Builds. To deploy from a working
copy instead:

```bash
bun run deploy
```

## Verification

`.github/workflows/ci.yml` runs `bun run lint`, bundles the Worker with
`wrangler deploy --dry-run`, and runs `bun run assets:check` and the Playwright
suite on every push to `main` and every pull request.

Workers Builds runs `bun install --frozen-lockfile && bun run lint` as its
build command, so a lint failure fails the build and nothing is deployed — the
site keeps serving the last good version.

**The smoke tests do not gate the deploy.** Workers Builds deploys on push
regardless of what GitHub Actions concluded, and running Playwright inside the
build would mean downloading a browser on every deploy. Two ways to close that
gap:

1. Require the `verify` check on `main` with a repository ruleset. Changes to
   `main` then have to arrive by pull request, and a red suite blocks the merge.
2. Disconnect Workers Builds and deploy from CI with `wrangler deploy` after
   the suite passes. Needs a Cloudflare API token stored as a GitHub secret.

### Generated assets

Every PNG the site serves is committed and checked by `bun run assets:check`:
the four social cards below, at their size and above a minimum byte count,
and the three icons the pages and the manifest name, at the sizes they claim.

### The file cut

The man in `assets/cuts/neckass.svg`, the front page's inlined copy of him
and the card's flattened one are drawn by `bun run cut:draw`, from the
geometry in `scripts/draw-cut.ts` and a hand that bows each line from a
fixed seed, so the three agree to the stroke and a redraw is repeatable.
Run `bun run og:generate` after it.

### Social preview cards

`og-image.png`, `og-about.png`, `og-archive.png` and `og-prompts.png` live at
the repo root, are 1200x630, and are rendered by `bun run og:generate` from
`scripts/generate-og.ts` — with the same layout (`functions/lib/card.mjs`),
renderer (Satori and resvg) and Fraunces as the per-issue `/card.png`, so
every shared link previews as the same paper.

They are PNG deliberately. They used to be SVG, which no major platform renders
as a link preview, so shared neckass.com links showed no image at all.

## Contributing
PRs are welcome. Start with `CONTRIBUTING.md`, then use `DEVELOPMENT.md` while implementing.

---

## Ecosystem

More open-source projects from [zz-plant](https://github.com/zz-plant):

- [**Stims**](https://github.com/zz-plant/stims) — Browser music visualizer inspired by MilkDrop
- [**sabnzbd-mcp**](https://github.com/zz-plant/sabnzbd-mcp) — MCP server for SABnzbd (zero deps)
- [**Refract**](https://github.com/refract-org/refract) — Open infrastructure for agent-readable knowledge change
- [**ethotechnics.org**](https://github.com/zz-plant/ethotechnics.org) — Essays on ethical technology
