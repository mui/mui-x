import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: 'dist/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
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
    input: './dist/src/index.d.ts',
    output: [{ file: 'dist/x-grid-modules.d.ts', format: 'es' }],
    plugins: [dts(), !production && sourceMaps()],
  },
];
