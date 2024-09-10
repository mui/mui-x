import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['packages/x-charts/**/*.test.tsx'],
    alias: [
      {
        find: '@mui/x-charts',
        replacement: new URL('./packages/x-charts/src', import.meta.url).pathname,
      },
      {
        find: 'test/utils',
        replacement: new URL('./test/utils', import.meta.url).pathname,
      },
    ],
    globals: true,
    setupFiles: ['test/setup.ts'],
    // environment: 'jsdom',
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
});
