import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: {
      index: 'src/index.ts',
      'license-cli': 'src/license-cli.ts',
    },
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: !production,
      },
      {
        dir: 'dist/cjs',
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
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './dist/esm/index.d.ts',
    output: [{ file: 'dist/x-license.d.ts', format: 'es' }],
    plugins: [dts(), !production && sourceMaps()],
  },
];
