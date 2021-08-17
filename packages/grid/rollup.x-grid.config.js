import { generateReleaseInfo } from '@mui/x-license-pro';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import pkg from './x-grid/package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input: './x-grid/src/index.ts',
    output: [
      {
        file: './x-grid/dist/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: './x-grid/dist/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      replace({
        __RELEASE_INFO__: generateReleaseInfo(),
      }),
      production &&
        cleaner({
          targets: ['./x-grid/dist/'],
        }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './x-grid/dist/x-grid/src/index.d.ts',
    output: [{ file: './x-grid/dist/x-grid.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production &&
        command(
          [
            `rm -rf ./x-grid/dist/x-grid`,
            `rm -rf ./x-grid/dist/_modules_`,
            `rm -rf ./x-grid/dist/data-grid`,
            `rm -rf ./x-grid/dist/x-grid-data-generator`,
          ],
          {
            exitOnFail: true,
            wait: true,
          },
        ),
    ],
  },
];
