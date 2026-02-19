import type { AggregatedResults } from './types';

const DATA_REPO_BASE = 'https://raw.githubusercontent.com/mui/mui-x/test-results/benchmarks';

export async function fetchMasterMetrics(baseSha?: string): Promise<Record<string, number>> {
  if (!baseSha) {
    console.warn('No base SHA provided, skipping baseline fetch');
    return {};
  }

  const url = `${DATA_REPO_BASE}/commits/${baseSha}/results.json`;
  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`No baseline data found for commit ${baseSha}`);
    return {};
  }

  const results = (await response.json()) as AggregatedResults;
  const metrics: Record<string, number> = {};
  for (const [name, benchmark] of Object.entries(results.benchmarks)) {
    metrics[name] = benchmark.duration;
  }
  return metrics;
}
