# Cuts

Line-cuts for the paper, drawn as rigs rather than pictures: each one exposes
its moving parts as CSS custom properties, so a single file poses differently
wherever it is used. Every property has a fallback, so the files also work on
their own — `<img src="assets/cuts/neckass.svg">` — with no CSS at all.

Ink and paper are properties too. `--ink` is the line, `--paper` the fill
behind it; the fallbacks follow `prefers-color-scheme`, which is how the site
switches. Set `--paper` to whatever the cut is sitting on if that is not the
sheet. The weather cut has two more, `--ink-sun` for the sun's disc and
`--ink-sky` for the rain, with the page's weather inks as fallbacks.

| File | What it is | Properties |
| --- | --- | --- |
| `neckass.svg` | The file cut. A man in a suit, mid-explanation, and everything he can be drawn among. | `--tilt`, `--lean`, `--arm-near`, `--forearm-near`, `--hand-near`, `--arm-far`, `--forearm-far`, `--hand-far`, `--leg-near`, `--leg-far` — all angles. Zero on every joint stands him to attention, arms at the sides; positive turns a joint clockwise as drawn. `--lean` tips everything above the belt on the legs, which stay where they stand; the hands turn at the wrist. And one switch per prop, `1` to show it: `--phone`, `--cup`, `--hat` (held), `--doorway`, `--couch`, `--fridge`, `--tv`, `--desk`, `--table`, `--easel`, `--signpost`, `--shelf`, `--clock`, `--alarm`, `--parcel`, `--shoe`, `--rain`, `--shower`, `--smoke` (behind him). All off by default. |
| `weather.svg` | The sky, in four layers. | `--sun`, `--cloud`, `--rain`, `--wind` — `1` shows a layer, `0` hides it. With `--cloud: 0` the sun moves to the middle of the box rather than hanging in the corner. |
| `press.svg` | A screw press. | `--lever` (angle of the bar; `0` is at rest, straight out), `--sheet: 0` clears the paper off the bed. |

The file cut is drawn by hand, in one pen: a fine-point marker, so every
line is the same black at nearly one weight (2.2 for outlines, 1.7 for
detail, 1.2 for hatching, none of it grey), with round ends and round
corners, and no line quite straight. He wears a suit: a jacket open over a
shirt and a striped tie, with notched lapels, two buttons, flap pockets
and a pen in the breast pocket, and creased trousers. Every limb is a
capsule whose round ends are centred on its pivots, so a joint turned to
any angle stays round. Each arm, and the legs
with the seat, is drawn as one shape: its edges first, at twice the
weight (`.outline`), then its fills over them (`.body`), so only the
outside of the whole shows, a bent elbow is a bend in the sleeve, and the
seat draws no line across the trousers. The arms hang in front of the
jacket, and the top of each sleeve goes under the jacket's shoulder, which
is drawn over it the same way and shares its edge with the jacket's, so
an arm turns at the shoulder without showing where it ends, and the
shoulder is one line. Elsewhere a piece that meets another is tucked under
it rather than laid along it: the posts under the lintel, the monitor's
foot under the desk, the plate under the tabletop, the parcel one outline
with its inner edges drawn once. No edge is drawn twice. The head is drawn
behind the collar, so the neck rises out of it. The mark on the neck is
his Adam's apple; the standards forbid explaining the neck. The props are
drawn by the same hand.

The figure is not drawn in the files. `scripts/draw-cut.ts` sets it down
as geometry — capsules on the pivots, splines through a few points for
everything else — and a hand draws it: each line resampled, bowed off
true by a slow wobble from a seed per part, and written as quadratic
curves. `bun run cut:draw` writes it into all three copies of the drawing
(below), so they are the same to the stroke. The scenery is kept in the
files as it was drawn.

Each box is cut to the pose the file ships in, so the drawing sits centred with
an even margin. A pose that throws a limb wide — an arm straight out — reaches
past that. Inlined, it simply draws outside the box (`overflow: visible`); as an
`<img>` it would be clipped, so give a wide pose a wider `viewBox`.

Posing takes a wrapper, because an `<img>` cannot be reached by the page's CSS.
Inline the file, or reference it from a sprite, and set the properties on it:

```html
<svg class="cut-figure" viewBox="0 0 200 300">…</svg>
```

```css
.cut-figure {
    --arm-far: -20deg;   /* hand down */
    --forearm-far: 0deg;
    --tilt: 6deg;        /* head cocked */
}
```

The paper's poses are `data/poses.js`: ten of them, each a full set of joint
angles with the caption and alt text that go with it. Every lead names one.
The arms are drawn in front of the jacket and the head, so a hand can rest
on a hip, hold a phone to his ear or scratch his head.

The file cut carries its scene too. Each prop is a group, `.scene-couch`
and so on, at `opacity: var(--couch, 0)`. The phone, the cup and the hat
are drawn inside the joint that holds them, so they turn with it: the
phone and the cup at the wrist, just before the hand that grips them, the
hat after the hair. The rest are drawn first, behind him, in the box's own
coordinates rather than the plate's, standing on his ground (y 271) and
kept inside the margin the box keeps for a thrown limb: x from −36 to 214,
y from −30. Most stand to his right, where the drawing has room; the couch
stands behind him, and is short enough on the right to share the floor
with the television. `data/scenes.js` names them, with the words each adds
to the alt text.

The file cut on the front page is inlined this way, with its styles in
`styles.css` under `.cut-figure`: `modules/front-page.js` sets the lead's
pose on its joints, the lead's scene on the switches, and the pose's
caption in the cutline. It also sets `data-pose`, which `styles.css` reads
to act the pose out once: each moving part (a joint, the tie, the eyes,
the brows) takes a keyframe shape (beats, a wave, a hold, a doze, a sway)
with its own reach, length and delay, added to its own transform, so the
drawing comes to rest where the pose put it, and is over by 4.4 seconds.
The social card can read neither CSS nor custom properties, so
`functions/lib/cut.mjs` draws the same parts with each rotation written
in, in whichever pose it is given, and only the props of the scene it is
given. That is three copies of one drawing, all written by
`bun run cut:draw`. The smoke test compares their parts, pivots and house
pose, and fails if they differ.

The weather cut on the front page is inlined the same way: `modules/front-page.js`
reads the forecast on file and sets the sky's four layer switches from it.
That copy of the drawing lives in `index.html`; this is the source it was
taken from, so change both together.
