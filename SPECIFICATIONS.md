# Neckass Headlines — Current Feature Specifications

This document captures the **current, in-repo feature set** for the Neckass Headlines page, based on `index.html`, `styles.css`, `script.js`, and `llm.js`. It doubles as a specification checklist for validating the live experience as it is built today.

## Feature audit summary
- **Rendered UI in `index.html`**: topbar masthead, hero block, featured headline card with shuffle/previous controls, filter status row with a clear-filters button, command rail cards (command intro, clipboard copy, social share links, mock front page export).【F:index.html†L9-L150】
- **Script-only capabilities not currently rendered in `index.html`**: optional controls for generator-only actions, headline history list, favorites, search, section/source/panel/layout toggle buttons, copy headline link, and additional social links (LinkedIn/Threads/Bluesky). These hooks exist in `script.js` and become active only if the related elements are added to the DOM later.【F:script.js†L169-L221】【F:script.js†L1388-L1440】

## Page-wide expectations
### Document metadata
- `<html lang="en">` is set, document title is **"Neckass Headlines"**, and a non-empty meta description is present in the HTML head.【F:index.html†L1-L15】
- Open Graph tags are provided for title, description, image, and URL in the static HTML head; the `og:image` metadata references `og-image.svg` (SVG image metadata for 1200×630).【F:index.html†L16-L23】
- `script.js` updates metadata at runtime when a headline is rendered, including `<title>`, `meta[name="description"]`, and Open Graph tags for title/description/url. It also writes (or updates) a canonical link element to match the current headline URL state.【F:script.js†L1049-L1095】

### Fonts & base theming
- Fonts load from Google Fonts for **Inter** and **Fraunces**; body uses Inter and headline typography uses Fraunces (with system fallbacks).【F:styles.css†L1-L18】【F:styles.css†L112-L129】
- CSS root variables define the color palette, radius, and shadow for the light theme; body uses `--bg` and `--text` with a soft paper-like surface aesthetic.【F:styles.css†L7-L18】【F:styles.css†L20-L30】

### Layout grid & spacing
- Content is wrapped in `.page-shell` (max width 1100px) with rounded corners, border, and shadow. The layout uses a single column under 900px and a two-column grid at ≥900px with a sticky command rail. Body padding is 28/24/48 px (responsive adjustments on small screens).【F:styles.css†L32-L74】【F:styles.css†L200-L272】

## Masthead (topbar)
- The topbar contains the brand block (“Neckass” and “Digital Gazette”). The row is separated from the hero by a bottom border and margin spacing.【F:index.html†L20-L25】【F:styles.css†L40-L88】【F:styles.css†L175-L199】

## Hero section
- Eyebrow text: **“Ridiculous news desk”** in uppercase styling.【F:index.html†L25-L35】
- Heading: **“Neckass Headlines Generator”** in `h1` using the headline font.【F:index.html†L26-L31】
- Lede: **“Dive into a feed where shuffles deliver share-ready scoops.”**【F:index.html†L27-L31】
- Pill list contains exactly three pills: **Instant shuffle**, **Dark mode ready**, **Share-ready format**.【F:index.html†L29-L33】
- Meta line: **`#masthead-date`** starts as “Updated daily” and is replaced on load with a localized date + “· Digital edition”.【F:index.html†L23-L36】【F:styles.css†L95-L119】【F:script.js†L1237-L1261】
- Daily return line: **`#daily-streak`** announces a local-storage-backed day streak and visit cadence (e.g., first visit encouragement, same-day return count, and streak extension prompts) and updates on load with `aria-live="polite"`.

## Featured headline section
### Structure & labels
- Section label includes an accent dot and **“Featured headline”** text.【F:index.html†L42-L51】
- Headline element: `<h2 id="headline" tabindex="0" aria-label="Headline">` with initial text “Loading...”.【F:index.html†L52-L55】
- Helper line below the headline reads **“Shuffle for a fresh line, then copy or share it instantly.”**【F:index.html†L99-L102】
- Filter status row shows **“All headlines”** by default in `#filter-status` and includes a **“Clear filters”** button (`#clear-filters`).【F:index.html†L91-L94】

### Controls & loader
- Buttons:
  - **Previous** (`#prev-btn`, aria-label “View Previous Headline”).
  - **Shuffle** (`#next-btn`, aria-label “Shuffle headline”).
  - On small screens, quick-jump buttons route to copy/share/export cards (`#jump-copy`, `#jump-share`, `#jump-export`), with export styled as a secondary full-width quick action.
- Loader element: `<div id="loader" class="loader" role="status" aria-live="polite" aria-hidden="true">Loading...</div>`. Loader visibility is toggled via the `.is-visible` class and `aria-hidden` state updates during transitions.【F:index.html†L65-L70】【F:styles.css†L149-L161】【F:script.js†L1193-L1218】

### Headline behavior
- Headlines are randomly selected from the curated `headlines` array; additional generated headlines can be appended when the tiny LLM helper succeeds. Next/Shuffle prefers generated headlines if filters indicate so and the generator is available; otherwise it shuffles curated headlines. The next headline differs from the current headline whenever possible.【F:script.js†L31-L115】【F:script.js†L219-L269】【F:script.js†L1325-L1343】
- Previous navigates back through the stored navigation stack and removes the last index if you go backward. It is disabled whenever the stack has fewer than two items or while loading.【F:script.js†L251-L273】【F:script.js†L445-L452】
- On render, the headline text color is set using `selectReadableColor()`, which adjusts for brightness and enforces a minimum contrast ratio against the background color token. The update includes a short animation delay (60ms) to show the loader before revealing text.【F:script.js†L26-L30】【F:script.js†L342-L371】【F:script.js†L152-165】

### Filter status row
- The filter status text reflects active filters (section, query, source) when they exist and resets to **“All headlines”** when no filters are active.
- The Clear filters button is hidden and disabled unless filters are active; clicking it resets filters and refreshes the headline set. (In the current HTML, filter controls other than the Clear button are not rendered; filters can still be supplied via URL parameters.)【F:script.js†L640-L707】【F:script.js†L739-L820】

### Accessibility
- `h2#headline` remains focusable (`tabindex="0"`) so screen readers can re-announce it after updates.
- Loader uses `role="status"` with `aria-live="polite"`.
- Buttons retain visible focus outlines via CSS `:focus-visible` styling.【F:index.html†L45-L70】【F:styles.css†L129-L147】

## Command rail (right column on wide screens)
### Command intro card
- Card heading “Command desk” with helper text **“Shuffle, copy, share.”**
- Contains an action map with three steps (Shuffle, Copy, Share) and a “Live session” pill.
- “Headlines viewed” counter shows the count of unique headlines seen in the current session/state (`#counter`).【F:index.html†L74-L98】【F:styles.css†L163-L218】【F:script.js†L437-L439】

### Clipboard copy card
- Label **“Clipboard”** with helper text **“Grab the headline for your next post.”**
- `#copy-btn` copies the current headline to the clipboard. It prefers the Clipboard API and falls back to a hidden `<textarea>` + `document.execCommand('copy')`.
- Status text `#copy-status` is updated on success (“Headline copied to clipboard!”) or error (“No headline available to copy.”, “Copy failed. Please try again.”, “Clipboard unavailable in this browser.”). Errors toggle the `.error` class for color changes.【F:index.html†L100-L108】【F:script.js†L1096-L1191】【F:styles.css†L149-L157】

### Social share card
- Header text **“Share the latest scoop”** with helper text **“Send it anywhere.”**【F:index.html†L126-L129】
- Links for Twitter, Facebook, and Reddit (each with icon and label). URLs update on every headline change and include the encoded headline and a canonical URL with query parameters (`headline`, `section`, `q`, `source`, `panel`, `layout`).【F:index.html†L110-L132】【F:script.js†L422-L452】【F:script.js†L955-L1034】
- The links open in a new tab (`target="_blank"`) and include `rel="noreferrer"` and `aria-label` values that describe each destination.【F:index.html†L116-L132】

### Mock front page export card
- Header text **“Mock front page”** with helper text **“Download or copy the layout.”**
- Mock front page contains a masthead, current date, headline, and “Published” dateline.
- Two actions:
  - **Download mock front page** (`#download-mock`), which renders the mock to PNG via `html-to-image` and triggers a download.
  - **Copy mock front page** (`#copy-mock`), which renders the mock to a blob and attempts `navigator.clipboard.write()`. If clipboard image copy is unavailable, it falls back to downloading a PNG and reports “Clipboard unavailable. Downloaded front page.”
- Status text `#export-status` reports success or failure messages after export attempts (for example “Preparing export…”, “Downloaded front page.”, and clipboard-download fallback messaging). A global toast (`#global-toast`) provides compact success feedback for copy/share/export actions while inline status remains visible near each control.【F:index.html†L163-L187】【F:modules/mock-export.js†L13-L59】【F:modules/app.js†L1037-L1043】

## Tiny LLM headline generator (`llm.js`)
- `llm.js` exposes a global `tinyLlmClient.generateHeadline()` that returns a promise with:
  - A randomized headline template that draws from subject/verb/object/impact pools and avoids recently generated duplicates.
  - A simulated latency delay between 420–880ms and a hard timeout at 2400ms. If the generation promise loses the race to timeout, it throws an error and `script.js` falls back to curated headlines.
  - A recent headline cache stored in localStorage (`tinyLlmRecentHeadlines`).【F:llm.js†L1-L241】

## Headline generation v2 specification (proposed)

This section defines a **v2 generation model** that keeps the app fully static/no-build while improving output quality, predictability, and accessibility-safe behavior. The v2 contract is additive: it can run alongside the current generator until rollout is complete.

### Product goals
- Generate headlines that feel more intentional and less repetitive while preserving the satirical tone.
- Keep generation resilient in constrained environments (local file, no network, older browsers).
- Provide deterministic behavior when users apply filters, so Shuffle feels relevant to the selected context.
- Make generator outcomes inspectable for debugging and future tuning without shipping analytics dependencies.

### Non-goals
- No server calls or external LLM dependency.
- No new build tooling, bundlers, or transpilation requirements.
- No breaking changes to existing keyboard controls, copy/share/export flows, or URL semantics.

### Optional modern-web enhancements (progressive)
- v2 **may** use modern browser capabilities as progressive enhancements, with graceful fallback to the current baseline behavior.
- Recommended candidates:
  - `crypto.getRandomValues()` for stronger randomization than `Math.random()` when available.
  - `Intl.Segmenter` for better tokenization in query/relevance scoring.
  - `requestIdleCallback` for low-priority cache cleanup/diagnostic pruning.
  - `AbortController` to cancel stale in-flight generation requests when users rapidly shuffle.
  - Web Worker offload for candidate scoring if profiling shows main-thread jank.
- Compatibility contract:
  - Never require these APIs for core headline generation.
  - Feature-detect every API and fall back to lightweight synchronous logic.
  - Preserve direct `file://` compatibility and no-build/static hosting.

### v2 generator interface
- Expose `tinyLlmClientV2.generateHeadline(options)` as an async function.
- `options` shape:
  - `section?: string` — preferred section (for example: Local, Politics, Sports).
  - `source?: "curated" | "generated" | "any"` — generation preference.
  - `query?: string` — optional free-text constraint used as a soft relevance hint.
  - `exclude?: string[]` — headlines to avoid (typically recent stack entries).
  - `seed?: number` — optional deterministic seed for reproducible outputs.
- Return shape:
  - `headline: string`
  - `section: string`
  - `confidence: number` (0–1 heuristic score)
  - `reasonCodes: string[]` (debuggable labels like `"query-match"`, `"novel-structure"`)
  - `generatedAt: string` (ISO timestamp)

### Generation pipeline
1. **Context assembly**
   - Build a compact context object from active filters and URL state (`section`, `q`, `source`).
   - Normalize text (trim, collapse whitespace, lowercase for matching only).
2. **Candidate synthesis**
   - Assemble 12–24 candidates by combining template slots and phrase pools.
   - Use weighted pools by section so output reflects selected context before ranking.
3. **Scoring and ranking**
   - Score each candidate with a weighted heuristic:
     - Relevance to `query` tokens.
     - Novelty against recent generated/cache history.
     - Structural diversity (length/pattern variance).
     - Readability guardrail (avoid awkward punctuation clusters).
   - Select the highest-scoring candidate above a minimum threshold.
4. **Fallback handling**
   - If no candidate meets threshold, lower threshold once and retry ranking.
   - If still unavailable, throw a typed error consumed by existing curated fallback logic.

### Quality guardrails
- **Length target:** 45–110 characters, hard cap at 140.
- **Duplicate suppression:** no exact match with the last 30 generated headlines.
- **Near-duplicate suppression:** reject candidates with very high token overlap against last 10 shown headlines.
- **Safety/tone:** avoid direct harassment terms and preserve absurd-news voice rather than personal attacks.
- **Formatting:** sentence case headline text, no trailing punctuation unless stylistically required.

### State and persistence
- New localStorage key: `tinyLlmV2Recent` containing up to 60 entries with timestamps.
- Maintain backward compatibility with `tinyLlmRecentHeadlines`; on first load, migrate legacy entries into the new structure.
- Persist lightweight diagnostics only in memory for current session (no network reporting).

### Performance and resilience requirements
- Simulated generation latency: 280–720ms (faster than v1) with jitter.
- Hard timeout: 1800ms.
- On timeout or exception, return control to existing curated shuffle path with no blocking UI state.
- Generator must remain safe when localStorage is unavailable (private mode or quota errors).

### Accessibility and UX requirements
- Existing loader/status live regions remain the source of truth for announcing generation progress.
- Error messages must reuse established tone (brief, plain-language, action-oriented).
- Shuffle interaction must always conclude with either:
  - a newly rendered headline, or
  - a clear fallback outcome with controls restored.

### Integration plan
- Phase 1: ship `tinyLlmClientV2` behind a constant feature flag in `script.js` (default off).
- Phase 2: dual-run scoring in development mode to compare v1 vs v2 outputs without user-visible changes.
- Phase 3: enable v2 by default and retain v1 as emergency fallback path for one release window.
- Phase 4: remove v1-only code after stability checklist passes.

### Acceptance criteria
- With no filters, 20 consecutive Shuffles produce at least 16 unique headlines.
- With a section filter enabled, at least 80% of 20 generated headlines align to that section's phrase pool.
- With a query filter, generated headlines contain at least one query token (or close variant) in at least 60% of attempts.
- Timeout/error paths never leave loader visible or controls disabled after completion.
- Previous navigation continues to function across mixed curated+generated sessions.

### Validation checklist for implementation
- Add unit-style deterministic checks for seed-based reproducibility of candidate ranking.
- Add regression checks for duplicate suppression window behavior.
- Verify local file (`file://`) and `python -m http.server` workflows both function.
- Manually validate keyboard navigation, copy/share/export actions after v2 integration.

## Persistence & URL state
- LocalStorage keys:
  - `navigationStack`, `uniqueHeadlines`, `generatedHeadlines`, `favoriteHeadlines`, `headlineFilters` (current keys), plus legacy keys `headlinesViewed`, `viewedHeadlines`, `viewedStack` for backward compatibility.
- `navigationStack` is sanitized against current headline count; `uniqueHeadlines` falls back to the sanitized stack when missing.
- URL query parameters mirror filter state and the current headline: `headline`, `section`, `q`, `source`, `panel`, `layout`. Each headline render pushes or replaces history state and updates these parameters to enable direct linking and back/forward navigation restoration.【F:script.js†L1-L52】【F:script.js†L1413-L1499】【F:script.js†L882-L1047】

## Keyboard interactions
- Arrow Right / Arrow Down trigger **Shuffle**.
- Arrow Left / Arrow Up trigger **Previous**.
- Key navigation is disabled when focus is inside editable elements (inputs, textareas, buttons, etc.).【F:script.js†L860-L880】

## Error and edge cases
- If no eligible headlines exist (because the list is empty or filters are too strict), the headline shows “No headlines available.” or “No headlines match your current filters.” The Shuffle button is disabled and loader is hidden.【F:script.js†L388-L416】
- Metadata and social links are reverted to the base metadata and canonical URL (headline parameter removed) when there is no valid headline index.【F:script.js†L388-L407】
- `selectReadableColor()` never returns undefined; it guarantees a return by either using the palette color, darkening it, or blending it for minimum contrast ratio (4.5).【F:script.js†L394-L407】【F:script.js†L1515-L1652】

## Responsive behavior checkpoints
- **≥900px width**: two-column grid with sticky command rail at 24px from top.
- **541–899px width**: one-column stack with reduced hero margin.
- **≤600px width**: tighter body padding, stacked action buttons, visible quick-jump controls, full-width copy button, and reduced headline text size.【F:styles.css†L552-L669】

## Accessibility checklist
- All visible buttons and links have discernible text or `aria-label`s.
- Loader and status text areas use `aria-live="polite"` to announce updates.
- Visible focus outlines are preserved for keyboard navigation (`button:focus-visible`).【F:index.html†L45-L132】【F:styles.css†L129-L147】
