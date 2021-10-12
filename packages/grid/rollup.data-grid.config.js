import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import pkg from './data-grid/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './data-grid/src/index.ts',
    output: [
      {
        file: './data-grid/build/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './data-grid/build/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: Object.keys({ ...pkg.peerDependencies, ...pkg.dependencies }).map((packageName) => {
      // Make sure that e.g. `react` as well as `react/jsx-runtime` is considered an external
      return new RegExp(`(${packageName}|${packageName}\\/.*)`);
    }),
    plugins: [
      production &&
        cleaner({
          targets: ['./data-grid/build/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.tsx'],
        plugins: [
          [
            'transform-react-remove-prop-types',
            {
              ignoreFilenames: ['DataGrid.tsx'],
            },
          ],
        ],
      }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './data-grid/build/data-grid/src/index.d.ts',
    output: [{ file: './data-grid/build/data-grid.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: ['./data-grid/README.md', './data-grid/LICENSE', '../../CHANGELOG.md'],
              dest: './data-grid/build',
            },
            {
              src: './data-grid/package.json',
              dest: './data-grid/build',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'index-cjs.js';
                contents.module = 'index-esm.js';
                contents.types = 'data-grid.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
            {
              src: './data-grid/build/data-grid/src/themeAugmentation',
              dest: './data-grid/build',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./data-grid/build/data-grid/`,
            `rm -rf ./data-grid/build/_modules_ `,
            `rm -rf ./data-grid/build/x-grid`,
            `rm -rf ./data-grid/build/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
