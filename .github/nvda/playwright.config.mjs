// Playwright config for `fields.pw.mjs`. Needs Windows with NVDA set up by `@guidepup/setup`.
import { devices } from '@playwright/test';
import { screenReaderConfig } from '@guidepup/playwright';

export default {
  ...screenReaderConfig,
  testDir: '.',
  testMatch: '*.pw.mjs',
  reportSlowTests: null,
  timeout: 5 * 60 * 1000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...screenReaderConfig.use,
    baseURL: 'http://localhost:5001',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  // `site` is the `test/e2e` build of this branch.
  webServer: { command: 'npx serve -s site -l 5001', url: 'http://localhost:5001' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], headless: false } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], headless: false } },
  ],
};
