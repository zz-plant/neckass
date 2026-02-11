# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Added
- Added a persistent daily desk streak indicator that tracks return-day momentum and celebrates key streak milestones (3/7/14 days) to encourage repeat usage.
- Added a root `robots.txt` that allows crawling and points search engines to the sitemap.
- Added a root `sitemap.xml` with the canonical homepage URL.

### Changed
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
