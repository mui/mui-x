import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: getTestName(import.meta.url),
      setupFiles: [fileURLToPath(new URL('../../test/utils/setupPickers.js', import.meta.url))],
      exclude: ['**/materialVersion.test.tsx'],
      browser: {
        enabled: true,
        // Re-enable per-file page isolation (overrides the shared isolate:false).
        // pickers-pro has 55 test files; without isolation they all share one
        // browser page, accumulating DOM/JS heap across the entire run and
        // causing OOM on CI. The speed cost (~100ms per file) is acceptable
        // compared to a crashed runner.
        isolate: true,
        instances: [{ browser: 'chromium' }],
      },
      sequence: { groupOrder: 1 },
    },
  }),
);
