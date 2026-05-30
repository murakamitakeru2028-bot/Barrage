import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.015,
      threshold: 0.2
    }
  },
  fullyParallel: false,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  use: {
    baseURL: BASE_URL,
    colorScheme: 'dark',
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    locale: 'ja-JP',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    timezoneId: 'Asia/Tokyo',
    viewport: { width: 390, height: 700 }
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        browserName: 'chromium'
      }
    }
  ]
});
