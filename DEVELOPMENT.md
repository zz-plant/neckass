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

## Architecture overview

### Entry points and startup path
- `index.html` — document shell and script loading order.
- `script.js` — runtime bootstrap (`DOMContentLoaded`) that instantiates `HeadlineApp`.
- `styles.css` — layout, theme, components, responsive behavior.
- `llm.js` — tiny on-device/mock generation client loaded before bootstrap.

### Runtime modules
- `modules/app.js` — `HeadlineApp` class and orchestration logic used by `script.js`.
- `modules/state.js` — session/navigation state model.
- `modules/history.js` — browser history and URL-sync behavior.
- `modules/storage.js` — `localStorage` persistence helpers.
- `modules/ui.js` — rendering and status updates.
- `modules/filters.js` — query/filter logic.
- `modules/share.js` — social/native share URL flows.
- `modules/clipboard.js` — text/image clipboard behavior.
- `modules/mock-export.js` — mock front-page image export.
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
- `modules/share.js`, `modules/clipboard.js`, `modules/mock-export.js`
  - Own integration-specific behavior (share targets, clipboard APIs, export APIs).
  - Surface small functions consumed by `HeadlineApp`.
- `modules/utils.js`
  - Keep pure, reusable helpers with no side effects.

### Data and assets
- `data/headlines.js` — curated headline corpus.
- `data/llm-beats.js` — generation phrase components.
- `icons/` — SVG assets used by UI and share controls.
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
4. Empty/filter edge states communicate clearly and disable invalid actions.
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
npm install
npm run test:smoke
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
