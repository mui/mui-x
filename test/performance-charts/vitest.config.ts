import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import { createBenchmarkVitestConfig } from '@mui/internal-benchmark/vitest';

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
