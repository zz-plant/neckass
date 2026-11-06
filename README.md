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
- **A lesson, in that form.** He went through something and now wants everyone
  else to. The paper never says what is wrong with that. It runs the item, the
  correction, and the letter from whoever it cost, and the
  [entry](https://neckass.com/about) names the mechanism.
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
Any modern browser. [Bun](https://bun.sh) runs the local server and the tests.
The pages are ES modules, so they have to be served over HTTP. `bun run edge`
serves the same tree through `wrangler dev` on `http://127.0.0.1:8800/`, with
the feed, the card and the middleware.

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
letter stays away for most of its pool before it runs again. Every item
is numbered and dealt by its number; a pool grows, or retires an item,
only from an issue that has not gone to press (`data/growth.js`), so a
back issue always runs what it ran. Every lead carries its deck, the correction the paper runs the next
day, the brief that runs the next morning, and the classified and the letter
from the person it happened to, so the page compounds: the item, the ad, the
letter, then tomorrow the retraction and what he did next.

A few issues are written rather than dealt (`data/editions.js`): the first
edition, the hundredth, No. 288, and the anniversaries, each with its own
lead and an editorial. The calendar (`data/calendar.js`) runs dated items on
the days they happen — the book club meets the first and third Tuesday and
Wednesday reports on it; the clocks go forward and back; his mother writes
in on his birthday.

The edge prints the day's whole issue into the page as it serves it, with the
renderer the browser uses (`modules/render.js`), so the paper reads with
JavaScript disabled and crawlers see the day's copy. `index.html` also
carries a standing issue, printed from No. 759 by `bun run standing`, for a
static host.

## Edge functions

The site is static; a Cloudflare Worker adds the RSS feed, the per-issue card
and the printing of the day's issue into the page. They compose the lead with
the module the browser runs, on the same clock: an issue goes to press at
midnight US Eastern, wherever the reader or the Worker is. `DEVELOPMENT.md` has
the map.

## Tests
`bun run test:unit` is the arithmetic and the data, without a browser;
`bun run test:smoke` is the pages and the edge under Playwright, which starts
the static server and `wrangler dev` itself. `DEVELOPMENT.md` says what each
covers.

## Documentation map
- `SPECIFICATIONS.md` — canonical UI/UX and accessibility requirements.
- `DEVELOPMENT.md` — architecture map, local validation, change strategy.
- `CONTRIBUTING.md` — contribution workflow and PR checklist.
- `AGENTS.md` — repository-specific instructions for coding agents.
- `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`.

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

Every PNG the site serves is committed and checked by `bun run assets:check`.
The social cards are rendered by `bun run og:generate`
(`scripts/generate-og.ts`) with the same layout, renderer and Fraunces as the
per-issue `/card.png`. They are PNG deliberately: no major platform renders an
SVG as a link preview. `bun run cut:draw` draws the file cut
(`scripts/draw-cut.ts`); run `bun run og:generate` after it.

## Contributing
PRs are welcome. Start with `CONTRIBUTING.md`, then use `DEVELOPMENT.md` while implementing.

---

## Ecosystem

More open-source projects from [zz-plant](https://github.com/zz-plant):

- [**Stims**](https://github.com/zz-plant/stims) — Browser music visualizer inspired by MilkDrop
- [**sabnzbd-mcp**](https://github.com/zz-plant/sabnzbd-mcp) — MCP server for SABnzbd (zero deps)
- [**Refract**](https://github.com/refract-org/refract) — Open infrastructure for agent-readable knowledge change
- [**ethotechnics.org**](https://github.com/zz-plant/ethotechnics.org) — Essays on ethical technology
