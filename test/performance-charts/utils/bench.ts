import { bench as vitestBench, BenchOptions } from 'vitest';
import { commands } from '@vitest/browser/context';
import { getTaskMode } from './options';
import { isTrace } from './env';

export function bench(name: string, fn: () => Promise<void>, options?: BenchOptions) {
  const wrappedFn = wrapFn(fn);
  vitestBench(name, isTrace ? wrapFnWithTrace(name, wrappedFn) : wrappedFn, options);
}

function wrapFn(fn: () => Promise<void>) {
  return async function wrappedFn() {
    try {
      await fn();
    } finally {
      await commands.requestGC();
    }
  };
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
