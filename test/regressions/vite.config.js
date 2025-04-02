import url from 'url';
import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@mui/docs': path.resolve(
        currentDirectory,
        '../../node_modules/@mui/monorepo/packages/mui-docs/src',
      ),
      docsx: path.resolve(currentDirectory, '../../docs'),
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
          .replaceAll('__RELEASE_INFO__', 'MTU5NjMxOTIwMDAwMA==') // 2020-08-02
          .replaceAll('DISABLE_CHANCE_RANDOM', 'true');
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
});
