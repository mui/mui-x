import { generateReleaseInfo } from '@mui/x-license-pro';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import copy from 'rollup-plugin-copy';
import pkg from './x-grid/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './x-grid/src/index.ts',
    output: [
      {
        file: './x-grid/build/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './x-grid/build/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: Object.keys({ ...pkg.peerDependencies, ...pkg.dependencies }).map((packageName) => {
      // Make sure that e.g. `react` as well as `react/jsx-runtime` is considered an external
      return new RegExp(`(${packageName}|${packageName}\\/.*)`);
    }),
    plugins: [
      replace({
        __RELEASE_INFO__: generateReleaseInfo(),
      }),
      production &&
        cleaner({
          targets: ['./x-grid/build/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.tsx'],
        plugins: [
          [
            'transform-react-remove-prop-types',
            {
              ignoreFilenames: ['DataGridPro.tsx'],
            },
          ],
        ],
      }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './x-grid/build/x-grid/src/index.d.ts',
    output: [{ file: './x-grid/build/x-grid.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: ['./x-grid/README.md', './x-grid/LICENSE.md', '../../CHANGELOG.md'],
              dest: './x-grid/build',
            },
            {
              src: './x-grid/package.json',
              dest: './x-grid/build',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'index-cjs.js';
                contents.module = 'index-esm.js';
                contents.types = 'x-grid.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
            {
              src: './x-grid/build/x-grid/src/themeAugmentation',
              dest: './x-grid/build',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./x-grid/build/x-grid`,
            `rm -rf ./x-grid/build/_modules_`,
            `rm -rf ./x-grid/build/data-grid`,
            `rm -rf ./x-grid/build/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
