import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineWorkspace([
  {
    extends: './vitest.config.mts',
    plugins: [react()],
    test: {
      include: ['packages/x-charts/**/*.test.tsx'],
      name: 'charts/browser',
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
      include: ['packages/x-charts/**/*.test.tsx'],
      name: 'charts/jsdom',
      environment: 'jsdom',
    },
  },
]);
