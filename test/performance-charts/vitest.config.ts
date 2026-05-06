import { mergeConfig, defineConfig } from 'vitest/config';
import { createBenchmarkVitestConfig } from '@mui/internal-benchmark/vitest';

const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default mergeConfig(
  createBenchmarkVitestConfig(),
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
  }),
);
