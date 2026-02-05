import fs from 'node:fs/promises';
import path from 'node:path';
import type { Trace } from './types';
import { extractTotalDuration } from './extractTotalDuration';

export async function readPrMetrics(benchmarksDir: string): Promise<Record<string, number>> {
  const prMetricsByFile: Record<string, number> = {};

  try {
    const allFiles = await fs.readdir(benchmarksDir);
    const jsonFiles = allFiles.filter((f) => f.endsWith('.json'));

    const results = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(benchmarksDir, file), 'utf-8');
        const trace = JSON.parse(content) as Trace;
        return { file, duration: extractTotalDuration(trace) };
      }),
    );

    for (const result of results) {
      prMetricsByFile[result.file] = result.duration;
    }
  } catch (error) {
    console.error(error);
  }

  return prMetricsByFile;
}
