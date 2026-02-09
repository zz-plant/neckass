# Development Guide

This guide is for developers and maintainers working on implementation details.

## Local development
- No build step is required.
- Open `index.html` directly in a modern browser.
- For browser automation or screenshot tooling that blocks `file://`, run:
  - `python -m http.server 8001 --directory .`
  - then open `http://127.0.0.1:8001/`.

## Project architecture

### Current entry point and modules
- `index.html`: page structure and semantic landmarks.
- `modules/app.js`: app bootstrap and event wiring.
- `modules/state.js`: headline/navigation state handling.
- `modules/ui.js`: DOM updates and visual state sync.
- `modules/history.js`: history/back-forward style traversal logic.
- `modules/storage.js`: persistence (`localStorage`) helpers.
- `modules/filters.js`: filtering-related logic.
- `modules/share.js`: social and native share behavior.
- `modules/clipboard.js`: copy-to-clipboard flows.
- `modules/mock-export.js`: local export helpers.
- `modules/utils.js`: shared utility helpers.
- `icons/`: SVG assets used by sharing/actions.

### Source-of-truth docs
- `SPECIFICATIONS.md`: expected UX, component behavior, and accessibility constraints.
- `TECH_STACK_CAPABILITIES_2026.md`: optional future enhancements; not mandatory for current changes.

## Validation flow

### Manual checks
1. Headline generation/navigation works (`next`, `previous`, random/manual flows if present).
2. Copy/share/export actions remain aligned with the active headline.
3. Persistence restores expected state after refresh.
4. Focus styles, aria labels, and live-region announcements still behave correctly.
5. Responsive layout works at narrow and wide widths.

### Visual changes
- If a change affects visible UI, include a screenshot in your PR.

## Change-sizing guidance
- Keep behavior changes in existing modules unless a clear extraction improves readability.
- Avoid introducing new dependencies for simple DOM/state tasks.
- Prefer additive, incremental changes over large rewrites.
