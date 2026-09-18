# The Corbin Falls Gazette

A static daily newspaper about a fictional Neckass, the one man in a small
town who is news. One issue per day, composed from its own date, so two
readers on the same day read the same paper and every past day has an issue.
No build system, no backend, no account, nothing stored.

**Live at [neckass.com](https://neckass.com)** · Open `index.html` and you are
reading.

## What this project is
- **A paper, not an app.** The front page is the product; there is nothing to
  click but links. It reads without JavaScript.
- **Deterministic.** Issue *n* is a pure function of *n*: the lead, the
  briefs, the corrections, the weather, the map. The archive is derived, not
  stored, and costs nothing.
- **Continuous.** Today's paper retracts a detail of yesterday's lead and
  runs the next thing he did. It knows what day it is: the council's
  Tuesday, the clocks, his birthday, the paper's own anniversary.
- **Static-first.** Works from `file://` or any static host. Two Cloudflare
  Pages Functions add what a file cannot: the RSS feed and a social card
  drawn per issue.

## Quick start
1. Clone the repository.
2. Open `index.html` in a modern browser.
3. Come back tomorrow.

## Requirements
- **Runtime:** any modern browser (no build pipeline required).
- **Optional smoke tests:** [Bun](https://bun.sh) (Playwright is a dev dependency installed via `bun install`).

If tooling blocks `file://` URLs, run:

```bash
bun run serve
```

Then open `http://127.0.0.1:8001/`. To run the edge functions as well (the
feed, the card, the middleware), `bun run edge` serves the same tree through
`wrangler pages dev` on `http://127.0.0.1:8800/`.

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
a round. Every lead carries its deck, the correction the paper runs the next
day, the brief that runs the next morning, and the classified and the letter
from the person it happened to, so the page compounds: the item, the ad, the
letter, then tomorrow the retraction and what he did next.

A few issues are written rather than dealt (`data/editions.js`): the first
edition, the hundredth, No. 288, and the anniversaries, each with its own
lead and an editorial. The calendar (`data/calendar.js`) runs dated items on
the days they happen — the council meets the first and third Tuesday and
Wednesday reports on it; the clocks go forward and back; his mother writes
in on his birthday.

A complete standing issue ships in `index.html` itself, so the paper reads with
JavaScript disabled and crawlers see copy rather than an empty shell.

## Edge functions

The site is static; two Cloudflare Pages Functions add what a static file
cannot:

- `functions/feed.xml.js` — builds the RSS feed for the last 30 issues on
  request. No store and no cron: issues come from the calendar.
- `functions/card.png.js` — draws the issue's lead on the sheet as a PNG, on
  request, with Satori and resvg (`workers-og`). About 150 ms; no browser.
- `functions/_middleware.js` — rewrites the front page's title and
  social-card tags to the active issue's lead, and points the image tags at
  the card for the same issue, so a shared link previews with the headline
  that is actually running.

All three compose the lead through `functions/lib/issue.mjs`, which mirrors the
arithmetic in `modules/issue.js`. The Workers runtime forbids evaluating the
browser data files, so the leads are extracted to `functions/lib/leads.mjs` by
`bun run feed:build`. `bun run feed:check` fails if that extract has drifted,
and a smoke test asserts the two runtimes pick the same lead for a spread of
dates.

## Smoke tests
A Playwright suite covers what a reader opens: today's issue renders whole,
a back issue loads from the archive, the corrections chain points at the
lead it claims to, the calendar runs on its days, the landmarks are written,
the map rings what the day names, both runtimes pick the same lead, and the
edge serves the feed and a real card. It starts the static server and
`wrangler pages dev` itself.

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
[neckass.com](https://neckass.com) is served by Cloudflare Pages (project `neckass`).

The repository root *is* the deploy artifact: there is no output directory, so
Pages publishes the tree exactly as committed. Pushing to `main` triggers a
production deploy; other branches get preview deployments.

To deploy from a working copy instead of a push:

```bash
bunx wrangler pages deploy . --project-name=neckass --branch=main
```

## Verification

`.github/workflows/ci.yml` runs `bun run lint`, `bun run assets:check` and the
Playwright suite on every push to `main` and every pull request.

Pages runs `bun install --frozen-lockfile && bun run lint` as its build
command, so a lint failure fails the build and nothing is published — the site
keeps serving the last good deployment.

**The smoke tests do not gate the deploy.** Pages builds on push regardless of
what GitHub Actions concluded, and running Playwright inside the Pages build
would mean downloading a browser on every deploy. Two ways to close that gap:

1. Require the `verify` check on `main` with a repository ruleset. Changes to
   `main` then have to arrive by pull request, and a red suite blocks the merge.
2. Turn off automatic production deployments in the Pages dashboard and publish
   from CI with `wrangler pages deploy` after the suite passes. Needs a
   Cloudflare API token stored as a GitHub secret.

### Generated assets

`docs/assets/` is build output, not hand-edited artwork. Every PNG is rendered
from `docs/assets/source.svg` by `bun run assets:generate`, which needs
`rsvg-convert` locally; generation is deterministic, so regenerating an
unchanged source produces byte-identical files.

`bun run assets:check` verifies dimensions, colour type, bit depth and a
minimum byte size per scene, and fails on any PNG that is not a known scene —
that last rule is what stops hand-added files rotting in the directory
unnoticed. Both scripts read their scene list from `scripts/asset-specs.ts`.

### Social preview cards

`og-image.png`, `og-about.png`, `og-archive.png` and `og-prompts.png` live at
the repo root, are 1200x630, and are rendered by `bun run og:generate` from
`scripts/generate-og.ts`. `assets:check` covers them too, so one command checks
every generated image.

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
