import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      exclude: [
        '**/materialVersion.test.tsx',
        // The formula engine is DOM-free by design (no React/grid imports) —
        // its suites run in jsdom only to keep the browser run lean.
        '**/hooks/features/formula/engine/*.test.ts',
      ],
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
