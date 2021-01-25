import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
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
        command(
          [
            `rm -rf ./x-grid-data-generator/dist/data-grid/`,
            `rm -rf ./x-grid-data-generator/dist/_modules_ `,
            `rm -rf ./x-grid-data-generator/dist/x-grid`,
            `rm -rf ./x-grid-data-generator/dist/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
