import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchMasterMetrics } from './fetchMasterMetrics';
import { generateComparisonBody } from './generateComparisonBody';
import { readPrMetrics } from './readPrMetrics';
import type { AggregatedResults } from './types';

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

async function main() {
  const benchmarksDir = process.env.BENCHMARKS_DIR || './benchmarks';
  const failThreshold = parseFloat(process.env.FAIL_THRESHOLD || '5');

  const resultsPath = path.join(benchmarksDir, 'results.json');
  const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as AggregatedResults;

  if (!results.pr) {
    throw new Error('results.json is missing the "pr" field — expected PR benchmark artifact');
  }

  const prMetricsByFile = await readPrMetrics(benchmarksDir);
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
    // eslint-disable-next-line no-console
    console.error(
      `Performance regression detected: ${names} exceeded the ${failThreshold}% threshold`,
    );
    process.exitCode = 1;
  }
}

main();
