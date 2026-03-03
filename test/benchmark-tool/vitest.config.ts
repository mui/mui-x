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
          args: ['--js-flags=--expose-gc'],
        },
      }),
    },
    fileParallelism: false,
    reporters: ['default', './utils/benchmarkReporter.ts'],
    include: ['tests/**/*.bench.tsx'],
  },
});
