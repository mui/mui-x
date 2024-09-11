import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';

const packages = ['charts', 'date-pickers'];

export default defineWorkspace(
  packages.flatMap((name) => [
    {
      extends: './vitest.config.mts',
      plugins: [react()],
      test: {
        include: [`packages/x-${name}/**/*.test.tsx`],
        name: `${name}/browser`,
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
        include: [`packages/x-${name}/**/*.test.tsx`],
        name: `${name}/jsdom`,
        environment: 'jsdom',
      },
    },
  ]),
);
