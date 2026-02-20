import { $ } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AggregatedResults, BenchmarkReport, BenchmarkResult } from './types';
import { extractTotalDuration } from './extractTotalDuration';

async function main() {
  const benchmarksDir = process.env.BENCHMARKS_DIR || path.resolve(__dirname, '../benchmarks');
  const commitSha = process.env.COMMIT_SHA;
  if (!commitSha) {
    throw new Error('COMMIT_SHA environment variable is required');
  }

  const allFiles = await fs.readdir(benchmarksDir);
  const jsonFiles = allFiles.filter((f) => f.endsWith('.json') && f !== 'results.json');

  const benchmarks: Record<string, BenchmarkResult> = Object.fromEntries(
    await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(benchmarksDir, file), 'utf-8');
        const report = JSON.parse(content) as BenchmarkReport;
        const benchmarkName = path.basename(file, '.json');
        return [
          benchmarkName,
          {
            duration: extractTotalDuration(report),
            renderCount: report.renders.length,
            iterations: report.metadata?.iterations ?? 1,
          },
        ] as const;
      }),
    ),
  );

  const results: AggregatedResults = {
    commitSha,
    timestamp: Date.now(),
    benchmarks,
  };

  const prNumber = process.env.PR_NUMBER;
  if (prNumber) {
    const { stdout: mergeBaseSha } = await $`git merge-base HEAD origin/master`;
    results.pr = { number: parseInt(prNumber, 10), mergeBaseSha: mergeBaseSha.trim() };
  }

  const outputPath = path.join(benchmarksDir, 'results.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

  // eslint-disable-next-line no-console
  console.log(`Aggregated results saved to: ${outputPath}`);
}

main();
