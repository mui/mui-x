import { $ } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cyan, dim, fileUrl, green } from '../utils/log';
import type { AggregatedResults } from './types';

const MAX_PUSH_RETRIES = 5;

async function checkoutDataBranch(dataRepoDir: string): Promise<void> {
  // Remove leftover worktree from a previous run
  await $({ stdio: 'inherit', reject: false })`git worktree remove --force ${dataRepoDir}`;

  try {
    // eslint-disable-next-line no-console
    console.log(cyan('Fetching origin/test-results...'));
    await $({ stdio: 'inherit' })`git fetch origin test-results`;
  } catch {
    throw new Error(
      'Remote branch "test-results" not found. Create it with:\n' +
        '  git checkout --orphan test-results\n' +
        '  git rm -rf .\n' +
        '  git commit --allow-empty -m "Initialize test results branch"\n' +
        '  git push origin test-results',
    );
  }
  // eslint-disable-next-line no-console
  console.log(cyan(`Creating worktree at ${dim(fileUrl(dataRepoDir))}...`));
  await $({
    stdio: 'inherit',
  })`git worktree add -B test-results ${dataRepoDir} origin/test-results`;
}

async function pushWithRetry(
  $data: typeof $,
  dryRunFlag: string[],
  maxRetries: number = MAX_PUSH_RETRIES,
): Promise<void> {
  for (let i = 1; i <= maxRetries; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await $data({ stdio: 'inherit' })`git push ${dryRunFlag} origin test-results`;
      return;
    } catch {
      console.error(`Push failed (attempt ${i}), pulling with rebase and retrying...`);
      // eslint-disable-next-line no-await-in-loop
      await $data({ stdio: 'inherit' })`git pull --rebase origin test-results`;
    }
  }
  throw new Error(`Failed to push after ${maxRetries} attempts`);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  // eslint-disable-next-line no-console
  console.log(`store-baseline: dryRun=${dryRun}`);

  const benchmarksDir = process.env.BENCHMARKS_DIR || path.resolve(__dirname, '../benchmarks');
  const resultsPath = path.join(benchmarksDir, 'results.json');
  // eslint-disable-next-line no-console
  console.log(cyan(`Reading results from ${dim(fileUrl(resultsPath))}`));
  const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as AggregatedResults;
  const { commitSha, timestamp } = results;

  if (!commitSha) {
    throw new Error('commitSha is missing from results.json');
  }
  // eslint-disable-next-line no-console
  console.log(`commitSha=${dim(commitSha)}, timestamp=${dim(String(timestamp))}`);

  const dataRepoDir = path.resolve('data-repo');

  try {
    await checkoutDataBranch(dataRepoDir);

    // Get commit month
    const { stdout: month } = await $`git log -1 --format=%cd --date=format:%Y-%m ${commitSha}`;
    // eslint-disable-next-line no-console
    console.log(`Commit month: ${dim(month)}`);

    // Set up directory structure
    const commitsDir = path.join(dataRepoDir, 'benchmarks/commits', commitSha);
    await fs.mkdir(commitsDir, { recursive: true });

    // Copy aggregated results
    // eslint-disable-next-line no-console
    console.log(cyan(`Copying results to ${dim(fileUrl(path.join(commitsDir, 'results.json')))}`));
    await fs.copyFile(resultsPath, path.join(commitsDir, 'results.json'));

    // Append to monthly JSONL
    const monthlyDir = path.join(dataRepoDir, 'benchmarks/monthly');
    await fs.mkdir(monthlyDir, { recursive: true });
    const jsonlEntry = JSON.stringify(results);
    // eslint-disable-next-line no-console
    console.log(cyan(`Appending to ${dim(fileUrl(path.join(monthlyDir, `${month}.jsonl`)))}`));
    await fs.appendFile(path.join(monthlyDir, `${month}.jsonl`), `${jsonlEntry}\n`);

    // Commit and push
    const $data = $({ cwd: dataRepoDir });
    await $data`git config user.name ${'github-actions[bot]'}`;
    await $data`git config user.email ${'github-actions[bot]@users.noreply.github.com'}`;
    const dryRunFlag = dryRun ? ['--dry-run'] : [];

    // eslint-disable-next-line no-console
    console.log(cyan('Staging benchmarks/...'));
    await $data({ stdio: 'inherit' })`git add benchmarks/`;
    // eslint-disable-next-line no-console
    console.log(cyan('Committing...'));
    await $data({
      stdio: 'inherit',
    })`git commit ${dryRunFlag} -m ${`Add benchmarks for ${commitSha}`}`;

    // eslint-disable-next-line no-console
    console.log(cyan('Pushing...'));
    await pushWithRetry($data, dryRunFlag);
    // eslint-disable-next-line no-console
    console.log(green('Done.'));
  } finally {
    // eslint-disable-next-line no-console
    console.log(cyan('Cleaning up worktree...'));
    await $({ stdio: 'inherit', reject: false })`git worktree remove --force ${dataRepoDir}`;
  }
}

main();
