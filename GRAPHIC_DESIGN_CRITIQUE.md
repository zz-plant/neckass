# Prioritized Graphic Design Change List

This is a focused, implementation-ready list of the **highest-value visual design changes** for Neckass, prioritized for impact while keeping edits small and spec-safe.

## P0 — Do first (highest impact)

1. **Reduce first-screen clutter around the headline**
   - **Change:** Hide or collapse one non-essential status/gamification block on initial load (e.g., streak badges or secondary meta), then reveal after first interaction.
   - **Why:** The headline should be the immediate focal point; current first viewport has too many competing elements.
   - **Where:** `index.html` (ordering/visibility), `styles.css` (spacing/visibility rules).
   - **Effort:** Low.

2. **Strengthen primary action hierarchy**
   - **Change:** Make one main CTA (generate/shuffle) visually dominant; tone down neighboring controls (ghost style, lower contrast).
   - **Why:** Improves task clarity and lowers cognitive load.
   - **Where:** `styles.css` button variants and action group styling.
   - **Effort:** Low.

3. **Fix small-text readability + contrast hotspots**
   - **Change:** Raise minimum small type size and contrast for muted labels (meta text, streak goals, dateline, helper copy).
   - **Why:** Directly improves readability and accessibility on mobile.
   - **Where:** `styles.css` for `.meta`, `.feedback-note`, `.streak-badge__goal`, `.mock-dateline`, related muted text tokens.
   - **Effort:** Low.

## P1 — Do next (high value, moderate scope)

4. **Simplify right-rail visual density**
   - **Change:** Merge adjacent command clusters where possible; reduce repeated dividers/borders and icon-heavy headings.
   - **Why:** Current rail feels visually busy, making features appear equally urgent.
   - **Where:** `index.html` section grouping, `styles.css` cluster/card styling.
   - **Effort:** Medium.

5. **Tighten typography system consistency**
   - **Change:** Reduce overuse of uppercase tracked micro-labels; define clearer size/line-height tiers for display, body, meta, and caption.
   - **Why:** Creates cleaner rhythm and better scan flow.
   - **Where:** `styles.css` type styles (`.eyebrow`, `.headline-label`, `.filter-label`, badge text).
   - **Effort:** Medium.

6. **Calm secondary interaction color states**
   - **Change:** Reserve orange for primary emphasis; use more neutral hover/border states for secondary buttons/links.
   - **Why:** Prevents accent fatigue and preserves CTA signal strength.
   - **Where:** `styles.css` button/link hover, border, and shadow states.
   - **Effort:** Medium.

## P2 — Polish pass (nice-to-have)

7. **Normalize spacing scale across sections**
   - **Change:** Align spacing to a consistent step scale (e.g., 4/8/12/16/24).
   - **Why:** Produces cleaner rhythm and reduces “almost aligned” feel.
   - **Where:** `styles.css` card padding/gaps/margins.
   - **Effort:** Medium.

8. **Reduce non-essential icon usage in labels**
   - **Change:** Keep icons on action controls; remove from lower-value section labels where text is sufficient.
   - **Why:** Lowers visual noise and improves content-to-chrome ratio.
   - **Where:** `index.html` section headings and label/icon pairs.
   - **Effort:** Low.

9. **Harmonize cool accent usage with warm palette**
   - **Change:** Desaturate or reduce frequency of blue accent states unless signaling a truly distinct system state.
   - **Why:** Improves palette coherence with the editorial warm base.
   - **Where:** `styles.css` streak/session accent tokens.
   - **Effort:** Low.

---

## Suggested execution order (single sprint)

- **Pass 1 (quick wins):** Items 1, 2, 3.
- **Pass 2 (structure):** Items 4, 5, 6.
- **Pass 3 (polish):** Items 7, 8, 9.

## Success checks after implementation

- First viewport clearly centers headline + one primary CTA.
- Small text remains readable on mobile without zoom.
- Secondary controls feel quieter than primary actions.
- Right rail scans in distinct groups rather than a single dense block.


## Implementation status

### Completed in current UI pass (P0 + P1)
- ✅ P0.1 Reduce first-screen clutter around the headline (streak badges + quick actions now progressively revealed on first interaction).
- ✅ P0.2 Strengthen primary action hierarchy (Shuffle CTA remains dominant while secondary actions are quieter).
- ✅ P0.3 Improve small-text readability/contrast (meta, streak, feedback note, dateline updates).
- ✅ P1.1 Simplify right-rail visual density (paired clusters and reduced visual separators).
- ✅ P1.2 Tighten typography consistency (headline label and badge title casing/tracking normalized).
- ✅ P1.3 Calm secondary interaction color states (neutralized secondary accents and hover states).

### Remaining optional follow-up
- ◻️ P2 spacing normalization and final polish pass.
- ◻️ P2 accent harmonization for cool-toned state tokens where desired.
