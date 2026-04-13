# Self-hosted fonts (optional)

## Ano (MNN / MYKA)

Ano is a commercial typeface (e.g. from Optimo). This project references it in tokens and tries to load:

- `Ano-Regular.woff2` (weight 400)
- `Ano-Bold.woff2` (weight 700)
- `Ano-Medium.woff2` (weight 500 — “Ano Half”–style usage)

Place licensed `.woff2` files in this folder with those exact filenames, then extend `@font-face` in `src/styles/globals.css` with e.g. `url('/fonts/Ano-Regular.woff2') format('woff2')` alongside `local()`. Until then, **Outfit** (Google Fonts) is used after `Ano` in the stack, with no 404s from missing files.
