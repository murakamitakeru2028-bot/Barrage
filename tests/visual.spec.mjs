import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { expect, test } from '@playwright/test';
import { VISUAL_SNAPSHOT_ROUTES } from '../src/dev/previews.js';

const PORT = Number(process.env.PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_ROOT = resolve('dist');
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png'
};

let staticServer;

test.beforeAll(async () => {
  staticServer = await startStaticServer();
});

test.afterAll(async () => {
  if (!staticServer) return;
  await new Promise((resolveClose, rejectClose) => {
    staticServer.close(error => error ? rejectClose(error) : resolveClose());
  });
});

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-05-31T00:00:00+09:00') });
  await page.addInitScript(() => {
    let seed = 0x51f15e;
    Math.random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };
  });
});

async function startStaticServer() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url || '/', BASE_URL);
    const pathname = decodeURIComponent(url.pathname);
    const filePath = resolve(join(DIST_ROOT, pathname === '/' ? 'index.html' : pathname));

    if (filePath !== DIST_ROOT && !filePath.startsWith(DIST_ROOT + sep)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const body = await readFile(filePath);
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream'
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return await new Promise((resolveServer, rejectServer) => {
    server.once('error', async error => {
      if (error.code !== 'EADDRINUSE') {
        rejectServer(error);
        return;
      }
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        resolveServer(null);
      } catch (fetchError) {
        rejectServer(fetchError);
      }
    });
    server.listen(PORT, '127.0.0.1', () => resolveServer(server));
  });
}

for (const { name, path } of VISUAL_SNAPSHOT_ROUTES) {
  test(`${name} matches the 390x700 mobile snapshot`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#barrage-ui')).toBeVisible();
    await expect(page.locator('#barrage-ui .on').first()).toBeVisible();
    await page.clock.runFor(3000);

    const runtimeError = await page.evaluate(() => window.__BARRAGE_ERROR__ || '');
    expect(runtimeError).toBe('');

    await expect(page).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: false
    });
  });
}
