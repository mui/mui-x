import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig } from 'vitest/config';
import { createBenchmarkVitestConfig } from '@mui/internal-benchmark/vitest';

const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default mergeConfig(
  // Allow software WebGL (SwiftShader) since the benchmark harness passes
  // `--disable-gpu` for determinism, which otherwise disables WebGL entirely.
  createBenchmarkVitestConfig({
    launchArgs: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  }),
  defineConfig({
    server: {
      headers: crossOriginIsolationHeaders,
    },
    preview: {
      headers: crossOriginIsolationHeaders,
    },
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
