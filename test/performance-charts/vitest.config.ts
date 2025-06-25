import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./setup.ts'],
    env: { TRACE: process.env.TRACE },
    environment: 'node',
    maxConcurrency: 1,
    runner: './utils/vitest-bench-runner.ts',
    browser: {
      enabled: true,
      headless: true,
      instances: [
        {
          browser: 'chromium',
          testTimeout: 60_000,
          provider: playwright({
            launchOptions: {
              args: [
                '--enable-precise-memory-info',
                '--enable-devtools-experiments',
                '--disable-web-security',
              ],
            },
          }),
        },
      ],
      commands: {
        requestGC: (ctx) => ctx.page.requestGC(),
      },
    },
  },
});
