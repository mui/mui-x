import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';
import react from '@vitejs/plugin-react';

const isCI = process.env.CI === 'true';

export default defineConfig({
  plugins: [...(isCI ? [codspeedPlugin()] : []), react()],
  test: {
    setupFiles: ['./setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium', testTimeout: 60_000 }],
      provider: 'playwright',
    },
  },
});
