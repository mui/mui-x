import fs from 'node:fs/promises';
import path from 'node:path';
import type { AggregatedResults, BenchmarkReport } from './types';
import { extractTotalDuration } from './extractTotalDuration';

async function main() {
  const benchmarksDir = process.env.BENCHMARKS_DIR || path.resolve(__dirname, '../benchmarks');
  const commit = process.env.COMMIT_SHA || 'unknown';

  const allFiles = await fs.readdir(benchmarksDir);
  const jsonFiles = allFiles.filter((f) => f.endsWith('.json') && f !== 'results.json');

  const results: AggregatedResults = {
    commit,
    timestamp: Date.now(),
    benchmarks: {},
  };

  for (const file of jsonFiles) {
    const content = await fs.readFile(path.join(benchmarksDir, file), 'utf-8');
    const report = JSON.parse(content) as BenchmarkReport;
    const benchmarkName = path.basename(file, '.json');

    results.benchmarks[benchmarkName] = {
      duration: extractTotalDuration(report),
      renderCount: report.renders.length,
      iterations: report.metadata?.iterations ?? 1,
    };
  }

  const outputPath = path.join(benchmarksDir, 'results.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

  // eslint-disable-next-line no-console
  console.log(`Aggregated results saved to: ${outputPath}`);
}

main();
