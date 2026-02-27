import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generateReleaseInfo } from '@mui/x-internals/generateReleaseInfo';
import { alias } from '../../vitest.shared.mts';

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
          .replaceAll('ALLOW_TEST_LICENSES', 'true')
          .replaceAll('__RELEASE_INFO__', generateReleaseInfo());
      },
    },
  ],
  resolve: {
    alias,
  },
  test: {
    globals: true,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
