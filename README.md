# BARRAGE

Single-page canvas game.

Play online: https://barrage-beige.vercel.app/

## Scripts

- `npm run build` creates `dist/` for deployment, minifies first-party JS, optimizes generated app icons, and updates the service worker precache.
- `npm run dev` builds and serves `dist/` locally at `http://127.0.0.1:4173`.
- `npm run preview` serves the existing `dist/` directory.
- `npm run test:visual` builds `dist/` and checks the 390 x 700 mobile Playwright screenshots.
- `npm run test:visual:update` refreshes the committed Playwright screenshot baselines.
- `npm run playwright:install` installs the Chromium browser used by Playwright when needed.

## Structure

- `index.html` contains the canvas shell and PWA metadata.
- `src/game.js` contains the game logic, rendering, and input handling.
- `public/` contains the PWA manifest and service worker template.
- `scripts/` contains the build and local preview server.

See `AGENTS.md` for development notes, preview URLs, and verification steps.
