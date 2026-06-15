import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    // TODO: Revisit this before merging.
    // Pre-bundle the headless autocomplete hook used by the formula editor with
    // the shared dependency graph, so it does not get its own React copy from an
    // on-demand optimize pass (which triggers an "Invalid hook call").
    optimizeDeps: {
      include: ['@mui/material/useAutocomplete'],
    },
    test: {
      name: getTestName(import.meta.url),
      exclude: ['**/materialVersion.test.tsx'],
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
