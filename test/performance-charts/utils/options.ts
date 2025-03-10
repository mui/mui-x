import { BenchOptions } from 'vitest';
import { cleanup } from '@testing-library/react';

const iterations = globalThis.process?.env?.BENCHMARK_ITERATIONS
  ? parseInt(globalThis.process.env.BENCHMARK_ITERATIONS, 10)
  : 1;

export const options: BenchOptions = {
  iterations,
  teardown: () => {
    cleanup();
  },
};
