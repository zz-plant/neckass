# Fonts

## fraunces-latin-var.woff2

- **Family:** Fraunces (variable, weight 400–700, latin subset)
- **Licence:** SIL Open Font License 1.1 — https://openfontlicense.org
- **Source:** https://fonts.google.com/specimen/Fraunces (upstream: https://github.com/undercasetype/Fraunces)
- **Version:** v38, retrieved 2026-09-01

Self-hosted on purpose. The stylesheet previously pulled Fraunces and Inter from
Google Fonts with an `@import`, which blocks rendering behind a second network
round trip and sends every visitor's IP to a third party — at odds with the
"runs on-device" claim in the README. Fraunces now sets every sentence of
the paper; the wire's apparatus uses the system monospace and the reference
entry the system sans, so this is the only font file the site ships.

To refresh, request the CSS with a browser user-agent and take the `latin`
subset URL:

```bash
curl -A "Mozilla/5.0" \
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap"
```

## fraunces-72pt-bold.ttf, fraunces-9pt-regular.ttf

- **Family:** Fraunces, two static instances (72pt Bold for display, 9pt
  Regular for text)
- **Licence:** SIL Open Font License 1.1
- **Source:** https://github.com/undercasetype/Fraunces/releases/tag/1.000
  (`Fonts - Desktop/static/ttf/`)

These are for the social card (`functions/card.png.js`), which is drawn by
Satori at the edge. Satori reads TrueType and OpenType, not woff2, and takes
a static instance rather than an axis on a variable font, so the card carries
its own two cuts. The browser never loads them.
