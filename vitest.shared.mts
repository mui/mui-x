import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // We seem to need both this and the `env` property below to make it work.
  define: {
    'process.env.NODE_ENV': '"test"',
    LICENSE_DISABLE_CHECK: 'false',
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  test: {
    globals: true,
    setupFiles: [new URL('test/setupVitest.ts', import.meta.url).pathname],
    // Required for some tests that contain early returns or conditional tests.
    passWithNoTests: true,
    env: {
      NODE_ENV: 'test',
    },
    browser: {
      isolate: false,
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      orchestratorScripts: [
        {
          id: 'vitest-reload-on-error',
          content: `window.addEventListener('vite:preloadError', (event) => { window.location.reload(); });`,
          async: true,
        },
      ],
    },
    // Disable isolation to speed up the tests.
    isolate: false,
    // Performance improvements for the tests.
    // https://vitest.dev/guide/improving-performance.html#improving-performance
    ...(process.env.CI && {
      // Important to avoid timeouts on CI.
      fileParallelism: false,
      // Increase the timeout for the tests due to slow CI machines.
      testTimeout: 30000,
      // Retry failed tests up to 3 times. This is useful for flaky tests.
      retry: 3,
      // Reduce the number of workers to avoid CI timeouts.
      poolOptions: {
        forks: {
          singleFork: true,
        },
        threads: {
          singleThread: true,
        },
      },
    }),
    exclude: ['**/*.spec.{js,ts,tsx}', '**/node_modules/**', '**/dist/**'],
  },
});
