import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { $ } from 'execa';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import type { AggregatedResults, BenchmarkReport, BenchmarkResult } from '../ci-scripts/types';

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

class BenchmarkReporter implements Reporter {
  private benchmarks: Record<string, BenchmarkResult> = {};

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'passed') {
      return;
    }

    const attachment = result.attachments.find((a) => a.name === 'benchmark-report');
    if (!attachment?.body) {
      return;
    }

    const report = JSON.parse(attachment.body.toString()) as BenchmarkReport;
    const name = benchmarkNameFromFile(test.location.file);

    this.benchmarks[name] = {
      duration: extractTotalDuration(report),
      renderCount: report.renders.length,
      iterations: report.metadata?.iterations ?? 1,
    };
  }

  async onEnd(): Promise<void> {
    const commitSha = process.env.COMMIT_SHA;
    if (!commitSha) {
      return;
    }

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
    console.log(`Aggregated results saved to: ${outputPath}`);
  }
}

export default BenchmarkReporter;
