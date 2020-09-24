import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: { index: 'src/index.ts', 'datagen-cli': 'src/datagen-cli.ts' },
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
      css({ output: 'dist/demo-style.css' }),
      commonjs(),
      postcss(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './dist/esm/index.d.ts',
    output: [{ file: 'dist/esm/x-grid-data-generator.d.ts', format: 'es' }],
    plugins: [dts(), !production && sourceMaps()],
  },
];
