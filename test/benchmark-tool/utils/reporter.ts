import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import type { TraceEvent } from './reporter-types';
import type { RenderEvent } from './Profiler';

const benchmarksDir = path.resolve(__dirname, '../benchmarks');

export async function saveReport(report: Report, route: string) {
  // Ensure benchmarks directory exists
  await fs.mkdir(benchmarksDir, { recursive: true });

  // Save report as JSON file based on route name
  const fileName = route.replace(/\//g, '-').replace(/^-/, '') || 'index';
  const filePath = path.join(benchmarksDir, `${fileName}.json`);
  await fs.writeFile(filePath, JSON.stringify(report, null, 2));

  // eslint-disable-next-line no-console
  console.log(`Report saved to: ${filePath}`);
}

interface Report {
  traceEvents: TraceEvent[];
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

export function generateReportFromIterations(iterations: RenderEvent[][]): Report {
  if (iterations.length === 0) {
    return { traceEvents: [] };
  }

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
  const mergedEvents: RenderEvent[] = firstIteration.map((event, index) => {
    const durations = iterations.map((iteration) => iteration[index].actualDuration);
    const meanDuration = calculateMean(durations);
    const stdDev = calculateStdDev(durations, meanDuration);

    return {
      ...event,
      actualDuration: meanDuration,
      stdDev,
    };
  });

  return {
    traceEvents: mergedEvents.map(mapRenderEventToTraceEvent),
  };
}

export function generateReport(events: RenderEvent[]): Report {
  return {
    traceEvents: events.map(mapRenderEventToTraceEvent),
  };
}

function mapRenderEventToTraceEvent(event: RenderEvent & { stdDev?: number }): TraceEvent {
  return {
    name: 'React Render',
    cat: 'react',
    ph: 'X',
    ts: 0, // Placeholder, should be replaced with actual timestamp
    dur: Math.round(event.actualDuration * 1000), // Convert ms to µs
    pid: 0,
    tid: 0,
    args: {
      id: event.id,
      name: event.name,
      phase: event.phase,
      ...(event.stdDev !== undefined && { stdDev: event.stdDev }),
    },
  };
}
