# Bacha (food rescue frontend, Bangalore)

Only the built Vite/React bundle exists, so the app is edited by patching it.

- build/        deployable static site (index.html, assets/, vercel.json). Deploy this as-is.
- orig/         original built bundle (index.js, index.css, index.html) used as patch input
- src/          new code: vendor-plus.jsx/css, home.jsx/css, theme.css
- patch.py      builds build/ from orig/ + compiled src/ (compile JSX with tsc first, see below)
- recolor.py    swaps old purple hexes for the lemon/sky palette

Theme: lemon yellow #F8E36A, light blue #BFE2F4, navy ink #0E2A3E. No emojis, no purple.

Compile JSX: tsc --allowJs --jsx react --jsxFactory v.createElement --jsxFragmentFactory v.Fragment --target es2020 (outputs to out/), then python3 patch.py
Deploy: push build/ contents to GitHub, import in Vercel, Framework Preset "Other", no build command.
