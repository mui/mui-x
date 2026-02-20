import fs from 'node:fs/promises';
import path from 'node:path';
import type { AggregatedResults } from './types';

export async function readPrMetrics(benchmarksDir: string): Promise<Record<string, number>> {
  const resultsPath = path.join(benchmarksDir, 'results.json');
  const content = await fs.readFile(resultsPath, 'utf-8');
  const { benchmarks } = JSON.parse(content) as AggregatedResults;

  const prMetrics: Record<string, number> = {};
  for (const [name, benchmark] of Object.entries(benchmarks)) {
    prMetrics[name] = benchmark.duration;
  }

  return prMetrics;
}
