import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

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
          launch: {
            args: [
              '--enable-precise-memory-info',
              '--enable-devtools-experiments',
              '--disable-web-security',
            ],
          },
        },
      ],
      commands: {
        requestGC: async (ctx) => {
          await ctx.page.evaluate(() => {
            let testObj: {} | null = {};
            const weakRef = new WeakRef(testObj);

            testObj = null;
            window.testWeakRef = weakRef;
          });

          await ctx.page.requestGC();

          const { promise: waitForGCToComplete, resolve } = Promise.withResolvers<void>();

          const checkIfGCIsComplete = async () => {
            const wasCollected = await ctx.page.evaluate(() => {
              return window.testWeakRef.deref() === undefined;
            });

            if (wasCollected) {
              resolve();
            } else {
              setTimeout(checkIfGCIsComplete);
            }
          };

          checkIfGCIsComplete();
          await waitForGCToComplete;
        },
      },
      provider: 'playwright',
    },
  },
});
