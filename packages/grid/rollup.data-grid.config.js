import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
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
        command(
          [
            `rm -rf ./data-grid/dist/data-grid/`,
            `rm -rf ./data-grid/dist/_modules_ `,
            `rm -rf ./data-grid/dist/x-grid`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
