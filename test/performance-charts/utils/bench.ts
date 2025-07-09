import { bench as vitestBench, BenchOptions } from 'vitest';
import { cdp, commands } from '@vitest/browser/context';
import type { Protocol } from 'playwright-core/types/protocol';
import { getTaskMode } from './options';
import { isTrace } from './env';

export function bench(name: string, fn: () => Promise<void>, options?: BenchOptions) {
  const wrappedFn = wrapFn(fn);
  vitestBench(name, isTrace ? wrapFnWithTrace(name, wrappedFn) : wrappedFn, options);
}

function wrapFn(fn: () => Promise<void>) {
  return async function wrappedFn() {
    try {
      console.log('Memory before:', formatMemoryUsage(await cdp().send('Runtime.getHeapUsage')));
      await fn();
    } finally {
      console.log('Memory after run:', formatMemoryUsage(await cdp().send('Runtime.getHeapUsage')));
      await commands.requestGC();
      console.log('Memory after GC:', formatMemoryUsage(await cdp().send('Runtime.getHeapUsage')));
    }
  };
}

function formatMemoryUsage(usage: Protocol.CommandParameters['Runtime.getHeapUsage']) {
  return {
    used: `${(usage.usedSize / 1024 / 1024).toFixed(2)} MB`,
    total: `${(usage.totalSize / 1024 / 1024).toFixed(2)} MB`,
    limit: `${(usage.sizeLimit / 1024 / 1024).toFixed(2)} MB`,
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
