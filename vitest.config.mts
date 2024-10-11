import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      ...[
        { lib: 'charts', plans: ['pro'] },
        { lib: 'date-pickers', plans: ['pro'] },
        { lib: 'tree-view', plans: ['pro'] },
        { lib: 'data-grid', plans: ['pro', 'premium', 'generator'] },
        { lib: 'internals' },
        { lib: 'license' },
      ].flatMap((v) => {
        return [
          {
            find: `@mui/x-${v.lib}`,
            replacement: new URL(`./packages/x-${v.lib}/src`, import.meta.url).pathname,
          },
          ...(v.plans ?? []).map((plan) => ({
            find: `@mui/x-${v.lib}-${plan}`,
            replacement: new URL(`./packages/x-${v.lib}-${plan}/src`, import.meta.url).pathname,
          })),
        ];
      }),
      {
        find: 'test/utils',
        replacement: new URL('./test/utils', import.meta.url).pathname,
      },
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale',
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['test/setup.ts'],
    // Required for some datepickers tests that contain early returns.
    passWithNoTests: true,
    sequence: {
      hooks: 'list',
    },
    env: {
      MUI_VITEST: 'true',
    },
  },
});
