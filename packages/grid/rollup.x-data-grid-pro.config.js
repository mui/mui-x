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
import pkg from './x-data-grid-pro/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './x-data-grid-pro/src/index.ts',
    output: [
      {
        file: './x-data-grid-pro/build/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './x-data-grid-pro/build/index-cjs.js',
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
          targets: ['./x-data-grid-pro/build/'],
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
    input: './x-data-grid-pro/build/x-data-grid-pro/src/index.d.ts',
    output: [{ file: './x-data-grid-pro/build/x-data-grid-pro.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: [
                './x-data-grid-pro/README.md',
                './x-data-grid-pro/LICENSE',
                '../../CHANGELOG.md',
              ],
              dest: './x-data-grid-pro/build',
            },
            {
              src: './x-data-grid-pro/package.json',
              dest: './x-data-grid-pro/build',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'index-cjs.js';
                contents.module = 'index-esm.js';
                contents.types = 'x-data-grid-pro.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
            {
              src: './x-data-grid-pro/build/x-data-grid-pro/src/themeAugmentation',
              dest: './x-data-grid-pro/build',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./x-data-grid-pro/build/x-data-grid-pro`,
            `rm -rf ./x-data-grid-pro/build/_modules_`,
            `rm -rf ./x-data-grid-pro/build/data-grid`,
            `rm -rf ./x-data-grid-pro/build/x-data-grid-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
