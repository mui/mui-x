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
    { lib: 'x-chat', plans: ['headless', 'unstyled'] },
    { lib: 'x-date-pickers', plans: ['pro'] },
    { lib: 'x-tree-view', plans: ['pro'] },
    { lib: 'x-data-grid', plans: ['pro', 'premium', 'generator'] },
    { lib: 'x-scheduler', plans: ['premium'] },
    { lib: 'x-scheduler-internals', plans: ['premium'] },
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
  // x-charts-vendor uses a build directory structure
  {
    find: /^@mui\/x-charts-vendor\/(.+)$/,
    replacement: resolve(WORKSPACE_ROOT, './packages/x-charts-vendor/build/$1'),
  },
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
    __ALLOW_TEST_LICENSES__: 'true',
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
    },
    browser: {
      provider: playwright({
        ...(process.env.PLAYWRIGHT_SERVER_WS
          ? {
              connectOptions: {
                wsEndpoint: process.env.PLAYWRIGHT_SERVER_WS,
              },
            }
          : {
              launchOptions: {
                args: [
                  // Enable GPU so WebGL2 is enabled in browser tests
                  '--enable-gpu',
                  // Linux CI runners cap /dev/shm at 64 MB (Docker default).
                  // Chromium uses it for shared memory and is killed by the OS
                  // when it fills up, which manifests as an unexplained OOM crash.
                  // This flag redirects shared memory writes to /tmp instead.
                  '--disable-dev-shm-usage',
                ],
                // Required for tests which use scrollbars.
                ignoreDefaultArgs: ['--hide-scrollbars'],
              },
            }),
      }),
      viewport: { width: 1280, height: 800 },
      headless: true,
      screenshotFailures: false,
      commands: {
        async setupCrashHandler(ctx) {
          ctx.page.on('crash', (page) => {
            console.error(`Browser page crashed! URL: ${page.url()}`);
          });
        },
      },
      orchestratorScripts: [
        {
          id: 'vitest-preload-error-logger',
          // Do NOT call window.location.reload() here. A reload tears down the
          // WebSocket/birpc connection that Vitest uses to drive tests across
          // files (with isolate:false), producing a spurious "Browser connection
          // was closed / cannot call createTesters" error on the next test file.
          // Logging is enough — Vitest's own retry logic handles the failure.
          content: `window.addEventListener('vite:preloadError', (event) => { console.error('[vitest] vite:preloadError', event); });`,
          async: true,
        },
      ],
    },
    // Disable isolation to speed up the tests.
    isolate: false,
    // React 19 runs ~3x slower than React 18 (CPU-bound, mostly
    // @testing-library/user-event async timing). The default 5s Vitest timeout
    // is too low even for local runs on the heaviest picker tests; a timed-out
    // test can leave the browser in a bad state that cascades into connection
    // errors across subsequent test files (with isolate:false).
    testTimeout: process.env.CI ? 60000 : 20000,
    // Performance improvements for the tests.
    // https://vitest.dev/guide/improving-performance.html#improving-performance
    ...(process.env.CI && {
      // Important to avoid timeouts on CI.
      fileParallelism: false,
      // Retry failed tests up to 3 times. This is useful for flaky tests.
      retry: 3,
      // Reduce the number of workers to avoid CI timeouts.
      maxWorkers: 1,
    }),
    exclude: ['**/*.spec.{js,ts,tsx}', '**/node_modules/**', '**/dist/**'],
  },
});
