import react from '@vitejs/plugin-react';
import { defineWorkspace, WorkspaceProjectConfiguration } from 'vitest/config';
import filterReplacePlugin from 'vite-plugin-filter-replace';

const packages = [
  'x-charts',
  'x-charts-pro',
  'x-date-pickers',
  'x-date-pickers-pro',
  'x-data-grid',
  'x-data-grid-pro',
  'x-data-grid-premium',
  'x-tree-view',
  'x-tree-view-pro',
];

const jsdomOnlyPackages = [
  'x-license',
  'x-internals',
  'x-codemod',
  'x-charts-vendor',
  'eslint-plugin-material-ui',
];

const allPackages = [...packages, ...jsdomOnlyPackages];

const filterReplace = filterReplacePlugin(
  [
    {
      filter: /\/src\/AdapterDateFnsV2\/.*/,
      replace: {
        from: /from 'date-fns'/g,
        to: "from 'date-fns-v2'",
      },
    },
    {
      filter: /\/src\/AdapterDateFnsJalaliV2\/.*/,
      replace: {
        from: /from 'date-fns-jalali'/g,
        to: "from 'date-fns-jalali-v2'",
      },
    },
  ],
  { enforce: 'pre' },
);

export default defineWorkspace([
  ...allPackages.flatMap((name): WorkspaceProjectConfiguration[] => [
    ...(jsdomOnlyPackages.includes(name)
      ? []
      : [
          {
            extends: './vitest.config.mts',
            plugins: [react(), filterReplace],
            test: {
              include: [`packages/${name}/src/**/*.test.?(c|m)[jt]s?(x)`],
              exclude: [`packages/${name}/src/**/*.jsdom.test.?(c|m)[jt]s?(x)`],
              name: `browser/${name}`,
              browser: {
                enabled: true,
                name: 'chromium',
                provider: 'playwright',
                headless: true,
                // https://playwright.dev
                providerOptions: {
                  launch: {
                    // Required for x-data-grid-pro tests.
                    // packages/x-data-grid-pro/src/tests/columns.DataGridPro.test.tsx
                    ignoreDefaultArgs: ['--hide-scrollbars'],
                  },
                },
                screenshotFailures: false,
              },
            },
          },
        ]),
    {
      extends: './vitest.config.mts',
      plugins: [react(), filterReplace],
      test: {
        include: [`packages/${name}/src/**/*.test.?(c|m)[jt]s?(x)`],
        name: `jsdom/${name}`,
        environment: 'jsdom',
      },
    },
  ]),
]);
