import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import { alias } from '../../vitest.shared.mts';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      ...alias,
      '@mui/docs': path.resolve(
        import.meta.dirname,
        '../../node_modules/@mui/monorepo/packages/mui-docs/src',
      ),
      docsx: path.resolve(import.meta.dirname, '../../docs'),
    },
  },
  worker: {
    format: 'es',
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
    {
      name: 'js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.match(/.*\.js$/)) {
          return null;
        }
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
  ],
  test: {
    globals: true,
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
