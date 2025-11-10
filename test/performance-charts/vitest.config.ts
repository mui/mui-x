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
                // Suggested by Codspeed: https://github.com/CodSpeedHQ/codspeed-node/blob/174369c7c28b320f79cabd4bd7fb2b6a3cdef6dd/packages/core/src/introspection.ts#L57
                '--disable-web-security',
                '--interpreted-frames-native-stack',
                '--allow-natives-syntax',
                '--hash-seed=1',
                '--random-seed=1',
                '--no-opt',
                '--predictable',
                '--predictable-gc-schedule',
                '--expose-gc',
                '--no-concurrent-sweeping',
                '--max-old-space-size=4096',
                // End of suggested by Codspeed
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
