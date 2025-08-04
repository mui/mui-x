import { BenchOptions } from 'vitest';
import { isTrace } from './env';

const iterations = import.meta.env.BENCHMARK_ITERATIONS
  ? parseInt(import.meta.env.BENCHMARK_ITERATIONS, 10)
  : 1;

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
  iterations,
};

export const options: BenchOptions = isTrace ? traceOptions : benchOptions;
