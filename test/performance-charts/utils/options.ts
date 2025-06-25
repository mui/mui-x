import { BenchOptions } from 'vitest';
import { isTrace } from './env';

const iterations = import.meta.env.BENCHMARK_ITERATIONS
  ? parseInt(import.meta.env.BENCHMARK_ITERATIONS, 10)
  : 100;

const taskModes = new Map<string, 'run' | 'warmup'>();
export function getTaskMode(taskName: string): 'run' | 'warmup' {
  return taskModes.get(taskName) || 'warmup';
}

const traceOptions: BenchOptions = {
  time: 0,
  iterations,
  setup(task, mode) {
    taskModes.set(task.name, mode);
  },
};

const benchOptions: BenchOptions = {
  warmupIterations: 5,
  warmupTime: 0,
  iterations,
  throws: true,
  time: 0,
};

export const options: BenchOptions = isTrace ? traceOptions : benchOptions;
