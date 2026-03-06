import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  resolve: {
    alias: [{ find: 'react-dom/client', replacement: 'react-dom/profiling' }],
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium', testTimeout: 120_000 }],
      provider: playwright({
        launchOptions: {
          args: [
            // V8 flags for deterministic JS execution
            '--js-flags=--expose-gc,--predictable,--no-opt,--predictable-gc-schedule,--no-concurrent-sweeping,--hash-seed=1,--random-seed=1,--max-old-space-size=4096',

            // Chromium flags to reduce renderer/compositor noise
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-background-networking',
            '--enable-benchmarking',
            '--disable-gpu',
          ],
        },
      }),
    },
    fileParallelism: false,
    reporters: ['default', './utils/benchmarkReporter.ts'],
    include: ['tests/**/*.bench.tsx'],
  },
});
