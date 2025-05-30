import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { alias } from '../../vitest.shared.mjs';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    {
      name: 'replace-code',
      enforce: 'post',
      async transform(code) {
        return code
          .replaceAll('DISABLE_CHANCE_RANDOM', 'true')
          .replaceAll('LICENSE_DISABLE_CHECK', 'true');
      },
    },
  ],
  resolve: {
    alias,
  },
});
