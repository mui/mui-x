import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { $ } from 'execa';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import type { AggregatedResults, BenchmarkReport, BenchmarkResult } from '../ci-scripts/types';
import { cyan, dim, fileUrl, green, red } from './log';

function benchmarkNameFromFile(filePath: string): string {
  const parts = path.dirname(filePath).split('/app');
  if (parts.length < 2) {
    throw new Error(
      `Expected file path to contain an '/app' directory segment, but got: ${filePath}`,
    );
  }
  // e.g. "/scatter" -> "scatter"
  return parts[parts.length - 1].replace(/\//g, '-').replace(/^-/, '');
}

function extractTotalDuration(report: BenchmarkReport): number {
  let totalDuration = 0;
  for (const render of report.renders) {
    totalDuration += render.actualDuration;
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

  onBegin(_config: any, suite: any): void {
    const count = suite.allTests?.().length ?? 0;
    // eslint-disable-next-line no-console
    console.log(cyan(`\nFound ${count} benchmark${count === 1 ? '' : 's'}`));
  }

  onTestBegin(test: TestCase): void {
    // eslint-disable-next-line no-console
    console.log(
      `\nRunning ${cyan(test.title)} ${dim(`(${fileUrl(test.location.file)}:${test.location.line})`)}`,
    );
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'passed') {
      // eslint-disable-next-line no-console
      console.log(red(`  FAILED (${result.status})`));
      for (const error of result.errors ?? []) {
        // eslint-disable-next-line no-console
        console.log(red(`  ${error.message ?? error.value ?? JSON.stringify(error)}`));
      }
      return;
    }

    const attachment = result.attachments.find((a) => a.name === 'benchmark-report');
    if (!attachment?.body) {
      // eslint-disable-next-line no-console
      console.log(red(`  No benchmark report attached — test may not use iterateTest()`));
      return;
    }

    const report = JSON.parse(attachment.body.toString()) as BenchmarkReport;
    const name = benchmarkNameFromFile(test.location.file);
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
  }

  async onEnd(): Promise<void> {
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

    const prNumber = process.env.PR_NUMBER;
    if (prNumber) {
      const { stdout: mergeBaseSha } = await $`git merge-base HEAD origin/master`;
      results.pr = { number: parseInt(prNumber, 10), mergeBaseSha: mergeBaseSha.trim() };
    }

    const benchmarksDir = path.resolve(__dirname, '../benchmarks');
    await fs.mkdir(benchmarksDir, { recursive: true });

    const outputPath = path.join(benchmarksDir, 'results.json');
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

    // eslint-disable-next-line no-console
    console.log(dim(`\nResults saved to ${fileUrl(outputPath)}`));
  }
}

export default BenchmarkReporter;
