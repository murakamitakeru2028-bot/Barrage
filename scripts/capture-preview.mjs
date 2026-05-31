import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { previewPath } from "../src/dev/previews.js";

const ui = readArg("--ui", "home");
const port = Number(readArg("--port", process.env.PORT || "4173"));
const width = Number(readArg("--width", "390"));
const height = Number(readArg("--height", "700"));
const out = resolve(readArg("--out", `.tmp-preview-${ui}.png`));
const baseUrl = `http://127.0.0.1:${port}`;
const url = new URL(previewPath(ui), baseUrl).toString();

await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    locale: "ja-JP",
    reducedMotion: "reduce",
    timezoneId: "Asia/Tokyo"
  });

  if (page.clock?.install) {
    await page.clock.install({ time: new Date("2026-05-31T00:00:00+09:00") });
  }

  await page.addInitScript(() => {
    let seed = 0x51f15e;
    Math.random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.locator("#barrage-ui").waitFor({ state: "visible" });
  if (page.clock?.runFor) {
    await page.clock.runFor(Number(readArg("--ms", "3000")));
  }

  const runtimeError = await page.evaluate(() => window.__BARRAGE_ERROR__ || "");
  if (runtimeError) throw new Error(runtimeError);

  await page.screenshot({ path: out, fullPage: false, animations: "disabled", caret: "hide" });
  console.log(`Captured ${ui} at ${width}x${height}: ${out}`);
} finally {
  await browser.close();
}

function readArg(name, fallback) {
  const exact = process.argv.find(arg => arg.startsWith(`${name}=`));
  if (exact) return exact.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
