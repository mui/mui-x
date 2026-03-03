import * as React from 'react';
import { it } from 'vitest';
import { createRoot } from 'react-dom/client'; // aliased to react-dom/profiling by Vite
import { flushSync } from 'react-dom';
import { BenchProfiler, RenderEvent } from './Profiler';

export function benchmark(
  name: string,
  element: React.ReactElement,
  interaction?: () => Promise<void> | void,
  options?: {
    runs?: number;
    warmupRuns?: number;
    afterEach?: () => Promise<void> | void;
  },
) {
  it(name, async ({ task }) => {
    const runs = options?.runs ?? 10;
    const warmupRuns = options?.warmupRuns ?? 10;

    const totalRuns = warmupRuns + runs;
    const iterations: RenderEvent[][] = [];

    if (typeof window.gc !== 'function') {
      console.warn(
        'window.gc is not available. Run with --js-flags=--expose-gc for consistent GC between iterations.',
      );
    }

    for (let i = 0; i < totalRuns; i += 1) {
      const isWarmup = i < warmupRuns;

      // GC before each iteration for consistent starting conditions
      if (typeof window.gc === 'function') {
        window.gc();
      }

      const captures: RenderEvent[] = [];
      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = createRoot(container);
      flushSync(() => {
        root.render(<BenchProfiler captures={captures}>{element}</BenchProfiler>);
      });
      if (interaction) {
        // eslint-disable-next-line no-await-in-loop
        await interaction();
      }
      root.unmount();
      container.remove();

      if (!isWarmup) {
        iterations.push(captures);
      }

      if (options?.afterEach) {
        // eslint-disable-next-line no-await-in-loop
        await options.afterEach();
      }
    }

    task.meta.benchmarkIterations = iterations;
    task.meta.benchmarkName = name;
  });
}
