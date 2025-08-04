/// <reference types="@vitest/browser/providers/playwright" />
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(sharedConfig, {
  test: {
    name: getTestName(import.meta.url),
    environment: 'browser',
    setupFiles: [fileURLToPath(new URL('./src/matchers/index.ts', import.meta.url))],
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
        // V8 Coverage in browser mode is not supported yet outside of chromium
        // {
        //   browser: 'webkit',
        // },
        // {
        //   browser: 'firefox',
        // },
      ],
    },
  },
});
