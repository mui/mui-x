import { mergeConfig, defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      browser: {
        enabled: true,
        instances: [
          {
            browser: 'chromium',
            provider: playwright({
              launchOptions: {
                // Required for tests which use scrollbars.
                ignoreDefaultArgs: ['--hide-scrollbars'],
              },
            }),
          },
        ],
      },
    },
  }),
);
