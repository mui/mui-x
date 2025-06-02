import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
