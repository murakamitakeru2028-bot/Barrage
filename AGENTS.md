# BARRAGE Development Notes

This repo is a single-page Three.js canvas game. Keep changes small and verify both the built output and the 390 x 700 mobile layout before shipping UI/gameplay changes.

## Core Files

- `src/game.js` is the main app: game state, Three.js scene setup, gameplay, UI markup, and CSS live in this file.
- `src/features/ranking.js` contains ranking integration.
- `scripts/build.mjs` copies `index.html`, `public/`, and `src/` into `dist/`, removes `src/dev/`, generates app icons if needed, minifies first-party JS, compacts embedded CSS, and rewrites the service worker precache.
- `scripts/serve.mjs` serves a directory locally. It defaults to `dist/` on `http://127.0.0.1:4173`.
- `public/` contains PWA files and source app icons.
- `dist/`, `.tmp-*`, `.vercel/`, and `node_modules/` are ignored.

## Commands

- Install dependencies: `npm install`
- Build: `npm run build`
- Build and serve: `npm run dev`
- Serve existing build: `npm run preview`
- Full local verification: `npm run verify`
- Capture one 390 x 700 preview screenshot: `npm run shot -- --ui=reload`
- Print build size and service worker cache weight: `npm run size`
- Print a current `src/game.js` function/section map: `npm run map`
- Dry-run ignored temp cleanup: `npm run clean:tmp`
- Delete ignored temp artifacts: `npm run clean:tmp -- --yes`
- Use another local port in PowerShell: `$env:PORT=4183; npm.cmd run preview`

## Verification

Run these after code changes:

- `npm run build`
- `node --check scripts\build.mjs`
- `node --check dist\src\game.js`
- `npm run test:visual`

For UI changes, open the local build and capture at least a 390 x 700 screenshot. Useful local preview URLs:

- Home: `http://127.0.0.1:4173/`
- In-run upgrade: `http://127.0.0.1:4173/?ui=basic`
- Skill selection: `http://127.0.0.1:4173/?ui=special`
- Home status upgrades: `http://127.0.0.1:4173/?ui=homeUpgrade`
- Store: `http://127.0.0.1:4173/?ui=store`
- Garage: `http://127.0.0.1:4173/?ui=garage`
- Gacha: `http://127.0.0.1:4173/?ui=gacha`
- Settings: `http://127.0.0.1:4173/?ui=settings`
- Ranking: `http://127.0.0.1:4173/?ui=ranking`
- Pause: `http://127.0.0.1:4173/?ui=pause`
- Boss: `http://127.0.0.1:4173/?ui=boss`
- Boss chase: `http://127.0.0.1:4173/?ui=bossChase`
- Hit effect: `http://127.0.0.1:4173/?ui=hit`
- Collision: `http://127.0.0.1:4173/?ui=collision`
- Wing collision: `http://127.0.0.1:4173/?ui=wing-collision`
- Shotgun: `http://127.0.0.1:4173/?ui=shotgun`
- Gatling: `http://127.0.0.1:4173/?ui=gatling`
- Crash: `http://127.0.0.1:4173/?ui=crash`
- Game over: `http://127.0.0.1:4173/?ui=dead`

The canonical preview list lives in `src/dev/previews.js`; update it when adding or renaming `?ui=` preview modes.

## `src/game.js` Map

- Run `npm run map` when line numbers have drifted.
- Top constants tune rendering, controls, bullets, enemies, boss behavior, collision, economy, and UI values.
- Save/settings helpers are near `loadSave`, `saveProgress`, `resetSaveData`, and token helpers.
- Player and showroom ship meshes are created by `makePlayer` and `makeHomePreviewShip`.
- UI root and styles start around `createUi`; `renderUi2` builds screen markup.
- User actions route through `handleAction`; mode changes use `setMode`; runs start in `startRun`.
- Main loop is `render`, which calls `update`; gameplay work is in `updatePlay`, `updateBullets`, and `updateEnemies`.
- Bullet/enemy collision is handled by `bulletEnemyImpact`; enemy/player collision uses `enemyPlayerImpact` and `enemyPlayerHitRegions`.
- Weapons spawn in `fireShot`, `pushBullet`, and the shotgun/gatling trajectory helpers.
- Enemies spawn in `spawnEnemy`, `spawnBoss`, and `spawnBossShard`.

## UI Rules To Preserve

- Back buttons should stay in the top-left across full-screen UI.
- Home, store, garage, gacha, settings, ranking, and upgrade screens should share the same monochrome/cyan command-panel tone.
- Skill selection should keep the game view and top HUD readable; slot chips stay near the top.
- Mobile is the primary target: verify 390 x 700 first, then wider desktop if layout changes touch responsive CSS.
- Avoid overlapping text, oversized cards, and hidden controls. Prefer compact labels and fixed dimensions for buttons and rails.

## Performance Notes

- The build minifies `dist/src/game.js` and `dist/src/features/ranking.js`; edit source files, not `dist`.
- The embedded CSS compactor in `scripts/build.mjs` must preserve whitespace around CSS `calc()` operators.
- The renderer has mobile/low-power caps near the top of `src/game.js`; prefer tuning those constants before adding new per-frame work.
- Reuse existing object pools and instanced meshes for enemies, bullets, and particles.

## Git Notes

- The global Git ignore file may warn with `Permission denied`; it has been benign in this workspace.
- Before committing, check `git status --short`, run the verification commands, then commit and push.
