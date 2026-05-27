# BARRAGE

Single-page canvas game.

Play online: https://raw.githack.com/murakamitakeru2028-bot/Barrage/gh-pages/index.html

## Scripts

- `npm run build` copies `index.html` to `dist/` for deployment.
- `npm run dev` serves the project root locally.
- `npm run preview` serves the built `dist/` directory.

## Structure

- `index.html` contains the canvas shell and PWA metadata.
- `src/game.js` contains the game logic, rendering, and input handling.
- `public/` contains the PWA manifest and service worker template.
