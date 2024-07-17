import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), codspeedPlugin()],
  test: {
    environment: 'jsdom',
  },
});
