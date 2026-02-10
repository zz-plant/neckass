# Mobile User Journey Critique (3 Typical Flows)

Date: 2026-02-10
Viewport tested: 390×844 (mobile)
Run context: local app via `python -m http.server 8001 --directory /workspace/neckass`

## Journey 1: “I just want a funny headline fast”

### Steps traversed
1. Open app on mobile.
2. Read first featured headline.
3. Tap **Shuffle**.
4. Tap **Previous** to return.

### What worked well
- The first headline is immediately visible above the fold, so the core value is discoverable quickly.
- Shuffle produced a different headline, and Previous reliably returned to the original one.
- Previous is initially disabled (good guardrail) and enables only after a shuffle.

### Friction / UX risk
- The command rail cards sit lower in the page; after reading the headline, users may not immediately realize additional actions exist without scrolling.
- “Previous” and “Shuffle” are text buttons with equal visual priority; on small screens, primary intent (Shuffle) could be clearer.

### Constructive improvements
- Consider making **Shuffle** visually stronger than **Previous** on mobile (e.g., filled style for primary action).
- Add a subtle cue near the fold that more actions exist below (e.g., compact “More actions below” helper text) if analytics show users miss share/export features.

---

## Journey 2: “I found one — now I want to copy/share it”

### Steps traversed
1. Tap **Copy headline**.
2. Validate copy feedback.
3. Inspect available share options.

### What worked well
- Copy action provided immediate positive feedback: “Headline copied to clipboard!”.
- Native share button is present on mobile, which matches platform expectations.
- Twitter/Facebook/Reddit links were correctly populated with headline/URL query parameters.

### Friction / UX risk
- Copy status text is compact and can be easy to miss if users tap rapidly or are focused on the headline area.
- The experience currently spreads share actions across one native button + multiple links, which can feel slightly fragmented for first-time users.

### Constructive improvements
- Keep the existing status message but add a brief visual confirmation on the button itself (e.g., temporary “Copied” label) for stronger feedback salience.
- Consider grouping share affordances with clearer hierarchy: native share first, social links second, with a short one-line explainer (“Use your device share sheet or pick a network”).

---

## Journey 3: “I want to export a mock front page asset”

### Steps traversed
1. Tap **Download mock front page**.
2. Tap **Copy mock front page**.
3. Verify status messaging.

### What worked well
- Download completed successfully with a meaningful filename (`neckass-front-page.png`).
- Clipboard image copy succeeded and returned clear status text (“Image copied to clipboard.”).
- Export status feedback is timely and understandable.

### Friction / UX risk
- Export actions are powerful but low in the page flow; casual mobile users may never discover them.
- Download and copy are adjacent with similar weight; users may not understand which is best for their intent (save vs paste).

### Constructive improvements
- Add short helper sublabels directly under each export button (e.g., “Save PNG to device” vs “Paste image into apps”) to reduce decision friction.
- If telemetry indicates low usage, test moving a compact “Export” shortcut closer to the headline card on mobile.

---

## Overall mobile assessment

### Strengths
- Core loop (headline → shuffle → back) is reliable and quick.
- Action feedback for copy/share/export is generally clear.
- Mobile flow remains usable without any build/runtime complexity.

### Highest-impact next refinements
1. Strengthen primary action hierarchy on mobile (emphasize Shuffle).
2. Improve discoverability of below-the-fold command rail actions.
3. Add tiny intent cues for export action differences (download vs copy).
