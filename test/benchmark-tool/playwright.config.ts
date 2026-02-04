import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './app',
  testMatch: '**/_bench.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5002',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:5002',
    reuseExistingServer: !process.env.CI,
  },
});
