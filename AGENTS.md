# AGENTS Instructions

## Repo overview
- **Purpose**: Static headline generator site with optional tiny on-device LLM mock and persistent navigation state.
- **Entry points**: `index.html`, `styles.css`, `script.js`, `llm.js`.
- **Spec**: `SPECIFICATIONS.md` describes expected UI behavior, layout, and accessibility checks.

## Project layout
- `index.html`: Markup for hero, headline, command rail, and share/export sections.
- `styles.css`: Layout, theming, component styles.
- `script.js`: Headline navigation, copy/share/export logic, localStorage persistence.
- `llm.js`: Tiny LLM generator helper used by `script.js`.
- `icons/`: Social share SVG assets.

## Local testing
- Open `index.html` directly in a modern browser; no build step.
- If you update UI visuals, capture a screenshot per repo instructions.

## Notes for changes
- Match `SPECIFICATIONS.md` for UI/UX expectations and accessibility requirements.
- Prefer minimal JS changes; keep behavior in `script.js` and avoid inline scripts.
- Keep copy/share messages aligned with existing strings for consistency.
