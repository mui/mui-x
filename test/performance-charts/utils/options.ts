import { BenchOptions } from 'vitest';
import { cleanup } from 'vitest-browser-react/pure';
import { commands } from '@vitest/browser/context';
import { Task } from 'tinybench';
import { isTrace } from './env';
import { addMemoryUsageEntry, getMemoryUsage } from './memory-utils';

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

const lastMemoryUsage = new Map<string, number>();

const benchOptions: BenchOptions = {
  warmupIterations: 10,
  warmupTime: 0,
  iterations,
  throws: true,
  time: 0,
  setup(task, mode) {
    taskModes.set(task.name, mode);
  },
  async beforeEach(task: Task) {
    const mode = getTaskMode(task.name);
    if (mode === 'run') {
      const memoryUsageBefore = await getMemoryUsage();
      lastMemoryUsage.set(task.name, memoryUsageBefore);
    }
  },
  async afterEach(task: Task) {
    cleanup();

    const mode = getTaskMode(task.name);
    if (mode === 'run') {
      const memoryUsageAfter = await getMemoryUsage();
      await commands.requestGC();
      const lastUsage = lastMemoryUsage.get(task.name);
      lastMemoryUsage.delete(task.name);

      if (lastUsage === undefined) {
        console.warn(`No last memory usage found for task: ${task.name}`);
      } else {
        addMemoryUsageEntry(task.name, memoryUsageAfter - lastUsage);
      }
    }
  },
};

export const options: BenchOptions = isTrace ? traceOptions : benchOptions;
