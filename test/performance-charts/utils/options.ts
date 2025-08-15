import type { BenchOptions } from 'vitest';
import { cleanup } from 'vitest-browser-react/pure';
import { commands } from '@vitest/browser/context';
import { isTrace } from './env';

const defaultIterations = isTrace ? 1 : 100;
const iterations = import.meta.env.BENCHMARK_ITERATIONS
  ? parseInt(import.meta.env.BENCHMARK_ITERATIONS, 10)
  : defaultIterations;

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
  warmupIterations: 10,
  warmupTime: 0,
  iterations,
  throws: true,
  time: 0,
  // @ts-expect-error Our custom runner supports it, but the default one doesn't.
  async afterEach() {
    cleanup();
    await commands.requestGC();
  },
};

export const options: BenchOptions = isTrace ? traceOptions : benchOptions;
