import fs from 'node:fs/promises';
import path from 'node:path';
import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import { cyan, dim, fileUrl, green, indent, red } from '../utils/log';
import type { AggregatedResults, ComparisonResult, FailedBenchmark } from './types';

// @ts-ignore
const MyOctokit = Octokit.plugin(retry);

function calculateDiffPercent(diff: number, masterDuration: number, prDuration: number): number {
  if (masterDuration > 0) {
    return (diff / masterDuration) * 100;
  }
  if (prDuration > 0) {
    return NaN; // new benchmark, no baseline to compare against
  }
  return 0;
}

function getEmoji(diffPercent: number, failThreshold: number): string {
  if (Number.isNaN(diffPercent)) {
    return '🆕';
  }
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
        const emoji = getEmoji(diffPercent, failThreshold);

        if (!Number.isNaN(diffPercent) && diffPercent > failThreshold) {
          failedBenchmarks.push({ name, diff: diffPercent.toFixed(2) });
        }

        const diffStr = Number.isNaN(diffPercent)
          ? 'N/A'
          : `${diff > 0 ? '+' : ''}${diff.toFixed(2)} ms (${diffPercent.toFixed(2)}%)`;
        return `| ${name} | ${formatMs(masterDuration)} | ${formatMs(prDuration)} | ${emoji} ${diffStr} |`;
      })
      .join('\n');

    let statusSection = '';
    if (failedBenchmarks.length > 0) {
      statusSection = `
> [!WARNING]
> **Performance regression detected!** The following benchmarks exceed the ${failThreshold}% threshold:
> ${failedBenchmarks.map((b) => `\`${b.name}\` (+${b.diff}%)`).join(', ')}

`;
    }

    body = `## Performance Comparison
${statusSection}
| Benchmark | Master | PR | Diff |
|-----------|--------|-----|------|
${rows}

Fail threshold: **${failThreshold}%**
`;
  } else {
    const rows = allBenchmarks
      .map((name) => {
        const prDuration = prMetrics[name] || 0;
        return `| ${name} | ${formatMs(prDuration)} |`;
      })
      .join('\n');

    body = `## Performance Comparison

> [!NOTE]
> Baseline metrics not found. Showing PR metrics only.

| Benchmark | PR |
|-----------|-----|
${rows}
`;
  }

  return { body, failedBenchmarks };
}

const DATA_REPO_BASE = 'https://raw.githubusercontent.com/mui/mui-x/test-results/benchmarks';

const COMMENT_MARKER = '## Performance Comparison';

async function postOrUpdateComment(prNumber: number, body: string): Promise<void> {
  const octokit = new MyOctokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');

  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  const existing = comments.find((c) => c.user?.type === 'Bot' && c.body?.includes(COMMENT_MARKER));

  if (existing) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
  } else {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body,
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

  const resultsPath = path.resolve(benchmarksDir, 'results.json');
  // eslint-disable-next-line no-console
  console.log(cyan(`Reading results from ${dim(fileUrl(resultsPath))}`));
  const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as AggregatedResults;

  const prNumber = process.env.PR_NUMBER ? parseInt(process.env.PR_NUMBER, 10) : undefined;
  const mergeBaseSha = process.env.MERGE_BASE_SHA || undefined;

  if (!prNumber) {
    throw new Error('PR_NUMBER environment variable is required');
  }

  // eslint-disable-next-line no-console
  console.log(`PR #${dim(String(prNumber))}, mergeBase=${dim(mergeBaseSha ?? 'unknown')}`);

  const prMetricsByFile: Record<string, number> = {};
  for (const [name, benchmark] of Object.entries(results.benchmarks)) {
    prMetricsByFile[name] = benchmark.duration;
  }
  // eslint-disable-next-line no-console
  console.log(cyan('Fetching master metrics...'));
  const masterMetricsByFile = await fetchMasterMetrics(mergeBaseSha);
  const { body, failedBenchmarks } = generateComparisonBody(
    prMetricsByFile,
    masterMetricsByFile,
    failThreshold,
  );

  const dryRun = process.argv.includes('--dry-run');

  // eslint-disable-next-line no-console
  console.log(cyan('PR comment body:'));
  // eslint-disable-next-line no-console
  console.log(dim(indent(body, 4)));

  if (process.env.GITHUB_TOKEN && !dryRun) {
    // eslint-disable-next-line no-console
    console.log(cyan('Posting comment to PR...'));
    await postOrUpdateComment(prNumber, body);
  } else {
    // eslint-disable-next-line no-console
    console.log(dim('Skipping post (dry-run or no GITHUB_TOKEN).'));
  }

  if (failedBenchmarks.length > 0) {
    const names = failedBenchmarks.map((b) => b.name).join(', ');

    console.error(
      red(`Performance regression detected: ${names} exceeded the ${failThreshold}% threshold`),
    );
    process.exitCode = 1;
  }

  // eslint-disable-next-line no-console
  console.log(green('Done.'));
}

main();
