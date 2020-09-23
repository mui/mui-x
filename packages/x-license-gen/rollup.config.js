import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import pkg from './package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input:   'src/license-cli.ts',
    output: [
      {
        file: './dist/x-license-gen-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './dist/x-license-gen-cjs.js',
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
    input: './dist/index.d.ts',
    output: [{ file: 'dist/x-license-gen.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production && command([
        `rm -rf ./dist/encoding/`,
        `rm -rf ./dist/index*`,
        `rm -rf ./dist/generateLicense*`,
      ], {
        exitOnFail: true,
        wait: true,
      }),
    ],
  },
];
