import react from '@vitejs/plugin-react';
import { defineWorkspace, WorkspaceProjectConfiguration } from 'vitest/config';

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

export default defineWorkspace([
  ...allPackages.flatMap((name): WorkspaceProjectConfiguration[] => [
    ...(jsdomOnlyPackages.includes(name)
      ? []
      : [
          {
            extends: './vitest.config.mts',
            plugins: [react()],
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
      plugins: [react()],
      test: {
        include: [`packages/${name}/src/**/*.test.?(c|m)[jt]s?(x)`],
        exclude: [`packages/${name}/src/**/*.browser.test.?(c|m)[jt]s?(x)`],
        name: `jsdom/${name}`,
        environment: 'jsdom',
      },
    },
  ]),
]);
