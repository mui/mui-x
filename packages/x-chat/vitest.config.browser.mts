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
      exclude: [
        '**/*.spec.{js,ts,tsx}',
        '**/node_modules/**',
        '**/dist/**',
        // Docs-correctness guard uses Node-only modules (fs, typescript)
        '**/docsCorrectnessGuard/**',
      ],
    },
  }),
);
