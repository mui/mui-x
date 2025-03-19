import fs from 'fs';
import url from 'url';
import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react'
import { replaceCodePlugin } from 'vite-plugin-replace';

const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@mui/docs': path.resolve(currentDirectory, '../../node_modules/@mui/monorepo/packages/mui-docs/src'),
      'docsx': path.resolve(currentDirectory, '../../docs'),
    },
  },
  worker: {
    format: 'es',
  },
  plugins: [
    react(),
    replaceCodePlugin({
      replacements: [
        {
          from: '__RELEASE_INFO__',
          to: 'MTU5NjMxOTIwMDAwMA==', // 2020-08-02
        },
      ],
    }),
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
})
