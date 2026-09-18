import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import { createBenchmarkVitestConfig } from '@mui/internal-benchmark/vitest';

// The benchmark config defines `process.env.NODE_ENV` as `'production'`, so React resolves
// to its production builds. Vite must agree, otherwise `@vitejs/plugin-react` emits the
// development JSX runtime, whose `jsxDEV` export is `undefined` in those builds.
process.env.NODE_ENV = 'production';

export default mergeConfig(
  // Allow software WebGL (SwiftShader) since the benchmark harness passes
  // `--disable-gpu` for determinism, which otherwise disables WebGL entirely.
  createBenchmarkVitestConfig({
    launchArgs: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  }),
  defineConfig({
    test: {
      setupFiles: ['./setup.ts'],
    },
    resolve: {
      alias: [
        {
          find: 'test/utils',
          replacement: fileURLToPath(new URL('../utils', import.meta.url)),
        },
      ],
    },
  }),
);
