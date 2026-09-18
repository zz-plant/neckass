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
| `neckass.svg` | The file cut. A man, mid-explanation. | `--tilt`, `--arm-near`, `--forearm-near`, `--arm-far`, `--forearm-far`, `--leg-near`, `--leg-far` — all angles. Zero on every joint stands him to attention, arms at the sides. |
| `weather.svg` | The sky, in four layers. | `--sun`, `--cloud`, `--rain`, `--wind` — `1` shows a layer, `0` hides it. With `--cloud: 0` the sun moves to the middle of the box rather than hanging in the corner. |
| `ornament.svg` | The dingus between departments. | `--flourish: 0` drops the side leaves, leaving the centre lozenge as an end mark. |
| `map.svg` | The town: the river and the falls, Mill Street and its bridge, Orchard Lane, Route 9, the station, Depot Park, and the buildings. | `--bridge`, `--orchard`, `--station`, `--depot`, `--hall`, `--library`, `--center`, `--gym`, `--school`, `--route9`, `--river`, `--shelter` — `1` rings that place, `0` leaves it. `--bridge: 1` also reduces the bridge to one lane. |
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

Poses that work, as a starting point:

| | `--arm-far` / `--forearm-far` | `--arm-near` / `--forearm-near` | rest |
| --- | --- | --- | --- |
| House pose | `-22deg` / `-122deg` | `7deg` / `9deg` | — |
| At attention | `0` / `0` | `0` / `0` | `--tilt: 0deg` |
| Both hands up | `-22deg` / `-122deg` | `22deg` / `122deg` | — |
| Pointing | `-96deg` / `8deg` | — | `--tilt: -8deg` |
| Shrug | `-58deg` / `-96deg` | `58deg` / `96deg` | `--tilt: 5deg` |
| Walking off | `20deg` / `0` | `-18deg` / `0` | `--leg-near: -20deg; --leg-far: 18deg` |

The weather cut and the map on the front page are inlined this way:
`modules/front-page.js` reads the forecast on file and sets the sky's four
layer switches from it, and reads the day's notices and letters and rings the
places on the map they name. Those copies of the drawings live in
`index.html` (the map's styles in `styles.css`, under `.map-cut`); these are
the sources they were taken from, so change both together.
