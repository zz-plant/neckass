# User Journey Critique (3 Typical Flows)

Date: 2026-02-09  
Method: Manual traversal in browser automation against `http://127.0.0.1:8001/`.

## Journey 1 — First-time visitor: land, shuffle, and share

### Steps traversed
1. Open homepage.
2. Read featured headline.
3. Press **Shuffle**.
4. Check that share links update for the new headline.

### What works well
- The page gives immediate orientation with clear hierarchy (masthead → hero → featured headline), making the first action obvious.
- **Shuffle** produced a different headline quickly and incremented the session counter, reinforcing that the action succeeded.
- Social links are visibly grouped and encoded with headline text/URL context, so sharing feels one-click.

### Constructive critique
- The generated headline can be substantially longer than the curated baseline, which causes visual rhythm changes between shuffles and may reduce scanability.
- Share actions are visible, but there is no explicit confirmation message after opening a share destination (status field is present, but the flow relies on browser tab behavior).

### Suggested improvements
- Add optional headline-length balancing (for generated content) to keep cards visually stable.
- Use the existing share status region for light in-app confirmation (for example: “Share window opened”).

## Journey 2 — Creator workflow: copy headline and export mock front page

### Steps traversed
1. Click **Copy headline**.
2. Click **Copy mock front page**.

### What works well
- Copy headline provided immediate positive feedback (“Headline copied to clipboard!”), which is strong UX for repeat creators.
- Export area is discoverable and presented as a practical extension of the headline workflow.

### Constructive critique
- Mock export reported: **“Export unavailable. Image renderer did not load.”** This is a clear message, but it ends the flow without a recovery path in-product.

### Suggested improvements
- Add a short inline recovery hint near the export status (for example: suggest using **Download mock front page** as fallback when renderer initialization fails).
- Consider a startup health check to pre-warn users if export dependencies are unavailable, avoiding late failure.

## Journey 3 — Returning user via deep link: filter context, keyboard navigation, clear filters

### Steps traversed
1. Open URL with query params (`section`, `q`, `source`).
2. Observe filter status and clear-filters visibility.
3. Use keyboard Arrow Right to shuffle.
4. Press **Clear filters**.

### What works well
- Filter status and clear-filters affordance were correctly activated from URL state, supporting shareable context.
- Keyboard shuffle worked and changed the headline, preserving a fast hands-on-keyboard interaction model.

### Constructive critique
- In this traversal, the filter status rendered only the search token (`"tax"`) instead of a richer combined summary (section/source/query), which can make context ambiguous for users opening shared links.
- After clearing filters, resulting URL still contained multiple state params (`section=latest&source=auto&panel=recent&layout=standard` plus headline slug). This may feel like filters are only partially reset from a user mental model.
- Immediately after keyboard shuffle, **Previous** remained disabled in this run, which can make navigation state feel inconsistent.

### Suggested improvements
- Render a fuller “active filters” sentence when multiple filter-like params are present.
- Align “Clear filters” behavior and URL cleanup with user expectation of a canonical neutral state.
- Audit Previous-button state updates specifically for keyboard-triggered navigation parity.

## Prioritized opportunities (small, targeted)
1. **Reliability**: strengthen mock export fallback guidance and preflight checks.
2. **State clarity**: improve filter summary language and URL reset semantics.
3. **Interaction consistency**: verify Previous-state behavior after keyboard navigation.
4. **Polish**: normalize generated headline length for better visual consistency.
