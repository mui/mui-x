const DATA_REPO_BASE =
  'https://raw.githubusercontent.com/mnajdova/performance-benchmark-data/main/benchmarks/monthly';

function getMonthStrings(): [string, string] {
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previous = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

  return [current, previous];
}

async function fetchLastDuration(benchmarkName: string): Promise<number | null> {
  const [currentMonth, previousMonth] = getMonthStrings();

  for (const month of [currentMonth, previousMonth]) {
    const url = `${DATA_REPO_BASE}/${benchmarkName}/${month}.jsonl`;
    const response = await fetch(url);

    if (!response.ok) {
      continue;
    }

    const text = (await response.text()).trim();
    if (!text) {
      continue;
    }

    const lines = text.split('\n');
    const lastLine = lines[lines.length - 1];
    const entry = JSON.parse(lastLine) as { duration: number };
    return entry.duration;
  }

  return null;
}

export async function fetchMasterMetrics(): Promise<Record<string, number>> {
  const masterMetricsByFile: Record<string, number> = {};

  // Discover benchmark names from the PR results directory
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const benchmarksDir = process.env.BENCHMARKS_DIR || './benchmarks';

  let jsonFiles: string[];
  try {
    const allFiles = await fs.readdir(benchmarksDir);
    jsonFiles = allFiles.filter((f) => f.endsWith('.json'));
  } catch {
    console.warn('Could not read benchmarks directory to discover benchmark names');
    return masterMetricsByFile;
  }

  const results = await Promise.all(
    jsonFiles.map(async (file) => {
      const benchmarkName = path.basename(file, '.json');
      const duration = await fetchLastDuration(benchmarkName);
      return { file, duration };
    }),
  );

  for (const result of results) {
    if (result.duration !== null) {
      masterMetricsByFile[result.file] = result.duration;
    }
  }

  return masterMetricsByFile;
}
