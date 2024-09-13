import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';

const packages = ['charts', 'date-pickers'];

// Ideally we move the configuration to each package.
// Currently it doesn't work because vitest doesn't detect two different configurations in the same package.
// We could bypass this limitation by having a folder per configuration.

export default defineWorkspace(
  packages.flatMap(
    (name): ReturnType<typeof defineWorkspace> => [
      {
        extends: './vitest.config.mts',
        plugins: [react()],
        test: {
          include: [`packages/x-${name}/src/**/*.test.{ts,tsx,js,jsx}`],
          exclude: [`packages/x-${name}/src/**/*V3.test.{ts,tsx,js,jsx}`],
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
          include: [`packages/x-${name}/src/**/*.test.{ts,tsx,js,jsx}`],
          exclude: [`packages/x-${name}/src/**/*.browser.test.{ts,tsx,js,jsx}`],
          name: `jsdom/${name}`,
          environment: 'jsdom',
          env: {
            MUI_JSDOM: 'true',
          },
        },
      },
    ],
  ),
);
