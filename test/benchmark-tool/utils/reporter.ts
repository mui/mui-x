import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import type { RenderEvent } from './Profiler';
import { routeToFileName } from './utils';

const benchmarksDir = path.resolve(__dirname, '../benchmarks');

export interface BenchmarkRender {
  id: string;
  name?: string;
  phase: string;
  actualDuration: number;
  startTime: number;
  stdDev?: number;
  coefficientOfVariation?: number;
}

export interface BenchmarkReport {
  metadata?: { iterations: number };
  renders: BenchmarkRender[];
}

export async function saveReport(report: BenchmarkReport, route: string) {
  // Ensure benchmarks directory exists
  await fs.mkdir(benchmarksDir, { recursive: true });

  // Save report as JSON file based on route name
  const fileName = routeToFileName(route);
  const filePath = path.join(benchmarksDir, `${fileName}.json`);
  await fs.writeFile(filePath, JSON.stringify(report, null, 2));

  // eslint-disable-next-line no-console
  console.log(`Report saved to: ${filePath}`);
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

export function generateReportFromIterations(iterations: RenderEvent[][]): BenchmarkReport {
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

export function generateReport(events: RenderEvent[]): BenchmarkReport {
  if (events.length === 0) {
    return { renders: [] };
  }

  // Make timestamps relative to the first event's start time
  const firstStartTime = events[0].startTime;
  return {
    renders: events.map((event) => ({
      id: event.id,
      name: event.name,
      phase: event.phase,
      actualDuration: event.actualDuration,
      startTime: event.startTime - firstStartTime,
    })),
  };
}
