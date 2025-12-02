import { bench as vitestBench, BenchOptions } from 'vitest';
import { getTaskMode } from './options';
import { isTrace } from './env';

export function bench(name: string, fn: () => Promise<void>, options?: BenchOptions) {
  vitestBench(name, isTrace ? wrapFnWithTrace(name, fn) : fn, options);
}

function wrapFnWithTrace(name: string, fn: () => Promise<void>): () => Promise<void> {
  const benchmarkUtils = import('./benchmark-utils');

  return async function tracedFn() {
    const { startBenchmark, endBenchmark } = await benchmarkUtils;
    const taskMode = getTaskMode(name);

    if (taskMode === 'run') {
      await startBenchmark(name);
    }

    try {
      await fn();
    } finally {
      if (taskMode === 'run') {
        await endBenchmark(name);
      }
    }
  };
}
