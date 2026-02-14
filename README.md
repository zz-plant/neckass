# Neckass Headlines

A privacy-first, static headline generator with curated prompts, optional on-device tiny-model generation, and built-in share/export tools.

No build system. No backend. Open `index.html` and you are running.

## What this project is
- **Static-first**: works from local files or any static host.
- **Generator hybrid**: curated headline catalog + optional tiny local LLM mock.
- **Share-ready UX**: clipboard copy, social links, and mock front-page export.
- **State-aware**: navigation/session context is persisted with `localStorage` and URL params.

## Quick start
1. Clone the repository.
2. Open `index.html` in a modern browser.
3. Use **Shuffle** to generate and cycle headlines.

If tooling blocks `file://` URLs, run:

```bash
python -m http.server 8001 --directory .
```

Then open `http://127.0.0.1:8001/`.

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
npm install
npm run test:smoke
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

### Research / forward-looking
- `TECH_STACK_CAPABILITIES_2026.md` — optional modernization opportunities.

## Contributing
PRs are welcome. Start with `CONTRIBUTING.md`, then use `DEVELOPMENT.md` while implementing.
