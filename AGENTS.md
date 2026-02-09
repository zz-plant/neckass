# AGENTS Instructions

## Mission
Maintain a static, browser-first headline generator with strong UX/accessibility defaults, no build pipeline, and minimal complexity.

## Critical references
- `SPECIFICATIONS.md` is the source of truth for UI/UX and accessibility behavior.
- `DEVELOPMENT.md` covers architecture and local validation flow.
- `CONTRIBUTING.md` defines contributor expectations/checklists.

## Project layout (current)
- `index.html` — page structure and semantic regions.
- `styles.css` — all visual/layout styling.
- `llm.js` — tiny local/mock headline generation client.
- `modules/*.js` — modular app logic (state, UI, history, filters, share, clipboard, export).
- `data/` — curated headline and generator phrase data.
- `icons/` — SVG assets.
- `vendor/html-to-image.js` — export helper dependency.

## Change priorities
1. Preserve spec-compliant behavior and accessibility.
2. Prefer small, targeted edits over broad refactors.
3. Keep no-build/static-host compatibility.
4. Reuse existing strings and interaction patterns where possible.

## Local testing
- Default: open `index.html` directly.
- If browser tooling requires HTTP:
  - `python -m http.server 8001 --directory .`
  - open `http://127.0.0.1:8001/`

## When changing visible UI
- Capture a screenshot with available browser tooling.

## Guardrails
- Do not add inline scripts for behavior changes.
- Avoid introducing dependencies for straightforward DOM/state work.
- Keep copy/share/export messaging consistent with existing UX tone.
