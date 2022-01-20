import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import copy from 'rollup-plugin-copy';
import pkg from './x-data-grid-generator/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: {
      index: './x-data-grid-generator/src/index.ts',
      'datagen-cli': './x-data-grid-generator/src/datagen-cli.ts',
    },
    output: [
      {
        dir: './x-data-grid-generator/build/esm',
        format: 'esm',
        sourcemap: !production,
      },
      {
        dir: './x-data-grid-generator/build/cjs',
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
          targets: ['./x-data-grid-generator/build/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './x-data-grid-generator/build/esm/x-data-grid-generator/src/index.d.ts',
    output: [
      { file: './x-data-grid-generator/build/esm/x-data-grid-generator.d.ts', format: 'es' },
    ],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        copy({
          targets: [
            {
              src: [
                './x-data-grid-generator/package.json',
                './x-data-grid-generator/README.md',
                './x-data-grid-generator/LICENSE',
                './x-data-grid-generator/bin',
                '../../CHANGELOG.md',
              ],
              dest: './x-data-grid-generator/build',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./x-data-grid-generator/build/cjs/x-data-grid/`,
            `rm -rf ./x-data-grid-generator/build/cjs/_modules_ `,
            `rm -rf ./x-data-grid-generator/build/cjs/x-data-grid-pro`,
            `rm -rf ./x-data-grid-generator/build/cjs/x-data-grid-generator`,
            `rm -rf ./x-data-grid-generator/build/esm/x-data-grid/`,
            `rm -rf ./x-data-grid-generator/build/esm/_modules_ `,
            `rm -rf ./x-data-grid-generator/build/esm/x-data-grid-pro`,
            `rm -rf ./x-data-grid-generator/build/esm/x-data-grid-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
