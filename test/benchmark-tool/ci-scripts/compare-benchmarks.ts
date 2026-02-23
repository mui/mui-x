import fs from 'node:fs/promises';
import path from 'node:path';
import type { AggregatedResults, ComparisonResult, FailedBenchmark } from './types';

function calculateDiffPercent(
  diff: number,
  masterDuration: number,
  prDuration: number,
): { num: number; str: string } {
  if (masterDuration > 0) {
    const num = (diff / masterDuration) * 100;
    return { num, str: num.toFixed(2) };
  }
  if (prDuration > 0) {
    return { num: Infinity, str: '+∞' };
  }
  return { num: 0, str: '0.00' };
}

function getEmoji(diffPercent: number, failThreshold: number): string {
  if (diffPercent > failThreshold) {
    return '❌';
  }
  if (diffPercent < -failThreshold) {
    return '✅';
  }
  return '➖';
}

function formatMs(ms: number): string {
  return `${ms.toFixed(2)} ms`;
}

function generateComparisonBody(
  prMetrics: Record<string, number>,
  masterMetrics: Record<string, number>,
  failThreshold: number,
): ComparisonResult {
  const allBenchmarks = [
    ...new Set([...Object.keys(prMetrics), ...Object.keys(masterMetrics)]),
  ].sort();
  const hasMasterMetrics = Object.keys(masterMetrics).length > 0;
  const failedBenchmarks: FailedBenchmark[] = [];

  let body: string;

  if (hasMasterMetrics) {
    const rows = allBenchmarks
      .map((name) => {
        const prDuration = prMetrics[name] || 0;
        const masterDuration = masterMetrics[name] || 0;
        const diff = prDuration - masterDuration;
        const diffPercent = calculateDiffPercent(diff, masterDuration, prDuration);
        const emoji = getEmoji(diffPercent.num, failThreshold);

        if (diffPercent.num > failThreshold) {
          failedBenchmarks.push({ name, diff: diffPercent.str });
        }

        return `| ${name} | ${formatMs(masterDuration)} | ${formatMs(prDuration)} | ${emoji} ${diff > 0 ? '+' : ''}${diff.toFixed(2)} ms (${diffPercent.str}%) |`;
      })
      .join('\n');

    let statusSection = '';
    if (failedBenchmarks.length > 0) {
      statusSection = `
> **⚠️ Performance regression detected!** The following benchmarks exceed the ${failThreshold}% threshold:
> ${failedBenchmarks.map((b) => `\`${b.name}\` (+${b.diff}%)`).join(', ')}

`;
    }

    body = `## Performance Comparison
${statusSection}
| Benchmark | Master | PR | Diff |
|-----------|--------|-----|------|
${rows}

> Fail threshold: **${failThreshold}%**
`;
  } else {
    const rows = allBenchmarks
      .map((name) => {
        const prDuration = prMetrics[name] || 0;
        return `| ${name} | ${formatMs(prDuration)} |`;
      })
      .join('\n');

    body = `## Performance Comparison

> **Note:** Baseline metrics not found. Showing PR metrics only.

| Benchmark | PR |
|-----------|-----|
${rows}
`;
  }

  return { body, failedBenchmarks };
}

const DATA_REPO_BASE = 'https://raw.githubusercontent.com/mui/mui-x/test-results/benchmarks';

const COMMENT_MARKER = '## Performance Comparison';

interface GitHubComment {
  id: number;
  body: string;
  user: { type: string };
}

async function githubApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
}

async function postOrUpdateComment(prNumber: number, body: string): Promise<void> {
  const response = await githubApi(`/issues/${prNumber}/comments`);
  const comments = (await response.json()) as GitHubComment[];

  const existing = comments.find((c) => c.user.type === 'Bot' && c.body.includes(COMMENT_MARKER));

  if (existing) {
    await githubApi(`/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    });
  } else {
    await githubApi(`/issues/${prNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }
}

async function fetchMasterMetrics(baseSha?: string): Promise<Record<string, number>> {
  if (!baseSha) {
    return {};
  }

  const url = `${DATA_REPO_BASE}/commits/${baseSha}/results.json`;
  const response = await fetch(url);

  if (!response.ok) {
    return {};
  }

  const { benchmarks } = (await response.json()) as AggregatedResults;
  const metrics: Record<string, number> = {};
  for (const [name, benchmark] of Object.entries(benchmarks)) {
    metrics[name] = benchmark.duration;
  }
  return metrics;
}

async function main() {
  const benchmarksDir = process.env.BENCHMARKS_DIR || './benchmarks';
  const failThreshold = parseFloat(process.env.FAIL_THRESHOLD || '5');

  const resultsPath = path.join(benchmarksDir, 'results.json');
  const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as AggregatedResults;

  if (!results.pr) {
    throw new Error('results.json is missing the "pr" field — expected PR benchmark artifact');
  }

  const prMetricsByFile: Record<string, number> = {};
  for (const [name, benchmark] of Object.entries(results.benchmarks)) {
    prMetricsByFile[name] = benchmark.duration;
  }
  const masterMetricsByFile = await fetchMasterMetrics(results.pr.mergeBaseSha);
  const { body, failedBenchmarks } = generateComparisonBody(
    prMetricsByFile,
    masterMetricsByFile,
    failThreshold,
  );

  const dryRun = process.argv.includes('--dry-run');

  if (process.env.GITHUB_TOKEN && !dryRun) {
    await postOrUpdateComment(results.pr.number, body);
  } else {
    // eslint-disable-next-line no-console
    console.log(body);
  }

  if (failedBenchmarks.length > 0) {
    const names = failedBenchmarks.map((b) => b.name).join(', ');

    console.error(
      `Performance regression detected: ${names} exceeded the ${failThreshold}% threshold`,
    );
    process.exitCode = 1;
  }
}

main();
