import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import copy from 'rollup-plugin-copy';
import pkg from './x-grid-data-generator/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: {
      index: './x-grid-data-generator/src/index.ts',
      'datagen-cli': './x-grid-data-generator/src/datagen-cli.ts',
    },
    output: [
      {
        dir: './x-grid-data-generator/build/esm',
        format: 'esm',
        sourcemap: !production,
      },
      {
        dir: './x-grid-data-generator/build/cjs',
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
          targets: ['./x-grid-data-generator/build/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './x-grid-data-generator/build/esm/x-grid-data-generator/src/index.d.ts',
    output: [
      { file: './x-grid-data-generator/build/esm/x-grid-data-generator.d.ts', format: 'es' },
    ],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: [
                './x-grid-data-generator/package.json',
                './x-grid-data-generator/README.md',
                './x-grid-data-generator/LICENSE',
                './x-grid-data-generator/bin',
                '../../CHANGELOG.md',
              ],
              dest: './x-grid-data-generator/build',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./x-grid-data-generator/build/cjs/data-grid/`,
            `rm -rf ./x-grid-data-generator/build/cjs/_modules_ `,
            `rm -rf ./x-grid-data-generator/build/cjs/x-grid`,
            `rm -rf ./x-grid-data-generator/build/cjs/x-grid-data-generator`,
            `rm -rf ./x-grid-data-generator/build/esm/data-grid/`,
            `rm -rf ./x-grid-data-generator/build/esm/_modules_ `,
            `rm -rf ./x-grid-data-generator/build/esm/x-grid`,
            `rm -rf ./x-grid-data-generator/build/esm/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
