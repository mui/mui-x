import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import copy from 'rollup-plugin-copy';
import pkg from './data-grid/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './data-grid/src/index.ts',
    output: [
      {
        file: './data-grid/dist/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './data-grid/dist/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      production &&
        cleaner({
          targets: ['./data-grid/dist/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './data-grid/dist/data-grid/src/index.d.ts',
    output: [{ file: './data-grid/dist/data-grid.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: ['./data-grid/README.md', './data-grid/LICENSE'],
              dest: './data-grid/dist',
            },
            {
              src: './x-grid/package.json',
              dest: './x-grid/dist',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'index-cjs.js';
                contents.module = 'index-esm.js';
                contents.types = 'data-grid.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
            {
              src: './data-grid/dist/data-grid/src/themeAugmentation',
              dest: './data-grid/dist',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./data-grid/dist/data-grid/`,
            `rm -rf ./data-grid/dist/_modules_ `,
            `rm -rf ./data-grid/dist/x-grid`,
            `rm -rf ./data-grid/dist/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
