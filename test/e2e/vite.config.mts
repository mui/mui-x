import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/extensions
import generateReleaseInfo from '../../scripts/generateReleaseInfo.mjs';
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
          .replaceAll('__DISABLE_CHANCE_RANDOM__', 'true')
          .replaceAll('__ALLOW_TEST_LICENSES__', 'true')
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
