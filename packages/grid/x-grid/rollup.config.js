import typescript from 'rollup-plugin-typescript2';
import { generateReleaseInfo } from '@material-ui/x-license';
import pkg from './package.json';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
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
      replace({
        __RELEASE_INFO__: generateReleaseInfo(),
      }),
      resolve({
        resolveOnly: [/^@material-ui\/x\-.*$/], //we bundle x-license and x-grid-modules
      }),
      production &&
        cleaner({
          targets: ['./dist/'],
        }),
      typescript({ build: true }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/x-grid.d.ts', format: 'es' }],
    plugins: [
      dts(),
      command(
        `cat ../../license/dist/x-license.d.ts ../x-grid-modules/dist/x-grid-modules.d.ts ./dist/x-grid.d.ts > ./dist/x-grid.all.d.ts`,
        { exitOnFail: true, wait: true },
        !production && sourceMaps(),
      ),
    ],
  },
];
