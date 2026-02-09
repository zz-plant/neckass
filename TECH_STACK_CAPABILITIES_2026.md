# Tech Stack Research: Newer Capabilities (2026)

This project is a static, browser-first app (`index.html`, `styles.css`, `llm.js`, and `modules/*.js`) with no build step. The items below focus on **newer capabilities you can adopt incrementally** without changing the deployment model.

## 1) HTML platform capabilities

### Popover API for lightweight menus and contextual controls
- Native `popover` support can replace custom “open/close” JS for small overlays (share hints, command help, keyboard cheatsheet).
- Benefits: built-in focus handling, escape-to-close behavior, and less ARIA ceremony.
- Fit for this repo: command-rail helper content, optional filter pickers.

### Declarative dialogs and improved form semantics
- `<dialog>` now has stronger cross-browser support and can be used for “About”, “Export options”, or “History” without heavyweight libraries.
- Enhanced native form controls (e.g., date/time/color improvements) can reduce custom UI code when extra controls are added.

### View Transition naming hooks in markup
- With View Transitions support improving, semantic wrappers around the headline area can enable smoother “next headline” transitions while keeping the DOM simple.

## 2) CSS capabilities

### Container queries (`@container`) for component-led responsiveness
- Instead of viewport-only breakpoints, command cards can adapt based on their own width.
- Useful for the right rail and reusable cards where available space changes with layout mode.

### Style queries and modern query units
- Modern query units (`cqw`, `cqh`, etc.) improve scaling typography and spacing inside components.
- Lets headline card typography respond to card size instead of global viewport.

### Cascade layers (`@layer`) and nesting
- `@layer` can stabilize specificity and make future contributions safer (base/components/utilities).
- CSS nesting reduces repetition and keeps card/button variants easier to maintain.

### New color tooling
- `color-mix()` and relative color syntax make theme tuning easier (hover, muted, and status colors) without hardcoding many hex values.
- `light-dark()` can support dark mode with less duplicated CSS if a theme toggle is added.

## 3) JavaScript language/runtime capabilities

### Top-level `await` and import maps (for zero-build expansion)
- If modules are expanded, import maps let you keep browser-native loading with readable module specifiers.
- Top-level `await` can simplify one-time startup hydration (e.g., loading persisted preferences) in module-based entry files.

### `structuredClone` and modern collection helpers
- Safer deep copy behavior for state snapshots than JSON stringify/parse.
- Useful for navigation/history stacks and future undo/redo features.

### Better scheduling primitives
- `scheduler.postTask` (where available) can prioritize UI-critical updates and defer low-priority work.
- Good fit for non-blocking tasks like share-link recomputation or metadata sync.

## 4) Web APIs already relevant to this project

### Async Clipboard API improvements
- You already use text copy and image copy fallback paths.
- Newer platform behavior increasingly supports richer clipboard types via `ClipboardItem`.
- Opportunity: copy both plain text + URL together, and progressively enhance where supported.

### Web Share API level improvements
- The site can add a native share button (`navigator.share`) as a first-class path on mobile.
- `navigator.canShare` can gate richer payloads and preserve current social-link fallback behavior.

### File System Access API (progressive enhancement)
- For export workflows, users can choose save locations more directly (where supported).
- Keep current PNG download as default; only enhance in supporting browsers.

### URL and history ergonomics
- Continued platform maturity around URL/History APIs makes your current deep-link model a strong baseline.
- Opportunity: standardize URL param normalization and future-proof with utility wrappers.

## 5) On-device AI capabilities relevant to `llm.js`

### Browser AI surface area is expanding
- Browser vendors are actively improving on-device inference options (WebGPU acceleration, local model execution pathways, and lighter model runtimes).
- This aligns with your privacy-friendly architecture and optional local generation model.

### Practical upgrade path for this repo
- Keep `tinyLlmClient.generateHeadline()` contract stable.
- Add a pluggable backend strategy:
  1. Tiny mock (current default).
  2. Optional WebGPU-backed runtime when available.
  3. Graceful fallback to curated list on timeout/error.
- Preserve current timeout discipline and local caching so UX remains deterministic.

## 6) Recommended near-term adoption roadmap

1. **Low risk**: add native share button with `navigator.share` + fallback to existing social links.
2. **Low risk**: introduce `@layer` in CSS to organize styles for easier maintenance.
3. **Medium risk**: apply container queries to command cards and headline module.
4. **Medium risk**: add subtle View Transition animation for headline swaps.
5. **Optional/experimental**: add pluggable local AI backend behind current `tinyLlmClient` interface.

## 7) Guardrails for adoption

- Preserve no-build, static-hosting compatibility.
- Use progressive enhancement and keep current behavior as fallback.
- Keep accessibility semantics first (focus handling, announcements, keyboard behavior).
- Validate against `SPECIFICATIONS.md` after each enhancement.
