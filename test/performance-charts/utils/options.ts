import { BenchOptions } from 'vitest';

const iterations = globalThis.process?.env?.BENCHMARK_ITERATIONS
  ? parseInt(globalThis.process.env.BENCHMARK_ITERATIONS, 10)
  : 1;

export const options: BenchOptions = {
  iterations,
};
