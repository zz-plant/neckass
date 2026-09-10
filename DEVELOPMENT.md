# Development Guide

This guide is for maintainers, contributors, and coding agents changing implementation details.

## Local development
- No build step required.
- Primary flow: open `index.html` in a modern browser.
- If your tooling requires HTTP (screenshots/automation), run:

```bash
python -m http.server 8001 --directory .
```

Then open `http://127.0.0.1:8001/`.

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
  forbids `eval`, so `scripts/build-feed-data.ts` runs `data/formats.js` in a
  `node:vm` sandbox at build time and writes `functions/lib/leads.mjs`. Run
  `bun run feed:build` after editing leads; `bun run feed:check` fails on drift.
- `functions/lib/issue.mjs` hand-mirrors the epoch, the RNG and the lead
  selection from `modules/issue.js`. The smoke test *worker and browser agree
  on the lead for a given issue* pins the two together across five dates and
  will fail if either side moves.

If `file://` support is ever dropped, all three costs go with it: the data
becomes JSON, both runtimes import it, and the sandbox, the generator, the
check and the drift test are all deleted.

## Architecture overview

### Entry points and startup path
- `index.html` — document shell and script loading order.
- `script.js` — runtime bootstrap (`DOMContentLoaded`) that instantiates `HeadlineApp`.
- `styles.css` — layout, theme, components, responsive behavior.
- `llm.js` — tiny on-device generation client loaded before bootstrap.

### Runtime modules
- `modules/app.js` — the `HeadlineApp` class and orchestration logic used by `script.js`.

#### HeadlineApp method groups
`HeadlineApp` is one class, but roughly a third of its methods live in
separate files and are mixed onto the prototype by `app.js`. They are plain
objects of shorthand methods, so `this` is the app instance exactly as it
would be inside the class body. Each must load *before* `app.js`.

- `modules/agent-api.js` — the surface `window.Neckass.agent` is built on.
- `modules/status.js` — status lines, the copied-button flash, and the toast.

Note that `modules/controllers/*.js` are *not* this pattern: they are
pass-through indirection that delegates straight back to `app._xxxCore()`
without holding logic.
- `modules/state.js` — session/navigation state model.
- `modules/history.js` — browser history and URL-sync behavior.
- `modules/storage.js` — `localStorage` persistence helpers.
- `modules/ui.js` — rendering and status updates.
- `modules/head.js` — document metadata and canonical link updates.
- `modules/history-list.js` — history panel list derivation and rendering.
- `modules/share.js` — social/native share URL flows.
- `modules/clipboard.js` — text/image clipboard behavior.
- `modules/clipping-export.js` — front-page clipping image export.
- `modules/agent-interface.js` — browser-callable tool surface for agentic workflows.
- `modules/utils.js` — shared helpers.

### Module boundary rules
Use these boundaries to prevent `app.js` / `ui.js` from turning into generic catch-alls.

- `modules/app.js`
  - Owns workflow orchestration and event-to-action control flow.
  - May call helpers from other modules.
  - Should avoid direct low-level DOM mutation except where wiring requires it.
- `modules/ui.js`
  - Owns presentational DOM writes (labels, classes, status text, button states).
  - Should remain stateless and derived from inputs provided by `HeadlineApp`.
  - Must not read/write URL state or storage directly.
- `modules/state.js`, `modules/history.js`, `modules/storage.js`
  - Own canonical state transitions and persistence/URL synchronization.
  - Should not encode UI copy.
- `modules/share.js`, `modules/clipboard.js`, `modules/clipping-export.js`
- `functions/` — Cloudflare Pages Functions: the RSS feed and the per-issue
  social-card middleware. Run `bun run feed:build` after changing `data.LEADS`,
  and `bun run feed:check` to verify the extract is current.
  - Own integration-specific behavior (share targets, clipboard APIs, export APIs).
  - Surface small functions consumed by `HeadlineApp`.
- `modules/utils.js`
  - Keep pure, reusable helpers with no side effects.

### Data and assets
- `data/headlines.js` — curated headline corpus.
- `data/llm-beats.js` — generation phrase components.
- `assets/cuts/` — line-cuts for the paper. Each is a rig: its joints and layers are CSS custom properties with fallbacks, so the files work as plain `<img>` and pose when inlined. `assets/cuts/README.md` lists them.
- `vendor/html-to-image.js` — export dependency.


## Bootstrap sequence
1. `index.html` loads data/vendor/module scripts.
2. `modules/app.js` defines `window.Neckass.HeadlineApp` and related helpers.
3. `llm.js` registers the tiny-model client.
4. `script.js` listens for `DOMContentLoaded`, validates dependencies, and calls `app.init()`.

## Source-of-truth hierarchy
1. `SPECIFICATIONS.md` for user-facing behavior and accessibility.
2. Existing in-code behavior for non-specified edge handling.
3. Contributor/maintainer docs (`README`, `CONTRIBUTING`, this file).

## Validation checklist (manual)
1. Shuffle/previous/generate flows work and update visible headline.
2. Copy/share/export actions target the active headline.
3. URL params and reload restore expected state.
4. Empty edge states communicate clearly and disable invalid actions.
5. Keyboard navigation and focus-visible styles remain functional.
6. Layout remains usable across small and wide viewports.

## Smoke test harness (optional, no-build compatible)
An optional Playwright smoke suite is included for critical flows:
- Shuffle updates headline.
- URL restore returns the same headline.
- Share links target the active headline.
- Export controls are available.

Run:

```bash
bun install
bun run test:smoke
```

This does not change runtime architecture: `index.html` remains the default startup path.

## Optional build path (not required)
The project remains static-first and zero-build by default. If deployment needs evolve
(cache-busting, stricter lint/type steps, or module bundling), add an **optional** build
workflow that outputs static assets while keeping `index.html` runnable in source form.

## UI change requirements
- Include screenshot(s) for visible changes.
- Keep ARIA/live-region semantics intact.
- Avoid introducing motion or transitions that reduce readability/accessibility.

## Change strategy
- Prefer incremental edits over broad rewrites.
- Keep behavior in existing modules unless extraction materially improves clarity.
- Preserve static-host/no-build compatibility.

## Analytics

Not wired in code, and it should not be: Cloudflare Web Analytics is enabled
for a Pages project from the dashboard (Web Analytics → the project → enable),
which injects the beacon at the edge. It is cookieless and collects no
personal data, so it does not compromise the site's privacy stance, and doing
it in the dashboard avoids committing a site token.

Until it is switched on there is no measurement of whether the daily issue
brings anyone back, which is the one assumption the whole format rests on.
