# BARRAGE

Single-page canvas game.

Play online: https://barrage-beige.vercel.app/

## Scripts

- `npm run build` creates `dist/` for deployment, removes dev-only helpers, minifies first-party JS, optimizes generated app icons, and updates the service worker precache.
- `npm run dev` builds and serves `dist/` locally at `http://127.0.0.1:4173`.
- `npm run preview` serves the existing `dist/` directory.
- `npm run verify` runs syntax checks, build, built output check, and visual regression tests.
- `npm run test:visual` builds `dist/` and checks the 390 x 700 mobile Playwright screenshots.
- `npm run test:visual:update` refreshes the committed Playwright screenshot baselines.
- `npm run shot -- --ui=reload` captures one 390 x 700 preview screenshot into `.tmp-preview-reload.png`.
- `npm run size` prints raw/gzip/brotli sizes and service worker precache weight for `dist/`.
- `npm run map` prints the current `src/game.js` navigation map.
- `npm run clean:tmp -- --yes` deletes ignored `.tmp-*` local artifacts after a big UI pass.
- `npm run playwright:install` installs the Chromium browser used by Playwright when needed.

## Structure

- `index.html` contains the canvas shell and PWA metadata.
- `src/game.js` contains the game logic, rendering, and input handling.
- `src/dev/previews.js` is the shared list of local preview URLs used by tests and one-off screenshots.
- `public/` contains the PWA manifest and service worker template.
- `scripts/` contains build, local preview, size, screenshot, cleanup, and source-map helpers.

See `AGENTS.md` for development notes, preview URLs, and verification steps.
