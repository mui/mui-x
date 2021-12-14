import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';
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
        dir: 'build/esm',
        format: 'esm',
        sourcemap: !production,
      },
      {
        dir: 'build/cjs',
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
          targets: ['./build/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
      production &&
        copy({
          targets: [
            {
              src: ['./README.md', './LICENSE', '../../CHANGELOG.md', './bin'],
              dest: './build',
            },
            {
              src: './package.json',
              dest: './build',
              transform: () => {
                const contents = { ...pkg };
                contents.main = 'cjs/index.js';
                contents.module = 'esm/index.js';
                contents.types = 'x-license-pro.d.ts';
                return JSON.stringify(contents, null, 2);
              },
            },
          ],
        }),
    ],
  },
  {
    input: './build/esm/index.d.ts',
    output: [{ file: 'build/x-license-pro.d.ts', format: 'es' }],
    plugins: [dts(), !production && sourceMaps()],
  },
];
