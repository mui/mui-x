import { mergeConfig, defineConfig } from 'vitest/config';
import { createBenchmarkVitestConfig } from '@mui/internal-benchmark/vitest';

export default mergeConfig(
  createBenchmarkVitestConfig(),
  defineConfig({
    test: {
      setupFiles: ['./setup.ts'],
    },
  }),
);
