import { mergeConfig, defineConfig } from 'vitest/config';
import sharedConfig from '../../vitest.shared.mts';
import { getTestName } from '../../scripts/getTestName.mts';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    // `remend` is only reached through the lazy `import('#remend')` in
    // `streamingMarkdownRepair.ts`, so Vite's dependency scanner does not see it up
    // front. It gets discovered the first time a test actually loads it, and the
    // resulting re-optimization reloads the page mid-run, which drops every in-flight
    // suite in this project. Pre-bundling it keeps the run stable.
    optimizeDeps: {
      include: ['remend'],
    },
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
        // Packaging guard reads the source tree and package.json with Node-only fs
        '**/packagingGuard/**',
      ],
    },
  }),
);
