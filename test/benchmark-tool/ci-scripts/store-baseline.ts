import { $ } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AggregatedResults } from './types';

const MAX_PUSH_RETRIES = 5;

async function checkoutDataBranch(dataRepoDir: string): Promise<void> {
  try {
    await $`git fetch origin test-results`;
  } catch {
    throw new Error(
      'Remote branch "test-results" not found. Create it with:\n' +
        '  git checkout --orphan test-results\n' +
        '  git rm -rf .\n' +
        '  git commit --allow-empty -m "Initialize test results branch"\n' +
        '  git push origin test-results',
    );
  }
  await $`git worktree add -B test-results ${dataRepoDir} origin/test-results`;
}

async function pushWithRetry(
  $data: typeof $,
  dryRunFlag: string[],
  maxRetries: number = MAX_PUSH_RETRIES,
): Promise<void> {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await $data`git push ${dryRunFlag} origin test-results`;
      return;
    } catch {
      // eslint-disable-next-line no-console
      console.error(`Push failed (attempt ${i}), pulling with rebase and retrying...`);
      await $data`git pull --rebase origin test-results`;
    }
  }
  throw new Error(`Failed to push after ${maxRetries} attempts`);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const benchmarksDir = process.env.BENCHMARKS_DIR || path.resolve(__dirname, '../benchmarks');
  const resultsPath = path.join(benchmarksDir, 'results.json');
  const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as AggregatedResults;
  const { commitSha, timestamp } = results;

  const dataRepoDir = path.resolve('data-repo');

  await checkoutDataBranch(dataRepoDir);

  // Get commit month
  const { stdout: month } = await $`git log -1 --format=%cd --date=format:%Y-%m ${commitSha}`;

  // Set up directory structure
  const commitsDir = path.join(dataRepoDir, 'benchmarks/commits', commitSha);
  const dataDir = path.join(commitsDir, 'data');
  await fs.mkdir(dataDir, { recursive: true });

  // Copy aggregated results
  await fs.copyFile(resultsPath, path.join(commitsDir, 'results.json'));

  // Write metadata
  await fs.writeFile(
    path.join(commitsDir, 'metadata.json'),
    JSON.stringify({ commit: commitSha, timestamp }),
  );

  // Copy raw benchmark data files
  const allFiles = await fs.readdir(benchmarksDir);
  await Promise.all(
    allFiles
      .filter((f) => f.endsWith('.json') && f !== 'results.json')
      .map((f) => fs.copyFile(path.join(benchmarksDir, f), path.join(dataDir, f))),
  );

  // Append to monthly JSONL
  const monthlyDir = path.join(dataRepoDir, 'benchmarks/monthly');
  await fs.mkdir(monthlyDir, { recursive: true });
  const jsonlEntry = JSON.stringify(results);
  await fs.appendFile(path.join(monthlyDir, `${month}.jsonl`), jsonlEntry + '\n');

  // Commit and push
  const $data = $({ cwd: dataRepoDir });
  await $data`git config user.name ${'github-actions[bot]'}`;
  await $data`git config user.email ${'github-actions[bot]@users.noreply.github.com'}`;
  const dryRunFlag = dryRun ? ['--dry-run'] : [];

  await $data`git add benchmarks/`;
  await $data`git commit ${dryRunFlag} -m ${`Add benchmarks for ${commitSha}`}`;

  await pushWithRetry($data, dryRunFlag);
}

main();
