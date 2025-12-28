# Neckass Headlines Specification

This document provides testable specifications for the Neckass Headlines page so that changes can be validated through specification-driven development. Each section lists expected data, layout, interactions, and accessibility behaviors.

## Page-wide expectations
- **Document metadata**
  - Title text: "Neckass Headlines".
  - `<html lang="en">` must be set.
  - Meta description present and non-empty.
- **Generation runtime**
  - `llm.js` must expose a global `tinyLlmClient.generateHeadline()` helper that returns a non-empty string with built-in timeout/error handling.
  - `handleNext` prefers `tinyLlmClient` output and falls back to the static `headlines` array if generation fails or is unavailable.
- **Layout**
  - Body uses a single-column flow up to 540px viewport width, a two-column grid with a feature stack and command rail above 900px, and one-column stacking between 541–899px.
  - The command rail is sticky near the top of the viewport on wide layouts and falls back to normal flow on narrow screens.
  - Maximum content width: 1100px; body padding of at least 18px on small screens and 24px on larger screens.
- **Color themes**
  - Default theme values must match the CSS root variables in `styles.css`.
- **Font**: Inter family (or system fallbacks) is loaded via Google Fonts link.
- **Keyboard support**: All interactive controls (buttons, social links) are reachable via `Tab` order with visible focus outlines inherited from browser defaults or custom styles.

## Hero section
- **Content**
  - Eyebrow text: "Ridiculous news desk" using `.eyebrow` style.
  - Heading: `<h1>` with text "Neckass Headlines Generator".
  - Lede paragraph begins with "Dive into a feed where".
  - Pills list contains exactly three `<span class="pill">` items: "Instant shuffle", "Dark mode ready", "Share-ready format".
- **Layout & spacing**
  - Hero sits above the grid with a bottom margin of 18px on small screens and 28px otherwise.
  - Pill items wrap when horizontal space is limited and maintain 10px gaps.
- **Accessibility**
  - Heading hierarchy starts at `h1` with no skipped level before the main content.

## Headline section (Featured headline)
- **Structure & labels**
  - Section contains label text "Featured headline" plus an accent dot.
  - Headline element: `<h2 id="headline">` with default text "Loading..." and `tabindex="0"`.
  - Loader element: `<div id="loader" class="loader" role="status" aria-live="polite" aria-hidden="true">Loading...</div>`.
- **Data & behavior**
  - Headlines are chosen randomly from the `headlines` array in `script.js`.
  - Initial render: if stored navigation state exists, render that headline; otherwise trigger a random headline.
  - Next button selects a random headline different from the current one when more than one headline exists; if the array is empty, display "No headlines available." and disable the Next button.
  - Previous button navigates back through the navigation stack and is disabled when fewer than two items exist in the stack.
  - Loader visibility toggles with headline updates: shown during headline transition (setTimeout delay) and hidden afterward; `aria-hidden` matches visibility state.
  - Headline text color is set using `selectReadableColor`, adjusted for dark mode brightness threshold.
- **Layout**
  - Headline wrapper reserves at least 150px height to avoid layout shifts during loading.
- **Accessibility**
  - Headline updates should announce via focusable `h2` and `aria-live` status on loader.
  - Buttons include explicit `aria-label` attributes matching their actions.

## Controls panel (Command rail)
- **Shell and intro**
  - The command rail sits in its own column on wide screens with a sticky stack of cards.
  - Controls card opens with a "Command desk" eyebrow and helper text plus a pill chip indicating a live session.
- **Headlines viewed counter**
  - Label text: "Headlines viewed"; numeric value in `#counter` shows count of unique headlines seen in the current storage state.
  - Counter updates whenever a headline is added to `uniqueHeadlines`.
- **Clipboard copy**
  - Text block label "Clipboard" with helper text "Grab the headline for your next post.".
  - `#copy-btn` copies the current headline text using Clipboard API when available; fallback uses hidden textarea and `document.execCommand('copy')`.
  - Success message: "Headline copied to clipboard!" in `#copy-status` with no `error` class. Failure messages include "Unable to access clipboard.", "Copy failed. Please try again.", or "Clipboard unavailable in this browser." and must toggle the `error` class.
  - If fallback copy throws, the Copy button is disabled.
- **Layout**
  - Controls card uses glass styling with a bordered intro block, 22px padding, and separated rows for the copy actions.
- **Accessibility**
  - Copy status uses `aria-live="polite"` and `role="status"`.

## Social share section
- **Content & links**
  - Section header label: "Share the latest scoop" with helper text about sharing.
  - Contains three links with IDs `twitter-share`, `facebook-share`, `reddit-share` each wrapping an icon `<img>` and text label.
  - Icon images load SVG files from `icons/` with `alt` matching the platform name followed by "icon".
- **Behavior**
  - Links open in a new tab (`target="_blank"`).
  - When headline text changes, share URLs update to include the encoded headline and current page URL in their respective query parameters: `text` + `url` + hashtag for Twitter, `u` + `quote` for Facebook, `url` + `title` for Reddit.
- **Layout**
  - Social share lives as its own glass card within the command rail; links stack in a grid with 10px gaps and 12px padding per item, and hover state lifts by 1px while changing background to `#fff9f2`.
- **Accessibility**
  - Each link includes an `aria-label` describing the destination, e.g., "Share on Twitter".

## Mock front page export
- **Content**
  - Section header label: "Mock front page" with helper text about downloading or copying.
  - Buttons `#download-mock` and `#copy-mock` remain present with the same labels.
- **Behavior**
  - Export actions remain wired to the existing download/copy logic in `script.js`.
- **Layout**
  - Export controls appear as a dedicated glass card in the command rail with padded buttons and status text below.

## Persistence & state
- **LocalStorage keys**
  - `navigationStack`: JSON array of visited headline indices, sanitized to valid range on load.
  - `uniqueHeadlines`: JSON array of indices converted to a `Set` on load; if empty, defaults to sanitized stack values.
  - `viewedList` and `viewedCount`: legacy keys retained; `viewedList` used only when `navigationStack` is absent.
- **Restoration**
  - On page load, state restores using stored values filtered by total headline count; `currentIndex` is the last item of the navigation stack or `-1` when none.
  - Persisted state updates after each navigation or copy failure that disables the button.

## Error and edge cases
- If `headlines` array length is 0: show empty state message, hide loader, disable Next button, keep Previous button disabled.
- If `navigator.clipboard` is unavailable and fallback copy fails: show "Clipboard unavailable in this browser." and disable Copy button.
- Headline color selection must never return undefined; if color brightness exceeds the readability threshold, it is darkened by a factor of 0.7 for contrast.

## Responsive behavior checkpoints
- **≥900px width**: grid displays the feature stack alongside the sticky command rail with roughly 20px gap.
- **541–899px width**: grid collapses to one column and the rail cards flow after the feature stack; hero margin is 18px.
- **≤540px width**: body padding reduces to 12–18px; button rows stack vertically; copy rows align items to start and Copy button spans full width.

## Accessibility checklist
- All buttons and links have discernible text or `aria-label` values matching their function.
- Loader uses `role="status"` with polite announcements and toggles `aria-hidden` with visibility.
- Headline text remains focusable for screen readers via `tabindex="0"` and updates without page reload.
- Color contrast expectations: accent buttons use white text over gradient backgrounds; ghost buttons maintain at least the browser default contrast from text to background as defined in CSS variables.

