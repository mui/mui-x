import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [codspeedPlugin(), react()],
  test: {
    environment: 'jsdom',
    // browser: {
    //   enabled: true,
    //   headless: true,
    //   name: 'chromium',
    //   provider: 'playwright',
    //   providerOptions: {
    //     timeout: 60000,
    //   },
    // },
  },
});
