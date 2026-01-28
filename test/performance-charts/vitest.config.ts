import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

const isCI = process.env.CI === 'true';
const isTrace = !isCI && process.env.TRACE === 'true';

export default defineConfig({
  plugins: [...(isCI ? [codspeedPlugin()] : []), react()],
  test: {
    setupFiles: ['./setup.ts'],
    env: { TRACE: isTrace ? 'true' : 'false' },
    environment: isTrace ? 'node' : 'jsdom',
    execArgv: [
      // Suggested by Codspeed: https://github.com/CodSpeedHQ/codspeed-node/blob/174369c7c28b320f79cabd4bd7fb2b6a3cdef6dd/packages/core/src/introspection.ts#L57
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
    browser: {
      enabled: isTrace,
      headless: true,
      instances: [{ browser: 'chromium', testTimeout: 60_000 }],
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
  },
});
