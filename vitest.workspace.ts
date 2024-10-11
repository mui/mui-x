import react from '@vitejs/plugin-react';
import { defineWorkspace } from 'vitest/config';

const packages = [
  'x-charts',
  'x-charts-pro',
  'x-date-pickers',
  'x-date-pickers-pro',
  'x-data-grid',
  'x-internals',
];

// Ideally we move the configuration to each package.
// Currently it doesn't work because vitest doesn't detect two different configurations in the same package.
// We could bypass this limitation by having a folder per configuration. Eg: `packages/x-charts/browser` & `packages/x-charts/jsdom`.

export default defineWorkspace([
  ...packages.flatMap(
    (name): ReturnType<typeof defineWorkspace> => [
      {
        extends: './vitest.config.mts',
        plugins: [react()],
        test: {
          include: [`packages/${name}/src/**/*.test.?(c|m)[jt]s?(x)`],
          exclude: [`packages/${name}/src/**/*.jsdom.test.?(c|m)[jt]s?(x)`],
          name: `browser/${name}`,
          env: {
            MUI_BROWSER: 'true',
          },
          browser: {
            enabled: true,
            name: 'chromium',
            provider: 'playwright',
            headless: true,
            // https://playwright.dev
            providerOptions: {},
            screenshotFailures: false,
          },
        },
      },
      {
        extends: './vitest.config.mts',
        plugins: [react()],
        test: {
          include: [`packages/${name}/src/**/*.test.?(c|m)[jt]s?(x)`],
          exclude: [`packages/${name}/src/**/*.browser.test.?(c|m)[jt]s?(x)`],
          name: `jsdom/${name}`,
          environment: 'jsdom',
          env: {
            MUI_JSDOM: 'true',
          },
        },
      },
    ],
  ),
  // TODO: Decide on
  // Manually changing the process.env in browser tests doesn't work.
  // And alternative is to use `const {NODE_ENV} = process.env` in the code instead.
  // x-license relies on `process.env.NODE_ENV` to determine the environment.
  {
    extends: './vitest.config.mts',
    plugins: [react()],
    test: {
      include: [`packages/x-license/src/**/*.test.?(c|m)[jt]s?(x)`],
      exclude: [`packages/x-license/src/**/*.browser.test.?(c|m)[jt]s?(x)`],
      name: `jsdom/x-license`,
      environment: 'jsdom',
      env: {
        MUI_JSDOM: 'true',
      },
    },
  },
]);
