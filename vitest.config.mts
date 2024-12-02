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
      ...[
        { lib: 'x-charts', plans: ['pro'] },
        { lib: 'x-date-pickers', plans: ['pro'] },
        { lib: 'x-tree-view', plans: ['pro'] },
        { lib: 'x-data-grid', plans: ['pro', 'premium', 'generator'] },
        { lib: 'x-internals' },
        { lib: 'x-license' },
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
      {
        find: '@mui/x-charts-vendor',
        replacement: new URL('./packages/x-charts-vendor/es', import.meta.url).pathname,
      },
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale',
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['test/setupVitest.ts'],
    // Required for some tests that contain early returns.
    // Should be removed once we migrate to vitest.
    passWithNoTests: true,
    coverage: {
      provider: 'istanbul',
      reporter: [['text', { maxCols: 200 }], 'lcov'],
      reportsDirectory: resolve(WORKSPACE_ROOT, 'coverage'),
      include: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
      exclude: ['**/*.test.{js,ts,tsx}', '**/*.test/*'],
    },
    sequence: {
      hooks: 'list',
    },
  },
});
