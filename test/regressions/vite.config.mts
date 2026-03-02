import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs/promises';
// eslint-disable-next-line import/extensions
import generateReleaseInfo from '../../scripts/generateReleaseInfo.mjs';
import { alias } from '../../vitest.shared.mts';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: [
      ...alias,
      {
        find: '@mui/docs',
        replacement: path.resolve(
          import.meta.dirname,
          '../../node_modules/@mui/monorepo/packages/mui-docs/src',
        ),
      },
      {
        find: 'docsx',
        replacement: path.resolve(import.meta.dirname, '../../docs'),
      },
    ],
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
            .replaceAll('__DISABLE_CHANCE_RANDOM__', 'true')
            .replaceAll('__ALLOW_TEST_LICENSES__', 'true')
            .replaceAll('__RELEASE_INFO__', generateReleaseInfo())
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
