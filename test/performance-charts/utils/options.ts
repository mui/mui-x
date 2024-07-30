import { BenchOptions } from 'vitest';

const iterations = process.env.BENCHMARK_ITERATIONS
  ? parseInt(process.env.BENCHMARK_ITERATIONS, 10)
  : 1;

export const options: BenchOptions = {
  iterations,
};
