import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(CURRENT_DIR, './');

export const alias = [
  // Generates resolver aliases for all packages and their plans.
  ...[
    { lib: 'x-charts', plans: ['pro', 'premium'] },
    { lib: 'x-date-pickers', plans: ['pro'] },
    { lib: 'x-tree-view', plans: ['pro'] },
    { lib: 'x-data-grid', plans: ['pro', 'premium', 'generator'] },
    { lib: 'x-scheduler', plans: ['premium'] },
    { lib: 'x-scheduler-headless', plans: ['premium'] },
    { lib: 'x-internals' },
    { lib: 'x-internal-gestures' },
    { lib: 'x-license' },
    { lib: 'x-telemetry' },
    { lib: 'x-virtualizer' },
  ].flatMap((v) => {
    return [
      {
        find: `@mui/${v.lib}`,
        replacement: resolve(WORKSPACE_ROOT, `./packages/${v.lib}/src`),
      },
      ...(v.plans ?? []).map((plan) => ({
        find: `@mui/${v.lib}-${plan}`,
        replacement: resolve(WORKSPACE_ROOT, `./packages/${v.lib}-${plan}/src`),
      })),
    ];
  }),
  {
    find: 'test/utils',
    replacement: fileURLToPath(new URL('./test/utils', import.meta.url)),
  },
];

export default defineConfig({
  // If enabling babel plugins, ensure the tests in CI are stable
  // https://github.com/mui/mui-x/pull/18341
  plugins: [react()],
  // We seem to need both this and the `env` property below to make it work.
  define: {
    'process.env.NODE_ENV': '"test"',
    LICENSE_DISABLE_CHECK: 'false',
  },
  esbuild: {
    minifyIdentifiers: false,
    keepNames: true,
  },
  resolve: {
    alias,
  },
  test: {
    globals: true,
    setupFiles: [fileURLToPath(new URL('test/setupVitest.ts', import.meta.url))],
    // Required for some tests that contain early returns or conditional tests.
    passWithNoTests: true,
    env: {
      NODE_ENV: 'test',
      VITEST: 'true',
    },
    browser: {
      provider: playwright({
        launchOptions: {
          // Required for tests which use scrollbars.
          ignoreDefaultArgs: ['--hide-scrollbars'],
        },
        ...(process.env.PLAYWRIGHT_SERVER_WS
          ? {
              connectOptions: {
                wsEndpoint: process.env.PLAYWRIGHT_SERVER_WS,
              },
            }
          : {}),
      }),
      viewport: { width: 1280, height: 800 },
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
      maxWorkers: 1,
    }),
    exclude: ['**/*.spec.{js,ts,tsx}', '**/node_modules/**', '**/dist/**'],
  },
});
