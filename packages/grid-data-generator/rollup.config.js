import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default {
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
    css({output: 'dist/demo-style.css'}),
    commonjs(),
    postcss(),
    !production && sourceMaps(),
    production && terser(),
  ],
};
