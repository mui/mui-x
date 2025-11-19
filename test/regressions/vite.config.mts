import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs/promises';
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
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'js-as-jsx',
          setup(build) {
            build.onLoad({ filter: /\.js$/ }, async (args) => {
              if (args.path.includes('/node_modules/')) {
                return null;
              }

              const contents = await fs.readFile(args.path, 'utf8');

              return { contents, loader: 'jsx' };
            });
          },
        },
      ],
    },
  },
  plugins: [
    react(),
    {
      name: 'replace-code',
      enforce: 'post',
      async transform(code) {
        return (
          code
            .replaceAll('DISABLE_CHANCE_RANDOM', 'true')
            .replaceAll('LICENSE_DISABLE_CHECK', 'true')
            // Always disable animations in tests
            .replaceAll('disableAnimations ? 1 : 0', '1')
        );
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
