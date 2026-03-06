import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { $ } from 'execa';
import type { Reporter, TestCase } from 'vitest/node';
import type { AggregatedResults, BenchmarkReport, BenchmarkResult } from '../ci-scripts/types';
import { cyan, dim, green, red, yellow } from './log';

interface IterationEvent {
  id: string;
  phase: string;
  actualDuration: number;
  startTime: number;
}

function getEventKey(event: IterationEvent): string {
  return `${event.id}:${event.phase}`;
}

function calculateMean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function calculateStdDev(values: number[], mean: number): number {
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length);
}

function generateReportFromIterations(iterations: IterationEvent[][]): BenchmarkReport {
  if (iterations.length === 0) {
    return { renders: [] };
  }

  const iterationCount = iterations.length;
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

  // Merge events by calculating mean duration and standard deviation (with IQR outlier removal)
  const renders = firstIteration.map((event, index) => {
    const durations = iterations.map((iteration) => iteration[index].actualDuration);

    // Apply IQR outlier removal
    const sorted = [...durations].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const filteredIndices = durations
      .map((d, i) => (isOutlier(d, q1, q3) ? -1 : i))
      .filter((i) => i >= 0);

    // Fall back to all values if every value is an outlier
    const indices = filteredIndices.length > 0 ? filteredIndices : durations.map((_, i) => i);

    const filteredDurations = indices.map((i) => durations[i]);
    const meanDuration = calculateMean(filteredDurations);
    const stdDev = calculateStdDev(filteredDurations, meanDuration);
    const coefficientOfVariation = meanDuration > 0 ? stdDev / meanDuration : 0;

    // Calculate mean relative start time from the same filtered iterations
    const relativeStartTimes = indices.map((i) => {
      const firstEventStartTime = iterations[i][0].startTime;
      return iterations[i][index].startTime - firstEventStartTime;
    });
    const meanStartTime = calculateMean(relativeStartTimes);

    if (meanDuration > 1 && coefficientOfVariation > 0.1) {
      console.warn(
        `High coefficient of variation (${(coefficientOfVariation * 100).toFixed(1)}%) for render #${index} event "${getEventKey(event)}". ` +
          `Mean: ${meanDuration.toFixed(2)}ms, StdDev: ${stdDev.toFixed(2)}ms. Results may be unreliable.`,
      );
    }

    return {
      actualDuration: meanDuration,
      startTime: meanStartTime,
    };
  });

  return {
    metadata: { iterations: iterationCount },
    renders,
  };
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

function isOutlier(value: number, q1: number, q3: number): boolean {
  const iqr = q3 - q1;
  return value < q1 - 1.5 * iqr || value > q3 + 1.5 * iqr;
}

const DURATION_NOISE_FLOOR = 0.1; // ms — below timer resolution

function printDurationMatrix(name: string, iterations: IterationEvent[][]): void {
  if (iterations.length === 0) {
    return;
  }

  const renderCount = iterations[0].length;

  // Collect durations per render: durations[renderIdx][iterIdx]
  const durations: number[][] = [];
  for (let r = 0; r < renderCount; r += 1) {
    durations.push(iterations.map((iter) => iter[r].actualDuration));
  }

  const pad = (s: string, w: number) => (s.length >= w ? s : ' '.repeat(w - s.length) + s);
  const labelWidth = 28;
  const statWidth = 16;

  const headerCells = [
    pad('Render', labelWidth),
    pad('Raw μ±σ', statWidth),
    pad('IQR μ±σ', statWidth),
    pad('Out', 4),
  ];
  const header = headerCells.join(dim(' | '));
  const separator = dim('-'.repeat(headerCells.join(' | ').length));

  const rows: string[] = [];

  for (let r = 0; r < renderCount; r += 1) {
    const row = durations[r];
    const sorted = [...row].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const filtered = row.filter((d) => !isOutlier(d, q1, q3));
    const used = filtered.length > 0 ? filtered : row;
    const rawMean = calculateMean(row);
    const rawSigma = calculateStdDev(row, rawMean);
    const iqrMean = calculateMean(used);
    const iqrSigma = calculateStdDev(used, iqrMean);
    const dropped = row.length - used.length;

    // Skip statistically irrelevant renders
    if (iqrMean < DURATION_NOISE_FLOOR) {
      continue;
    }

    const event = iterations[0][r];
    const label = `#${r} ${event.id}:${event.phase}`;
    const rawStr = `${rawMean.toFixed(2)}±${rawSigma.toFixed(2)}`;
    const iqrStr = `${iqrMean.toFixed(2)}±${iqrSigma.toFixed(2)}`;

    rows.push(
      [
        pad(label.slice(0, labelWidth), labelWidth),
        dim(pad(rawStr, statWidth)),
        cyan(pad(iqrStr, statWidth)),
        dropped > 0 ? yellow(pad(String(dropped), 4)) : dim(pad('0', 4)),
      ].join(dim(' | ')),
    );
  }

  // eslint-disable-next-line no-console
  console.log(`\n${dim(`=== Duration Matrix: ${name} (IQR method) ===`)}`);
  // eslint-disable-next-line no-console
  console.log(header);
  // eslint-disable-next-line no-console
  console.log(separator);
  // eslint-disable-next-line no-console
  rows.forEach((row) => console.log(row));
}

function extractTotalDuration(report: BenchmarkReport): number {
  let totalDuration = 0;
  for (const render of report.renders) {
    if (render.actualDuration >= DURATION_NOISE_FLOOR) {
      totalDuration += render.actualDuration;
    }
  }
  return totalDuration;
}

async function getCommitSha(): Promise<string | null> {
  if (process.env.COMMIT_SHA) {
    return process.env.COMMIT_SHA;
  }
  try {
    const { stdout } = await $`git rev-parse HEAD`;
    return stdout.trim();
  } catch {
    return null;
  }
}

class BenchmarkReporter implements Reporter {
  private benchmarks: Record<string, BenchmarkResult> = {};

  onTestCaseResult(testCase: TestCase): void {
    const meta = testCase.meta();
    const iterations = meta.benchmarkIterations as IterationEvent[][] | undefined;

    if (!iterations) {
      if (testCase.result().state === 'failed') {
        const errors = testCase.result().errors ?? [];
        // eslint-disable-next-line no-console
        console.log(red(`  FAILED: ${testCase.fullName}`));
        for (const error of errors) {
          // eslint-disable-next-line no-console
          console.log(red(`  ${error.message ?? JSON.stringify(error)}`));
        }
      }
      return;
    }

    const name = (meta.benchmarkName as string) ?? testCase.fullName;
    const report = generateReportFromIterations(iterations);
    const duration = extractTotalDuration(report);

    this.benchmarks[name] = {
      duration,
      renderCount: report.renders.length,
      iterations: report.metadata?.iterations ?? 1,
      renders: report.renders,
    };

    // eslint-disable-next-line no-console
    console.log(
      green(`  ${name}: ${duration.toFixed(2)}ms`) +
        dim(` (${report.renders.length} renders, ${report.metadata?.iterations ?? 1} iterations)`),
    );

    printDurationMatrix(name, iterations);
  }

  async onTestRunEnd(): Promise<void> {
    const count = Object.keys(this.benchmarks).length;

    // eslint-disable-next-line no-console
    console.log(
      `\n${cyan('Benchmark Results')} ${dim(`(${count} benchmark${count === 1 ? '' : 's'})`)}`,
    );
    for (const [name, result] of Object.entries(this.benchmarks)) {
      // eslint-disable-next-line no-console
      console.log(
        `  ${name}: ${result.duration.toFixed(2)}ms ${dim(`(${result.renderCount} renders, ${result.iterations} iterations)`)}`,
      );
    }

    const commitSha = await getCommitSha();

    const results: AggregatedResults = {
      commitSha,
      timestamp: Date.now(),
      benchmarks: this.benchmarks,
    };

    const benchmarksDir = path.resolve(__dirname, '../benchmarks');
    await fs.mkdir(benchmarksDir, { recursive: true });

    const outputPath = path.join(benchmarksDir, 'results.json');
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

    // eslint-disable-next-line no-console
    console.log(dim(`\nResults saved to ${outputPath}`));
  }
}

export default BenchmarkReporter;
