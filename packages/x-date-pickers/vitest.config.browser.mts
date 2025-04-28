/// <reference types="@vitest/browser/providers/playwright" />
import { mergeConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';

import { filterReplace } from './vitest.config.jsdom.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(sharedConfig, {
  plugins: [filterReplace],
  test: {
    name: getTestName(import.meta.url),
    environment: 'browser',
    browser: {
      enabled: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});
