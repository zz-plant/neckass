# Cuts

Line-cuts for the paper, drawn as rigs rather than pictures: each one exposes
its moving parts as CSS custom properties, so a single file poses differently
wherever it is used. Every property has a fallback, so the files also work on
their own — `<img src="assets/cuts/neckass.svg">` — with no CSS at all.

Ink and paper are properties too. `--ink` is the line, `--paper` the fill
behind it; the fallbacks follow `prefers-color-scheme`, which is how the site
switches. Set `--paper` to whatever the cut is sitting on if that is not the
sheet.

| File | What it is | Properties |
| --- | --- | --- |
| `neckass.svg` | The file cut. A man, mid-explanation. | `--tilt`, `--arm-near`, `--forearm-near`, `--arm-far`, `--forearm-far`, `--leg-near`, `--leg-far` — all angles. Zero on every joint stands him to attention, arms at the sides; positive turns a joint clockwise as drawn. |
| `weather.svg` | The sky, in four layers. | `--sun`, `--cloud`, `--rain`, `--wind` — `1` shows a layer, `0` hides it. With `--cloud: 0` the sun moves to the middle of the box rather than hanging in the corner. |
| `press.svg` | A screw press. | `--lever` (angle of the bar; `0` is at rest, straight out), `--sheet: 0` clears the paper off the bed. |

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

The file cut on the front page is inlined this way, with its styles in
`styles.css` under `.cut-figure`: `modules/front-page.js` sets the lead's
pose on its joints and the pose's caption in the cutline. The social card
can read neither CSS nor custom properties, so `functions/lib/cut.mjs` draws
the same parts with each rotation written in, in whichever pose it is given.
That is three copies of one drawing; change them together. The smoke test
compares their parts, pivots and house pose, and fails if they differ.

The weather cut on the front page is inlined the same way: `modules/front-page.js`
reads the forecast on file and sets the sky's four layer switches from it.
That copy of the drawing lives in `index.html`; this is the source it was
taken from, so change both together.
