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
- The topbar contains the brand block (“Neckass” and “Digital Gazette”) and a "Live desk" session pill. The row is separated from the hero by a bottom border and margin spacing.【F:index.html†L12-L21】【F:styles.css†L40-L93】【F:styles.css†L175-L199】

## Hero section
- Eyebrow text: **“Ridiculous news desk”** in uppercase styling.【F:index.html†L25-L35】
- Heading: **“Neckass Headlines Generator”** in `h1` using the headline font.【F:index.html†L26-L31】
- Lede: **“Dive into a feed where shuffles deliver share-ready scoops.”**【F:index.html†L27-L31】
- Pill list contains exactly three pills: **Instant shuffle**, **Dark mode ready**, **Share-ready format**.【F:index.html†L29-L33】
- Meta line: **`#masthead-date`** starts as “Updated daily” and is replaced on load with a localized date + “· Digital edition”.【F:index.html†L23-L36】【F:styles.css†L95-L119】【F:script.js†L1237-L1261】

## Featured headline section
### Structure & labels
- Section label includes an accent dot and **“Featured headline”** text.【F:index.html†L42-L51】
- Headline element: `<h2 id="headline" tabindex="0" aria-label="Headline">` with initial text “Loading...”.【F:index.html†L52-L55】
- Deck text below the headline reads **“Lead with the line below.”**【F:index.html†L56-L56】
- Filter status row shows **“All headlines”** by default in `#filter-status` and includes a **“Clear filters”** button (`#clear-filters`).【F:index.html†L58-L63】

### Controls & loader
- Buttons:
  - **Previous** (`#prev-btn`, aria-label “View Previous Headline”).
  - **Shuffle** (`#next-btn`, aria-label “Shuffle headline”).
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
- Header text **“Share the latest scoop”** with helper text **“Send it anywhere.”**【F:index.html†L110-L115】
- Links for Twitter, Facebook, and Reddit (each with icon and label). URLs update on every headline change and include the encoded headline and a canonical URL with query parameters (`headline`, `section`, `q`, `source`, `panel`, `layout`).【F:index.html†L110-L132】【F:script.js†L422-L452】【F:script.js†L955-L1034】
- The links open in a new tab (`target="_blank"`) and include `rel="noreferrer"` and `aria-label` values that describe each destination.【F:index.html†L116-L132】

### Mock front page export card
- Header text **“Mock front page”** with helper text **“Download or copy the layout.”**
- Mock front page contains a masthead, current date, headline, and “Published” dateline.
- Two actions:
  - **Download mock front page** (`#download-mock`), which renders the mock to PNG via `html-to-image` and triggers a download.
  - **Copy mock front page** (`#copy-mock`), which renders the mock to a blob and attempts `navigator.clipboard.write()`. If clipboard image copy is unavailable, it falls back to downloading a PNG and reports “Clipboard unavailable, downloaded instead.”
- Status text `#export-status` reports success or failure messages after export attempts.【F:index.html†L134-L149】【F:script.js†L1232-L1318】

## Tiny LLM headline generator (`llm.js`)
- `llm.js` exposes a global `tinyLlmClient.generateHeadline()` that returns a promise with:
  - A randomized headline template that draws from subject/verb/object/impact pools and avoids recently generated duplicates.
  - A simulated latency delay between 420–880ms and a hard timeout at 2400ms. If the generation promise loses the race to timeout, it throws an error and `script.js` falls back to curated headlines.
  - A recent headline cache stored in localStorage (`tinyLlmRecentHeadlines`).【F:llm.js†L1-L241】

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
- **≤540px width**: tighter body padding, stacked action buttons, full-width copy button, and smaller headline text size on very small screens (≤600px).【F:styles.css†L200-L288】

## Accessibility checklist
- All visible buttons and links have discernible text or `aria-label`s.
- Loader and status text areas use `aria-live="polite"` to announce updates.
- Visible focus outlines are preserved for keyboard navigation (`button:focus-visible`).【F:index.html†L45-L132】【F:styles.css†L129-L147】
