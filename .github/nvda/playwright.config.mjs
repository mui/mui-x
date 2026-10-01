// NVDA verification harness for https://github.com/mui/mui-x/issues/23101. Windows only.
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
  use: { ...screenReaderConfig.use, trace: 'retain-on-failure', video: 'retain-on-failure' },
  webServer: [
    { command: 'npx serve -s sites/site-master -l 5001', url: 'http://localhost:5001' },
    { command: 'npx serve -s sites/site-fixed -l 5002', url: 'http://localhost:5002' },
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], headless: false } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], headless: false } },
  ],
};
