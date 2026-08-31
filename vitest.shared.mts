import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

// Set by the root config before the project configs are resolved.
const isBrowserRun = (globalThis as { MUI_BROWSER_TESTS?: boolean }).MUI_BROWSER_TESTS === true;

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
    { lib: 'x-agent-tools' },
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
  resolve: {
    alias,
  },
  test: {
    setupFiles: [fileURLToPath(new URL('test/setupVitest.ts', import.meta.url))],
    // Inline so Vite resolves @mui/material's `react-transition-group/TransitionGroupContext`
    // directory import (legacy `main`/`module`, no `exports`), which native ESM rejects.
    // @TODO: Remove once https://github.com/mui/material-ui/pull/48645 is merged.
    server: {
      deps: {
        inline: [/@mui\/material/, /react-transition-group/],
      },
    },
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
        async resetMousePosition(ctx) {
          // Move the pointer out of the page. A pointer left over the content
          // makes components react to hover during unrelated tests.
          await ctx.page.mouse.move(10_000, 10_000);
        },
        async setupCrashHandler(ctx) {
          ctx.page.on('crash', (page) => {
            console.error(`Browser page crashed! URL: ${page.url()}`);
          });
        },
      },
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
    // Every project gets its own workers, so the default lets a full run open a browser page
    // per core in each of the ~20 browser projects at once. The pages then starve each other,
    // and the Playwright commands that wait for the renderer to acknowledge an input event
    // (the pointer reset in the setup hook) block for tens of seconds, which times the hook
    // out. Capping the workers keeps the full browser run both green and faster. The jsdom
    // projects are much cheaper per worker, so they keep the default outside of the CI.
    ...(isBrowserRun && {
      maxWorkers: 2,
    }),
    // Performance improvements for the tests.
    // https://vitest.dev/guide/improving-performance.html#improving-performance
    ...(process.env.CI && {
      // Increase the timeout for the tests due to slow CI machines.
      // Tests run ~3x slower under React 19 stable than React 18 (CPU-bound,
      // mostly @testing-library/user-event async timing); the slowest legitimate
      // tests touch ~17s in CI, so 30s leaves no headroom for noise.
      testTimeout: 60000,
      // Retry failed tests up to 3 times. This is useful for flaky tests.
      retry: 3,
      maxWorkers: 2,
    }),
    exclude: ['**/*.spec.{js,ts,tsx}', '**/node_modules/**', '**/dist/**'],
  },
});
