import { PlaywrightTestConfig } from '@playwright/test';

export type TestFixture = {};

const config: PlaywrightTestConfig<TestFixture> = {
  reportSlowTests: {
    max: 1,
    threshold: 60 * 1000, // 1min
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://mui.com',
  },
  // as recommended in https://playwright.dev/docs/ci#workers
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
};

export default config;
