/// <reference types="@vitest/browser/providers/playwright" />
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';

import { getTestName } from '../../scripts/getTestName.mts';
import { filterReplace } from './vitest.config.jsdom.mts';

export default mergeConfig(sharedConfig, {
  plugins: [filterReplace],
  resolve: {
    alias: [
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale',
      },
    ],
  },
  test: {
    name: getTestName(import.meta.url),
    environment: 'browser',
    setupFiles: [fileURLToPath(new URL('../../test/utils/setupPickers.js', import.meta.url))],
    browser: {
      enabled: true,
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
      ],
    },
  },
});
