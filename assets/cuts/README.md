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
| `neckass.svg` | The file cut. A man, mid-explanation, and everything he can be drawn among. | `--tilt`, `--arm-near`, `--forearm-near`, `--arm-far`, `--forearm-far`, `--leg-near`, `--leg-far` — all angles. Zero on every joint stands him to attention, arms at the sides; positive turns a joint clockwise as drawn. And one switch per prop, `1` to show it: `--phone`, `--cup`, `--hat` (held), `--doorway`, `--couch`, `--fridge`, `--tv`, `--desk`, `--table`, `--easel`, `--signpost`, `--shelf`, `--clock`, `--alarm`, `--parcel`, `--shoe`, `--rain`, `--shower`, `--smoke` (behind him). All off by default. |
| `weather.svg` | The sky, in four layers. | `--sun`, `--cloud`, `--rain`, `--wind` — `1` shows a layer, `0` hides it. With `--cloud: 0` the sun moves to the middle of the box rather than hanging in the corner. |
| `press.svg` | A screw press. | `--lever` (angle of the bar; `0` is at rest, straight out), `--sheet: 0` clears the paper off the bed. |

The file cut is drawn by hand, in one pen: a fine-point marker, so every
line is the same black at nearly one weight (2.2 for outlines, 1.7 for
detail, 1.2 for hatching, none of it grey), with round ends and round
corners, and no line quite straight. Every limb is a capsule whose round
ends are centred on its pivots, so an elbow or a shoulder turned to any
angle stays a round joint, and the round tops of the arms are his
shoulders. Each arm, and the legs with the hips, is drawn as one shape:
its edges first, at twice the weight (`.outline`), then its fills over
them (`.body`), so only the outside of the whole shows. A bent elbow is a
bend in the sleeve, not the end of one tube over another, and the hips
draw no line across the trousers. Elsewhere a piece that meets another
is tucked under it rather than laid along it: the posts under the
lintel, the monitor's foot under the desk, the plate under the tabletop,
the parcel one outline with its inner edges drawn once. No edge is drawn
twice. The head is drawn behind the jacket, so the neck shows in the open
collar. The mark on the neck is his Adam's apple; the standards forbid
explaining the neck. The props are drawn by the same hand.

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
The arms are drawn behind the torso and the head, so a hand brought in front
of either disappears; a pose that reads keeps its hands out at the sides or
up by the ear.

The file cut carries its scene too. Each prop is a group, `.scene-couch`
and so on, at `opacity: var(--couch, 0)`. The phone, the cup and the hat
are drawn inside the joint that holds them, so they turn with it: the
phone and the cup just before the hand that grips them, the hat after the
hair. The rest are drawn first, behind him, in the box's own coordinates
rather than the plate's, standing on his ground (y 271) and kept inside
the margin the box keeps for a thrown limb: x from −36 to 214, y from −30.
Most stand to his right, where the drawing has room; the couch stands
behind him, and is short enough on the right to share the floor with the
television. `data/scenes.js` names them, with the words each adds to the
alt text.

The file cut on the front page is inlined this way, with its styles in
`styles.css` under `.cut-figure`: `modules/front-page.js` sets the lead's
pose on its joints, the lead's scene on the switches, and the pose's
caption in the cutline. It also sets `data-pose`, which `styles.css` reads
to play the pose once: a `rotate` keyframe added to each joint's own
rotation, so the drawing comes to rest where the pose put it, and over in
under five seconds. The social card
can read neither CSS nor custom properties, so `functions/lib/cut.mjs` draws
the same parts with each rotation written in, in whichever pose it is given,
and only the props of the scene it is given.
That is three copies of one drawing; change them together. The smoke test
compares their parts, pivots and house pose, and fails if they differ.

The weather cut on the front page is inlined the same way: `modules/front-page.js`
reads the forecast on file and sets the sky's four layer switches from it.
That copy of the drawing lives in `index.html`; this is the source it was
taken from, so change both together.
