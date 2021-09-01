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
        dir: './x-grid-data-generator/dist/esm',
        format: 'esm',
        sourcemap: !production,
      },
      {
        dir: './x-grid-data-generator/dist/cjs',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      production &&
        cleaner({
          targets: ['./x-grid-data-generator/dist/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './x-grid-data-generator/dist/esm/x-grid-data-generator/src/index.d.ts',
    output: [{ file: './x-grid-data-generator/dist/esm/x-grid-data-generator.d.ts', format: 'es' }],
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
              ],
              dest: './x-grid-data-generator/dist',
            },
          ],
        }),
      production &&
        command(
          [
            `rm -rf ./x-grid-data-generator/dist/cjs/data-grid/`,
            `rm -rf ./x-grid-data-generator/dist/cjs/_modules_ `,
            `rm -rf ./x-grid-data-generator/dist/cjs/x-grid`,
            `rm -rf ./x-grid-data-generator/dist/cjs/x-grid-data-generator`,
            `rm -rf ./x-grid-data-generator/dist/esm/data-grid/`,
            `rm -rf ./x-grid-data-generator/dist/esm/_modules_ `,
            `rm -rf ./x-grid-data-generator/dist/esm/x-grid`,
            `rm -rf ./x-grid-data-generator/dist/esm/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
