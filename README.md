# Neckass Headlines

A playful headline generator that now supports tiny on-device LLM generation for fresh headlines alongside the existing curated list.

## Tiny LLM generation
- The UI loads `llm.js`, which exposes a global `tinyLlmClient.generateHeadline()` helper. The helper uses a lightweight, on-device-friendly model simulation with a built-in timeout (2.4s) and error handling.
- If the tiny model is available, `handleNext` in `script.js` requests a generated headline; otherwise, it falls back to the static catalog.
- Generated headlines are cached and stored locally so navigation, sharing links, and the mock export stay in sync with the generated text.
- No external API calls are required. If you swap in a real edge model, ensure it resolves within the same timeout window and returns a non-empty string.

## Development
Open `index.html` in a modern browser. The app persists headline navigation in `localStorage`.
