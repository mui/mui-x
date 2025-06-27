import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';
import react from '@vitejs/plugin-react';

const isCI = process.env.CI === 'true';
const isTrace = !isCI && process.env.TRACE === 'true';

export default defineConfig({
  plugins: [...(isCI ? [codspeedPlugin()] : []), react()],
  test: {
    setupFiles: ['./setup.ts'],
    env: { TRACE: isTrace ? 'true' : 'false' },
    environment: isTrace ? 'node' : 'jsdom',
    browser: {
      enabled: isTrace,
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
      provider: 'playwright',
    },
  },
});
