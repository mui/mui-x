import path from 'path';
import { defineConfig } from 'vitest/config';

const MONOREPO_ROOT = path.resolve(__dirname, './');

export default defineConfig({
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
            replacement: new URL(`./packages/${v.lib}/src`, import.meta.url).pathname,
          },
          ...(v.plans ?? []).map((plan) => ({
            find: `@mui/${v.lib}-${plan}`,
            replacement: new URL(`./packages/${v.lib}-${plan}/src`, import.meta.url).pathname,
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
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: path.resolve(MONOREPO_ROOT, 'coverage'),
      include: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
    },
    sequence: {
      hooks: 'list',
    },
    env: {
      MUI_VITEST: 'true',
    },
    poolOptions: {
      threads: {
        useAtomics: true,
        singleThread: true,
      },
    },
  },
});
