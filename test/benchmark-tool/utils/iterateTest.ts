import type { PlaywrightTestArgs, PlaywrightTestOptions, TestInfo } from '@playwright/test';
import { RenderEvent } from './Profiler';

interface BenchmarkRender {
  id: string;
  name?: string;
  phase: string;
  actualDuration: number;
  startTime: number;
  stdDev?: number;
  coefficientOfVariation?: number;
}

interface BenchmarkReport {
  metadata?: { iterations: number };
  renders: BenchmarkRender[];
}

function getEventKey(event: RenderEvent): string {
  return `${event.id}:${event.name}:${event.phase}`;
}

function calculateMean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function calculateStdDev(values: number[], mean: number): number {
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length);
}

function generateReportFromIterations(iterations: RenderEvent[][]): BenchmarkReport {
  if (iterations.length === 0) {
    return { renders: [] };
  }

  const iterationCount = iterations.length;

  // Get the expected order from the first iteration
  const firstIteration = iterations[0];
  const expectedKeys = firstIteration.map(getEventKey);

  // Validate all iterations have the same events in the same order
  for (let i = 1; i < iterations.length; i += 1) {
    const iteration = iterations[i];
    const iterationKeys = iteration.map(getEventKey);

    if (iterationKeys.length !== expectedKeys.length) {
      throw new Error(
        `Iteration ${i} has ${iterationKeys.length} events, but iteration 0 has ${expectedKeys.length} events`,
      );
    }

    for (let j = 0; j < expectedKeys.length; j += 1) {
      if (iterationKeys[j] !== expectedKeys[j]) {
        throw new Error(
          `Event order mismatch at index ${j} in iteration ${i}: ` +
            `expected "${expectedKeys[j]}", got "${iterationKeys[j]}"`,
        );
      }
    }
  }

  // Merge events by calculating mean duration and standard deviation
  // Calculate mean relative start times to preserve gaps between events
  const mergedRenders: BenchmarkRender[] = firstIteration.map((event, index) => {
    const durations = iterations.map((iteration) => iteration[index].actualDuration);
    const meanDuration = calculateMean(durations);
    const stdDev = calculateStdDev(durations, meanDuration);
    const coefficientOfVariation = meanDuration > 0 ? stdDev / meanDuration : 0;

    // Calculate mean relative start time (relative to first event in each iteration)
    const relativeStartTimes = iterations.map((iteration) => {
      const firstEventStartTime = iteration[0].startTime;
      return iteration[index].startTime - firstEventStartTime;
    });
    const meanStartTime = calculateMean(relativeStartTimes);

    // Only warn for meaningful durations (>1ms) to avoid noise from measurement overhead
    if (meanDuration > 1 && coefficientOfVariation > 0.1) {
      console.warn(
        `High coefficient of variation (${(coefficientOfVariation * 100).toFixed(1)}%) for event "${getEventKey(event)}". ` +
          `Mean: ${meanDuration.toFixed(2)}ms, StdDev: ${stdDev.toFixed(2)}ms. Results may be unreliable.`,
      );
    }

    return {
      id: event.id,
      name: event.name,
      phase: event.phase,
      actualDuration: meanDuration,
      startTime: meanStartTime,
      stdDev,
      coefficientOfVariation,
    };
  });

  return {
    metadata: {
      iterations: iterationCount,
    },
    renders: mergedRenders,
  };
}

type TestArgs = Pick<PlaywrightTestArgs, 'page' | 'context' | 'request'>;

type TestFn = (
  args: TestArgs,
  testInfo: TestInfo,
  options: { renders: RenderEvent[]; iteration: number; type: 'warmup' | 'bench' },
) => Promise<void> | void;

export function iterateTest(times: number, testFn: TestFn, options?: { warmupRuns?: number }) {
  return async (
    { page, context, request }: PlaywrightTestArgs & PlaywrightTestOptions,
    testInfo: TestInfo,
  ) => {
    const args = { page, context, request };

    if (options?.warmupRuns) {
      for (let i = 0; i < options.warmupRuns; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await testFn(args, testInfo, { renders: [], iteration: i, type: 'warmup' });
      }
    }

    const iterations: RenderEvent[][] = [];
    for (let i = 0; i < times; i += 1) {
      const renders: RenderEvent[] = [];
      // eslint-disable-next-line no-await-in-loop
      await testFn(args, testInfo, { renders, iteration: i, type: 'bench' });

      iterations[i] = renders;
    }

    const report = generateReportFromIterations(iterations);
    await testInfo.attach('benchmark-report', {
      body: JSON.stringify(report),
      contentType: 'application/json',
    });
  };
}
