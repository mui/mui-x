import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import pkg from './charts/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './charts/src/index.ts',
    output: [
      {
        file: './charts/build/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './charts/build/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      production &&
        cleaner({
          targets: ['./charts/build/'],
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
    input: './charts/build/charts/src/index.d.ts',
    output: [{ file: './charts/build/charts.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: ['./charts/README.md', './charts/LICENSE', '../../CHANGELOG.md'],
              dest: './charts/build',
            },
            {
              src: './charts/package.json',
              dest: './charts/build',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'index-cjs.js';
                contents.module = 'index-esm.js';
                contents.types = 'charts.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
            {
              src: './charts/build/charts/src/themeAugmentation',
              dest: './charts/build',
            },
          ],
        }),
      production &&
        command([`rm -rf ./charts/build/charts/`], {
          exitOnFail: true,
          wait: true,
        }),
    ],
  },
];
