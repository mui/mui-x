import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
      sequence: { groupOrder: 43 },
    },
  }),
);
