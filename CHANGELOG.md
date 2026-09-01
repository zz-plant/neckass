# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Added
- Added a real `404.html`. Cloudflare Pages was serving `index.html` with HTTP 200 for every unmatched path, which search engines read as soft-404 duplicate content across unlimited URLs.
- Added `bun run og:generate` (`scripts/generate-og.ts`) and a CI workflow that runs lint, `assets:check` and the smoke suite on every push and pull request.
- Added `scripts/serve.ts`, a Bun static server for local preview and the test suite, removing the repo's only dependency on Python.
- Added an indexable `prompts.html` page with crawlable headline prompt categories and starter prompt ideas, then linked it from primary navigation and existing SEO content blocks.
- Added a browser-callable agent interface (`window.Neckass.agent`) with tool-style actions (`get_state`, `shuffle`, `generate`, filter updates, and headline selection/listing) so agentic LLM runtimes can integrate without DOM-click scripting.
- Added an optional Playwright smoke-test harness (`tests/smoke.spec.mjs`) for shuffle, URL restore, share-link, and export-availability checks.
- Added a persistent daily desk streak indicator that tracks return-day momentum and celebrates key streak milestones (3/7/14 days) to encourage repeat usage.
- Added a root `robots.txt` that allows crawling and points search engines to the sitemap.
- Added a root `sitemap.xml` with the canonical homepage URL.
- Added an Automation beta command-rail card with a copyable agent snippet and API waitlist CTA, plus a local growth metrics snapshot card that tracks key actions and copies an investor-friendly metrics JSON payload.

### Removed
- Removed 279 unreferenced icons of 289; the ten the interface actually uses remain.
- Removed `selectReadableColor()` and the colour subsystem only it reached (133 lines), including a `getComputedStyle` call that ran at module parse time.
- Removed four hand-added PNGs in `docs/assets/` that were not generator output and were referenced by nothing, plus an unreferenced root `neckass-demo.png`.

### Changed
- Social preview images are PNG rather than SVG. No major platform renders SVG link previews, so shared neckass.com links had shown no image at all; `prompts.html` was additionally serving the examples card.
- Unified the palette on the warm gazette identity. Light mode had been generic cool grey while dark mode and the headline ink were warm, and the primary button was a cobalt that no other token agreed with.
- The headline takes its colour from `--ink-display` instead of a random per-shuffle palette colour whose contrast was checked against a hardcoded background constant. Measured 12.3:1 on light, 13.1:1 on dark.
- Fraunces is self-hosted; the render-blocking Google Fonts `@import` is gone, so the page makes no third-party request.
- Fixed the asset generator, which scaled a 400x200 source in absolute units and so rendered a small logo in the corner of every large canvas. `assets:check` and `assets:generate` now share one scene list.
- Expanded active-filter detection/status summaries to include panel/layout state so deep-linked context is clearer and clear-filters behavior remains semantically complete.
- Improved mobile action discoverability and share clarity with a compact "More actions below" cue and a one-line share explainer in the command rail.
- Refined export-unavailable messaging with a clearer recovery path (reload, then try download).
- Tightened verbose streak, quick-action, feedback, automation, and export fallback copy to keep the UI concise while preserving accessibility messaging.
- Added optional haptic feedback for shuffle, copy, share, export, favorites, and RLHF labeling actions (with reduced-motion and unsupported-browser safeguards).
- Clarified `DEVELOPMENT.md` module boundary rules (app orchestration vs UI rendering vs persistence/integration modules) and documented an optional non-required build path.
- Simplified the headline card by removing the mobile quick-actions helper hint and tightening the helper sentence copy.
- Standardized share/export success and fallback status wording for clearer, consistent feedback.
- Added clear-filters toast confirmations ("Filters cleared." / "Filters already clear.") to reinforce reset actions.
- Rebalanced mobile quick-action hierarchy by shifting export to a secondary full-width quick action and trimming helper copy.
- Restored clear-filters URL/history synchronization so headline, metadata, and URL state stay aligned after reset.
- Cleaned duplicate toast positioning declaration in `styles.css`.
- Streamlined headline helper copy and expanded mobile quick-jump actions to include export.
- Unified small-screen responsive rules under a single `max-width: 600px` breakpoint for more predictable layout behavior.
- Improved status message consistency across share and export flows.
- Refined the headline experience with clearer onboarding microcopy, mobile quick-jump actions to copy/share sections, improved command-rail accessibility landmarks, and a global success toast paired with inline status messaging.
- Rebalanced visual hierarchy by softening the mock export card emphasis, improved error text contrast, and added empty-state action guidance when filters yield no headlines.
- Iterated on tiny LLM humor tuning with punchier beat pools and stricter candidate scoring/selection so generated headlines land funnier more consistently.
- Tuned tiny local LLM headline generation to rank multiple candidates and prefer higher-humor outputs while still avoiding recent duplicates.
- Modernized the contributor/developer documentation set (`README`, `CONTRIBUTING`, `DEVELOPMENT`) with clearer workflow, architecture mapping, and validation guidance.
- Refreshed governance docs (`SECURITY`, `CODE_OF_CONDUCT`) with clearer reporting, response, and enforcement language.
- Updated `AGENTS.md` to reflect the current modular architecture and current agent guardrails.
- Strengthened SEO metadata in `index.html` with absolute canonical/social image URLs, OG/Twitter image alt text, locale tagging, and expanded structured data for site search discovery.
- Followed up SEO metadata hardening by extending robots directives (`max-image-preview:large`), adding `og:image:secure_url`, and keeping runtime Twitter title/description/url metadata synchronized with the active headline state.
- Modernized runtime behavior with progressive enhancement for View Transitions, background-priority state persistence (`scheduler.postTask`/`requestIdleCallback` fallback), and `structuredClone` snapshots to keep interactions responsive on modern browsers without breaking static hosting.
