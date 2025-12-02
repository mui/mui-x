import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      setupFiles: [fileURLToPath(new URL('./src/matchers/index.ts', import.meta.url))],
      browser: {
        enabled: true,
        isolate: true,
        instances: [
          { browser: 'chromium' },
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
  }),
);
