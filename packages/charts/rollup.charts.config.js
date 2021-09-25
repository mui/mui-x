import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: './build/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './build/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      production &&
        cleaner({
          targets: ['./build/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.tsx'],
        plugins: [
          [
            'transform-react-remove-prop-types',
            {
              ignoreFilenames: ['LineChart.tsx'],
            },
          ],
        ],
      }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './build/src/index.d.ts',
    output: [{ file: './build/charts.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: ['./README.md', './LICENSE', '../../CHANGELOG.md'],
              dest: './build',
            },
            {
              src: './package.json',
              dest: './build',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'index-cjs.js';
                contents.module = 'index-esm.js';
                contents.types = 'charts.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
            {
              src: './build/src/themeAugmentation',
              dest: './build',
            },
          ],
        }),
      production &&
        command([`rm -rf ./build/`], {
          exitOnFail: true,
          wait: true,
        }),
    ],
  },
];
