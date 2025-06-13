/// <reference types="@vitest/browser/providers/playwright" />
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(sharedConfig, {
  test: {
    name: getTestName(import.meta.url),
    environment: 'browser',
    setupFiles: [new URL('./src/matchers/index.ts', import.meta.url).pathname],
    browser: {
      enabled: true,
      isolate: true,
      instances: [
        {
          browser: 'chromium',
          ...(process.env.PLAYWRIGHT_SERVER_WS
            ? {
                connect: {
                  wsEndpoint: process.env.PLAYWRIGHT_SERVER_WS,
                },
              }
            : {}),
        },
        {
          browser: 'webkit',
        },
        {
          browser: 'firefox',
        },
      ],
    },
  },
});
