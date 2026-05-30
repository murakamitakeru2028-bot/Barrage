# BARRAGE

Single-page canvas game.

Play online: https://barrage-beige.vercel.app/

## Scripts

- `npm run build` creates `dist/` for deployment, minifies first-party JS, optimizes generated app icons, and updates the service worker precache.
- `npm run dev` builds and serves `dist/` locally at `http://127.0.0.1:4173`.
- `npm run preview` serves the existing `dist/` directory.

## Structure

- `index.html` contains the canvas shell and PWA metadata.
- `src/game.js` contains the game logic, rendering, and input handling.
- `public/` contains the PWA manifest and service worker template.
- `scripts/` contains the build and local preview server.

See `AGENTS.md` for development notes, preview URLs, and verification steps.
