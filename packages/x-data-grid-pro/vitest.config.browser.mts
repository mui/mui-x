import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import packageJson from './package.json';

export default mergeConfig(sharedConfig, {
  test: {
    name: `browser/${packageJson.name.split('/')[1]}`,
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      // https://playwright.dev
      providerOptions: {
        launch: {
          // Required for x-data-grid-pro tests which use scrollbars.
          ignoreDefaultArgs: ['--hide-scrollbars'],
        },
      },
    },
  },
});
