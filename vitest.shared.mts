import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(CURRENT_DIR, './');

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"test"',
    'process.env.VITEST': '"true"',
  },
  resolve: {
    alias: [
      // Generates resolver aliases for all packages and their plans.
      ...[
        { lib: 'x-charts', plans: ['pro'] },
        { lib: 'x-date-pickers', plans: ['pro'] },
        { lib: 'x-tree-view', plans: ['pro'] },
        { lib: 'x-data-grid', plans: ['pro', 'premium', 'generator'] },
        { lib: 'x-internals' },
        { lib: 'x-license' },
        { lib: 'x-telemetry' },
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
        replacement: new URL('./test/utils', import.meta.url).pathname,
      },
      // TODO: move to charts only
      {
        find: '@mui/x-charts-vendor',
        replacement: new URL('./packages/x-charts-vendor/es', import.meta.url).pathname,
      },
      // TODO: move to pickers only
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale',
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: [new URL('test/setupVitest.ts', import.meta.url).pathname],
    // Required for some tests that contain early returns.
    // Should be removed once we migrate to vitest.
    passWithNoTests: true,
    browser: {
      isolate: false,
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
    },
    // Disable isolation to speed up the tests.
    isolate: false,
    ...(process.env.CI && {
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
    exclude: [
      '**/*.spec.{js,ts,tsx}',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
  },
});
