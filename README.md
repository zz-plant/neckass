# Neckass Headlines

<p align="center">
  <img src="neckass-demo.gif" alt="Neckass headline generator in action" width="600" style="border-radius: 8px;">
</p>

A privacy-first, static headline generator with curated prompts, optional on-device tiny-model generation, and built-in share/export tools.

**Live at [neckass.com](https://neckass.com)** · No build system. No backend. Open `index.html` and you are running.

## What this project is
- **Static-first**: works from local files or any static host.
- **Generator hybrid**: curated headline catalog + optional tiny local LLM mock.
- **Share-ready UX**: clipboard copy, social links, and mock front-page export.
- **State-aware**: navigation/session context is persisted with `localStorage` and URL params.

## Quick start
1. Clone the repository.
2. Open `index.html` in a modern browser.
3. Use **Shuffle** to generate and cycle headlines.

## Requirements
- **Runtime:** any modern browser (no build pipeline required).
- **Optional smoke tests:** [Bun](https://bun.sh) (Playwright is a dev dependency installed via `bun install`).

If tooling blocks `file://` URLs, run:

```bash
python -m http.server 8001 --directory .
```

Then open `http://127.0.0.1:8001/`.

## App pages
- `index.html` — main generator experience.
- `about.html` — product overview and feature summary.
- `examples.html` — sample headlines and tone reference.

## Using the app
1. Click **Shuffle** to cycle featured headlines.
2. Use **Previous** to move backward through your local session history.
3. Use copy/share controls to publish a headline quickly.
4. Use export controls to create a mock front-page image.

## Agentic interface
A lightweight browser-side tool interface is exposed at `window.Neckass.agent` after app initialization, so browser automation and agentic LLM runtimes can call headline actions without clicking UI controls directly.

Available tools:
- `get_state`
- `shuffle`
- `previous`
- `generate`
- `set_filters`
- `clear_filters`
- `select_headline`
- `list_headlines`

Example:

```js
const state = await window.Neckass.agent.call('get_state');
const next = await window.Neckass.agent.call('shuffle');
```

## Optional smoke tests
An optional Playwright smoke suite validates key flows (shuffle, URL restore,
share links, export controls) without changing the no-build runtime model.

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

`.github/workflows/ci.yml` runs `bun run lint` and the Playwright suite on
every push to `main` and every pull request.

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

`bun run assets:check` is not part of CI. It currently fails on 11 undersized
PNGs in `docs/assets/` and a touch icon that is 360x144 rather than 360x360;
those need regenerating before the check can be enforced.

## Contributing
PRs are welcome. Start with `CONTRIBUTING.md`, then use `DEVELOPMENT.md` while implementing.

---

## Ecosystem

More open-source projects from [zz-plant](https://github.com/zz-plant):

- [**Stims**](https://github.com/zz-plant/stims) — Browser music visualizer inspired by MilkDrop
- [**sabnzbd-mcp**](https://github.com/zz-plant/sabnzbd-mcp) — MCP server for SABnzbd (zero deps)
- [**Refract**](https://github.com/refract-org/refract) — Open infrastructure for agent-readable knowledge change
- [**ethotechnics.org**](https://github.com/zz-plant/ethotechnics.org) — Essays on ethical technology
