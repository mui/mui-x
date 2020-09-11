import resolve from '@rollup/plugin-node-resolve';
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
      resolve({
        resolveOnly: [/^@material-ui\/x-.*$/], // we bundle x-license and x-grid-modules
      }),
      production &&
        cleaner({
          targets: ['./dist/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/data-grid.d.ts', format: 'es' }],
    plugins: [dts(), !production && sourceMaps()],
  },
];
