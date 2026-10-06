# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Changed
- The reference entry cites the record where it had invented one, and corrects it where it was wrong. The first dictionary entry under the one-word spelling is from March 2017, not 2018; it is quoted ("used to infuriate and confuse," "the same meaning" as *headass*), as is a December 2017 example in which the speaker cannot say what the word means. The entry credits African American English for *headass*, *lookin'-ass*, and the construction in "get yo neck ass outta here" (Collins, Moody, and Postal, *Language*, 2008), gives the demotion speakers describe ("demoted to the neck region"), and records the two meanings *neck* already had, from Green's Dictionary of Slang: a fool in American slang from 1908, and impudence in British, Irish, and Australian English since the 1890s. The standards' rule against explaining the neck stands.
- The paper is not placed anywhere. It is *The Gazette*: no town in the nameplate, the folio line, the page titles, the feed, the manifest or the cards, and no dateline on the deck. Orchard Lane, Mill Street, Route 9 and Depot Park are out of the leads, letters and calendar; the items read "the street," "the highway," "No. 12." The corrections box opens on yesterday's retraction, and at 560–759px the corrections pair with the weather. Every issue's dealt items re-deal, since two fewer pools draw on the seed; the leads and the corrections chain are unchanged.
- A copy pass over every page and pool. Every brief ends on a period, as the follow-ups and calendar briefs that share its column already did; a lead whose headline is also in the briefs pool is matched without the period, so it still never runs twice in one issue, and a smoke test walks two rounds to hold that. The calendar's curly apostrophes are straight, like every other pool's. Lists take the serial comma throughout, notices with a date use AP months (Oct. 25, Nov. 1), and the American forms replace the stray British ones (store credit, best by, call the office). Reported speech keeps its tense ("said he would"), quoted questions keep their question marks, and a pronoun with two possible antecedents names its noun (the salad, the post office). The entry introduces Collier before citing her study and no longer says the Gazette has never used *neckassery*, which its standards do. Every page title ends "| The Gazette"; the entry's share title had said "| Neckass". The standing issue's byline is "From wire reports," as the spec gives it. The café has four staff, none called Chief, in every item that counts them, and the letter about a man who has been in twice is now from the diner, since he has been to the café 300 times; the fridge correction raises the count to twelve instead of lowering it.
- One copy of the data and of the issue arithmetic. `data/*.js` and `modules/issue.js` are plain ES modules imported by both the browser and the edge, so the feed and the card cannot drift from the page: they run the same code. `functions/lib/issue.mjs` is now a thin UTC adapter over the shared module, and the pages load one `<script type="module">` whose import graph replaces the seven-script load order. The browser and the edge run the same clock-dependent arithmetic on their own dates: local for the reader, UTC for the Worker.
- The social card's layout and renderer are one function (`renderCardPng` in `functions/lib/card.mjs`), shared by the edge and the still cards; the edge card is drawn with Satori and resvg directly instead of `workers-og`.

### Removed
- The notices column and `data.NOTICES`, the calendar's town notices (council meetings, holiday office closures, the polling place, the fireworks), and `data.ROUTINE_CORRECTIONS`, the dull correction that ran first in every box. They were the furniture of a town that does not exist.
- `file://` support, which the previous data format existed to provide. The pages are ES modules and are served over HTTP (`bun run serve`).
- The build-time extraction of the leads (`scripts/build-feed-data.ts`, `functions/lib/leads.mjs`) and the drift check around it: the edge imports the data directly.
- The smoke test asserting worker and browser agree on the lead (same module now), the weather-cut layer test, and the icon-set test.
- `husky` and `lint-staged`; Biome via `bun run lint` and CI remains the gate.
- In `scripts/check-assets.ts`, the color-type, bit-depth and `source.svg` checks; the validator now checks what a committed deterministic generator can actually violate: existence, dimensions, minimum size.

### Added
- Two briefs from the places the word is actually said: a victory dance at 20–18, and a lamppost he had seen. They are briefs, not leads, because the lead deal is sized by its pool: a new lead would re-deal every back issue's lead and send the entry's citations to the wrong stories. Every issue's dealt items re-deal, since the briefs pool draws on the seed; the leads, the corrections chain, and the entry's citations are unchanged.
- The file cut is posed for the lead. Each lead names one of ten poses in `data/poses.js` (on the phone, asked about it, in his own defense, resting his eyes), and the front page sets it on an inlined copy of the rig, with the pose's caption in the cutline and its alt text on the figure. Inline, the cut takes the page's inks, so it follows the dark theme and the print sheet. The issue's card draws him in the same pose, and each still card takes its own. The rig's README points at the pose table instead of its own, whose "walking off" crossed his legs. A smoke test holds the rig, the inline copy, and the card's flattened copy to the same parts, pivots, and house pose.
- Standing matters: the witnesses with open files. Next door files on the 14th of each month about the recycling bin and the Gazette walks the letter back on the 15th; the package is reported on the 2nd, the $35 on the 4th, the hoodie on the 8th; his mother writes on Mother's Day and counts her reading in issues. Every count is computed from the issue's date, so a back issue carries the number as of that issue: read two months of the 14th and the bin letter has counted itself up. Calendar rules may set `from: 'YYYY-MM-DD'` and do not run before it.
- The front page carries a nameplate: *The Gazette* set large, as the page's visible `h1`, with the motto *One man, reported daily since Sept. 29, 2024.* under it. A reader arriving from a shared link was given a credit-size name and no statement of what the paper covers.
- *Earlier issues* in the lead: the three issues before this one, by their leads, each a link to the issue. On the broadsheet it fills the foot of the deck's column, which ran blank beside the headline.
- The correction retracting yesterday's lead ends *See No. n.*, linked to the issue it retracts.

### Changed
- An editorial pass over the pools. The items where the paper stopped reporting and started performing ("Neckass included," "The company is the bio") were flattened into facts, and the items that landed as three clipped beats were rewritten as one running sentence with the damning fact buried in a clause. The two-beat turn is untouched, the corrections keep their clipped form and the letters their witnesses' voices.
- The copy stops restating the navigation: the colophon carries the staff line, *Letters may be edited.* and the clipping link (the folio and the site links carry the rest), the earlier-issues fallback is the bare link, and the back issues, standards and 404 pages end on their content instead of a second set of site links.
- The social card sets the nameplate, the lead a size larger, the deck in the ink rather than grey, the file cut of him beside it, and the motto at the foot. The folio no longer runs into the paper's name.
- The still cards (`og-image.png`, `og-about.png`, `og-archive.png`, `og-prompts.png`) are drawn by the per-issue card's layout and renderer in Fraunces, not by `rsvg-convert` in Georgia and Helvetica, and lead with a line from the page they share rather than its title.
- The lead headline runs to 3.75rem on the broadsheet, and the corrections take the ink.

### Removed
- The wire: the headline shuffler under the issue, with its Previous/Next, four action buttons, three share links, history list, on-device generator (`llm.js`, `data/llm-beats.js`), agent API and `html-to-image` export. Half the JavaScript on the page served a feature the paper had replaced. The page loads one script, which handles no input, and ends on the colophon.
- `neckass-demo.gif`, which showed the shuffler.
- Dead code the defluff pass turned up: the ornament cut, which no page used; the `WebApplication` schema block on the front page, which restated the `WebSite` schema; the unused `Neckass.issue.FIRST_EDITION` export; and markup hooks with no rules behind them (`history-card` on the four reading pages, the `box--notices`, `-corrections` and `-letters` modifiers).

### Added
- Landmark editions (`data/editions.js`): the first edition, the hundredth, No. 288 (the hat), and the two anniversaries are written rather than dealt, each with its own lead so the corrections chain runs through it, and most with an editorial, which only a landmark prints. The entry's citations link to the issues they cite, and the issues contain what is cited. A date past today gets today's paper and a line saying when the one asked for goes to press.
- A follow-up on every lead: the brief that runs at the top of the next morning's column, in which he has done the next thing.
- The calendar (`data/calendar.js`, `modules/calendar.js`): dated items that run in place of a dealt one on the days they happen — the council's first and third Tuesday and Wednesday's report on it, the clocks going forward and back, his birthday (11 March; the paper does the arithmetic and his mother writes in), Thanksgiving and the day after, election day, the last day of every month, the paper's own anniversary. Every rule is a pure function of the date, so a back issue carries its holiday.
- `/card.png?issue=YYYY-MM-DD`: the issue's front page as a 1200×630 PNG, drawn at the edge by Satori and resvg (`workers-og`) in Fraunces on newsprint. The middleware points `og:image` and `twitter:image` at it, so a shared link previews with the day's headline in the picture as well as the text. The colophon offers it as the issue's clipping.
- A print stylesheet: ink on white, the broadsheet's columns whatever the sheet's width, nothing that only makes sense on a screen.
- The smoke suite runs the Pages Functions under `wrangler pages dev` alongside the static server and checks the card is a real PNG and the tags point at it.

### Fixed
- Leads could repeat where two rounds of the pool met: No. 52 and No. 53 ran the same story, and 24 leads came back inside a fortnight. The opening of each round is now kept clear of the last round's closing leads, in the page and at the edge. Past issues whose opening lead collided now carry a different one.
- The entry and the standards hang their heads in the margin at ≥900px, as specified; the grid columns were set but the block was never made a grid.

### Changed
- The lead headline links to the issue's own date, so the page a reader shares is the paper they read. The nameplate links home on every page.
- The archive opens with a month index under *Of note*; the run was 30 screens long on a desktop and 70 on a phone.
- The earlier issues beside the lead are set in the regular cut, a step smaller, so yesterday's leads read as an index and do not outweigh today's. The nameplate runs on one line at every width; on a phone it broke in two.
- The paper has no newsroom. The named staff writers, the editor and the managing editor are gone from the bylines, the editorials and the colophon, which reads *Editor-in-chief: vacant. Wire desk: unattended. Corrections: ongoing.* Leads are filed by *Staff report* or *From wire reports*.
- An editorial pass over every pool. Briefs that described without turning were rewritten to turn, or cut, and a dozen were added about what people do now: the message left on "seen," the thumbs-up to bad news, the voice note at double speed, the long reply deleted for "ok," the camera off "for bandwidth." Two leads were replaced — three ran the same joke about not leaving — with the nine-minute voice note and the eleven days on "seen." Decks and letters that took three sentences to land were cut to the one that lands. The classifieds pool lost the eight ads that only restated a lead's own ad and gained twelve. The paper stops saying bin, flat, satnav, windscreen, programme, car park and "at the weekend" in a town with a Route 9.
- A cull. Eighteen briefs that described without turning, or ran the same joke as another brief, three leads with no second beat (cutting back while ordering, standing nearby to help, the photographed menu), a correction, two forecasts, four ads and two letters. Every pool is still several times its deal.
- The letters are signed by what the writer is to him — next door, his housemate, his mother, the barber, the café, the groom, apparently — not by names and street addresses. The town is where he is; it is not a cast.
- Leads are dealt in rounds of the pool's length, each round its own shuffle, so no lead runs twice inside a round. A draw from the whole pool each day put the same lead a week apart often enough for the archive to show it.
- The archive lists every issue, by month, with its lead, and the landmark editions first, instead of 45 dates.
- The earliest issues are shorter, as the archive has always claimed: the briefs column grows from three to seven over the first year and the letters page carries one letter for the first two months.
- Fifteen more leads (40 → 55), each with all seven fields, and fourteen more letters (14 → 28) from the town: the barber, the clerk, the library, the gym, the commuter who had his seat.
- The council meeting and holiday collection changes left the notices pool, where they ran on days they were not happening.

### Changed
- A department head now sits under its rule rather than on top of one. With the rule beneath it the head was as far from its own list as from the department above; set cutoff rule, head, then copy, each department starts on one line, and the heads of two columns side by side draw one rule across the fold. The lead's bottom rule, the lower row's top rule and the wire's dangling bottom rule went with it, and a reading page's title no longer prints a second 3px teal rule a hundred pixels under the masthead's.
- The deck and the letters are set in Fraunces at text size; the nameplate on the folio line is set in it at credit size. The face's optical-size axis was shipping unused.
- Controls are one vocabulary: a hairline in the running ink, 2px corners, no hover shadow. The four item actions are one ruled box with hairlines between the cells; the share targets are set like the site links; the wire's history is a ruled list, not a stack of 10px pills; the toast is a slip, not a pill.
- The clipping sheet is a piece of the paper: flat, slightly whiter stock with a hairline edge and its own folio line under the same teal cutoff. Its gradient ground, gradient top bar, gradient hairline and dashed footer are gone.
- The entry and the standards hang their department heads in the left margin beside each section's first paragraph above 900px, and the entry's source note sits in that margin beside the opening paragraph. Both pages ran a 68ch measure across a 1180px sheet and left the right two-fifths blank inside the frame.
- Back issues run in three ruled columns above 900px and two above 560px, in tabular figures; they were one bulleted spine of 45 underlined links. The current issue carries a tag under its date instead of a phrase that wrapped the first row.
- On the phone the sheet is the screen: no frame, no border, the desk visible only past its foot. The folio line stacks the date and the volume on a line each instead of orphaning "717"; under 1060px the name and site links share the first row and the date takes the second.
- Dark mode's ground drops a step under the plate so the sheet reads as a slab rather than a bordered box, the cutoff rule takes a teal a step down from the links so it does not glow, and light-on-dark type is antialiased in greyscale.

### Added
- RSS feed at `/feed.xml`, built per request from the calendar by a Cloudflare Pages Function.
- Per-issue social cards: middleware rewrites the front page's title and description to the day's lead, so a shared link previews with the headline actually running.
- A favicon set (SVG, ICO, apple-touch, 192/512 PNGs) and a web manifest, linked from every page. The site previously had no icon at all.

### Changed
- Repainted the palette as newsprint, ink and one second colour. The stock is groundwood grey-tan rather than cream, the ink is a warm near-black, and the display type takes that same ink instead of a colour of its own. The second colour is a ledger teal on the cutoff rule, links and the wire button, over a ground of that teal taken down to near-black. Every value previously sat in one hue family, which read as a sepia filter over the page.
- Buttons now draw their border, hover wash and shadow from `--control-*` tokens. They were fixed browns, so in dark mode every secondary button rendered with no visible edge.
- The back-issues list is set in ink with a quiet underline. Every line there is a link, so setting each one in the accent distinguished nothing and turned the page into a column of colour.
- Regenerated the favicon set, the four social cards, the fifteen `docs/assets` scenes and the cut fallbacks, and updated `theme-color` and the manifest colours, so nothing still carries the old palette. `favicon.ico` now holds a 32px frame alongside the 16px one, which the `<link>` had always claimed.
- Deepened every content pool so the paper stops repeating inside a week: leads 12 → 40, classifieds 16 → 60, corrections 14 → 39 standalone, letters 10 → 36, weather 10 → 40, briefs 81 → 121. Shortest cycle is now 12 days, was 3.
- The first correction in each issue now retracts a detail of the previous issue's actual lead, by name, instead of being drawn at random.
- Rewrote 16 flat or duplicative headlines and swapped three flat impacts, two limp rulings and one joke-less twist in the generator beats. Every entry now states a failure plus a fact, per the pool's register, and no headline repeats a joke another entry already tells. Ten observational entries gained mock-institutional asides ("The gym describes him as a benefactor.").

### Added
- Added a real `404.html`. Cloudflare Pages was serving `index.html` with HTTP 200 for every unmatched path, which search engines read as soft-404 duplicate content across unlimited URLs.
- Added `bun run og:generate` (`scripts/generate-og.ts`) and a CI workflow that runs lint, `assets:check` and the smoke suite on every push and pull request.
- Added `scripts/serve.ts`, a Bun static server for local preview and the test suite, removing the repo's only dependency on Python.
- Added an indexable `prompts.html` page with crawlable headline prompt categories and starter prompt ideas, then linked it from primary navigation and existing SEO content blocks.
- Added a browser-callable agent interface (`window.Neckass.agent`) with tool-style actions (`get_state`, `shuffle`, `previous`, `generate`, and headline selection/listing) so agentic LLM runtimes can integrate without DOM-click scripting.
- Added an optional Playwright smoke-test harness (`tests/smoke.spec.mjs`) for shuffle, URL restore, share-link, and export-availability checks.
- Added a persistent daily desk streak indicator that tracks return-day momentum and celebrates key streak milestones (3/7/14 days) to encourage repeat usage.
- Added a root `robots.txt` that allows crawling and points search engines to the sitemap.
- Added a root `sitemap.xml` with the canonical homepage URL.
- Added an Automation beta command-rail card with a copyable agent snippet and API waitlist CTA, plus a local growth metrics snapshot card that tracks key actions and copies an investor-friendly metrics JSON payload.

### Removed
- Removed the section/source/panel/layout filter system. It had no controls in `index.html`, so nothing but a hand-typed URL parameter could reach it, and the only visible trace was a "Clear filters" button that cleared filters nobody could set. `modules/filter-controls.js` and the filter half of `modules/filters.js` are gone, along with the filter keys in local storage, the `section`/`q`/`source`/`panel`/`layout` URL parameters, and the `set_filters`/`clear_filters` agent tools. `modules/sections.js` keeps the headline classifier, which still labels the section badge.
- Removed 279 unreferenced icons of 289; the ten the interface actually uses remain.
- Removed `selectReadableColor()` and the colour subsystem only it reached (133 lines), including a `getComputedStyle` call that ran at module parse time.
- Removed four hand-added PNGs in `docs/assets/` that were not generator output and were referenced by nothing, plus an unreferenced root `neckass-demo.png`.

### Changed
- Social preview images are PNG rather than SVG. No major platform renders SVG link previews, so shared neckass.com links had shown no image at all; `prompts.html` was additionally serving the examples card.
- Unified the palette on the warm gazette identity. Light mode had been generic cool grey while dark mode and the headline ink were warm, and the primary button was a cobalt that no other token agreed with.
- The headline takes its colour from `--ink-display` instead of a random per-shuffle palette colour whose contrast was checked against a hardcoded background constant. Measured 12.3:1 on light, 13.1:1 on dark.
- Fraunces is self-hosted; the render-blocking Google Fonts `@import` is gone, so the page makes no third-party request.
- Fixed the asset generator, which scaled a 400x200 source in absolute units and so rendered a small logo in the corner of every large canvas. `assets:check` and `assets:generate` now share one scene list.
- Improved mobile action discoverability and share clarity with a compact "More actions below" cue and a one-line share explainer in the command rail.
- Refined export-unavailable messaging with a clearer recovery path (reload, then try download).
- Tightened verbose streak, quick-action, feedback, automation, and export fallback copy to keep the UI concise while preserving accessibility messaging.
- Added optional haptic feedback for shuffle, copy, share, export, favorites, and RLHF labeling actions (with reduced-motion and unsupported-browser safeguards).
- Clarified `DEVELOPMENT.md` module boundary rules (app orchestration vs UI rendering vs persistence/integration modules) and documented an optional non-required build path.
- Simplified the headline card by removing the mobile quick-actions helper hint and tightening the helper sentence copy.
- Standardized share/export success and fallback status wording for clearer, consistent feedback.
- Rebalanced mobile quick-action hierarchy by shifting export to a secondary full-width quick action and trimming helper copy.
- Cleaned duplicate toast positioning declaration in `styles.css`.
- Streamlined headline helper copy and expanded mobile quick-jump actions to include export.
- Unified small-screen responsive rules under a single `max-width: 600px` breakpoint for more predictable layout behavior.
- Improved status message consistency across share and export flows.
- Refined the headline experience with clearer onboarding microcopy, mobile quick-jump actions to copy/share sections, improved command-rail accessibility landmarks, and a global success toast paired with inline status messaging.
- Rebalanced visual hierarchy by softening the mock export card emphasis, improved error text contrast, and added empty-state action guidance when no headlines are available.
- Iterated on tiny LLM humor tuning with punchier beat pools and stricter candidate scoring/selection so generated headlines land funnier more consistently.
- Tuned tiny local LLM headline generation to rank multiple candidates and prefer higher-humor outputs while still avoiding recent duplicates.
- Modernized the contributor/developer documentation set (`README`, `CONTRIBUTING`, `DEVELOPMENT`) with clearer workflow, architecture mapping, and validation guidance.
- Refreshed governance docs (`SECURITY`, `CODE_OF_CONDUCT`) with clearer reporting, response, and enforcement language.
- Updated `AGENTS.md` to reflect the current modular architecture and current agent guardrails.
- Strengthened SEO metadata in `index.html` with absolute canonical/social image URLs, OG/Twitter image alt text, locale tagging, and expanded structured data for site search discovery.
- Followed up SEO metadata hardening by extending robots directives (`max-image-preview:large`), adding `og:image:secure_url`, and keeping runtime Twitter title/description/url metadata synchronized with the active headline state.
- Modernized runtime behavior with progressive enhancement for View Transitions, background-priority state persistence (`scheduler.postTask`/`requestIdleCallback` fallback), and `structuredClone` snapshots to keep interactions responsive on modern browsers without breaking static hosting.
