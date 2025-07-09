import { bench as vitestBench, BenchOptions } from 'vitest';
import { cdp, commands } from '@vitest/browser/context';
import { getTaskMode } from './options';
import { isTrace } from './env';
import { addMemoryUsageEntry } from './memory-utils';

export function bench(name: string, fn: () => Promise<void>, options?: BenchOptions) {
  const wrappedFn = wrapFn(name, fn);
  vitestBench(name, isTrace ? wrapFnWithTrace(name, wrappedFn) : wrappedFn, options);
}

function wrapFn(name: string, fn: () => Promise<void>) {
  return async function wrappedFn() {
    const memoryUsageBefore = await getMemoryUsage();

    try {
      await fn();
    } finally {
      addMemoryUsageEntry(name, (await getMemoryUsage()) - memoryUsageBefore);
      await commands.requestGC();
    }
  };
}

async function getMemoryUsage() {
  return (await cdp().send('Runtime.getHeapUsage')).usedSize;
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
