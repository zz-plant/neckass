# Neckass Headlines

A playful, privacy-friendly headline generator that mixes curated favorites with an on-device “tiny LLM” mock for fresh ideas. Built as a static, zero-build site—open the HTML and you’re running.

## ✨ Highlights
- **Instant, offline-friendly**: no server required, no API calls. Headlines stay on-device.
- **Hybrid generation**: cycles through a curated catalog and an optional tiny LLM mock.
- **Share-ready**: copy, export, and share flows stay synced with the current headline.
- **Persistent navigation**: remembers your place with `localStorage`.

## 🚀 Quick start
1. Clone the repo.
2. Open `index.html` in a modern browser.
3. Click **Next** to cycle headlines or generate a fresh one.

## 🧠 Tiny LLM mock (optional)
The UI loads `llm.js`, which exposes `tinyLlmClient.generateHeadline()`.

- `script.js` calls the helper in `handleNext` when the mock is available.
- The helper simulates a lightweight on-device model with a 2.4s timeout and error handling.
- Generated headlines are cached locally so navigation, sharing, and exports stay in sync.
- If you wire a real model, keep the same timeout window and return a non-empty string.

## 🧭 Project structure
- `index.html`: markup for hero, headline, command rail, and share/export sections.
- `styles.css`: layout, theming, and component styles.
- `script.js`: headline navigation, copy/share/export logic, persistence.
- `llm.js`: tiny LLM generator helper.
- `icons/`: social share SVG assets.

## ✅ Documentation
- `SPECIFICATIONS.md`: UI/UX and accessibility requirements.
- `TECH_STACK_CAPABILITIES_2026.md`: research notes on newer browser/platform capabilities relevant to this stack.
- `CONTRIBUTING.md`: contribution workflow and local testing guidance.
- `CODE_OF_CONDUCT.md`: community expectations.
- `SECURITY.md`: vulnerability reporting policy.
- `CHANGELOG.md`: notable changes.

## 🤝 Contributing
Contributions are welcome! Please read the guidelines in `CONTRIBUTING.md` and follow the code of conduct.

## 🛡️ License
Licensed under the terms in `LICENSE`.
