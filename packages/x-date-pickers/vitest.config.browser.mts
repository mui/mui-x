import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';

import { getTestName } from '../../scripts/getTestName.mts';
import { filterReplace } from './vitest.config.jsdom.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
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
      setupFiles: [fileURLToPath(new URL('../../test/utils/setupPickers.js', import.meta.url))],
      exclude: ['**/materialVersion.test.tsx'],
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
