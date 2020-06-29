import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index-esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index-cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],

    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      production &&
        cleaner({
          targets: ['./dist/'],
        }),
      typescript(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/data-grid.d.ts', format: 'es' }],
    plugins: [
      dts(),
      command(`cat ../x-grid-modules/dist/x-grid-modules.d.ts ./dist/data-grid.d.ts > ./dist/data-grid.all.d.ts`, {
        exitOnFail: true,
        wait: true,
      }),
      !production && sourceMaps(),
    ],
  },
];
