import type { BenchmarkReport } from './types';

export function extractTotalDuration(report: BenchmarkReport): number {
  let totalDuration = 0;
  for (const render of report.renders) {
    totalDuration += render.actualDuration;
  }
  return totalDuration;
}
