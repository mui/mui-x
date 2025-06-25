// @ts-check
import fs from 'node:fs/promises';
// eslint-disable-next-line import/extensions
import { compareResults } from './compare-benchmark-results.js';

const COMMENT_MARKER = '<!-- performance-test-results -->';

/** @param {any} AsyncFunctionArguments */
export default async function ciBenchmark({ github, context, core }) {
  try {
    const { BASELINE_PATH: baselinePath, COMPARE_PATH: comparePath } =
      /** @type {any} */ process.env;
    const threshold = Number.parseFloat(/** @type {any} */ process.env.THRESHOLD);

    core.info(
      `Running performance benchmarks.\nBaseline Path: ${baselinePath}\nCompare Path: ${
        comparePath
      }\nThreshold: ${threshold}`,
    );

    if (!baselinePath || !comparePath) {
      core.setFailed('Missing required environment variables: BASELINE_PATH, COMPARE_PATH');
      return;
    }

    if (!Number.isFinite(threshold) || threshold < 0) {
      core.setFailed('Invalid THRESHOLD value. It must be a non-negative number.');
      return;
    }

    let /** @type {string} */ compareJson;
    try {
      compareJson = await readCompareJson(comparePath);
    } catch (/** @type {any} */ error) {
      core.setFailed(`Error reading compare file: ${error.message}`);
      return;
    }

    const baselineJson = await readBaselineJson(baselinePath);

    const { results, markdown } = await compareResults(baselineJson, compareJson, threshold);

    if (results.failed.length > 0) {
      core.setFailed('Some benchmarks failed.');
    } else if (results.regressed.length > 0) {
      core.setFailed('Some benchmarks regressed above threshold.');
    }

    const result = results.failed.length > 0 || results.regressed.length > 0 ? 'fail' : 'pass';

    const body = `${COMMENT_MARKER}

## 📊 Performance Test Results

**Commit:** [${context.sha}](${context.payload.repository.html_url}/commit/${context.sha})
**Run:** [${context.runId}](${context.payload.repository.html_url}/actions/runs/${context.runId})
**Baseline:** ${baselineJson ? `[${baselineJson.commit}](${context.payload.repository.html_url}/commit/${baselineJson.commit})` : 'No baseline found'}

**Result**: ${result === 'pass' ? 'Pass ✅' : 'Fail ❌'}
${result === 'pass' ? 'No significant changes detected.' : 'To acknowledge these changes, merge this PR.'}


${markdown}`;

    const comments = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    });

    const existingComment = comments.data.find((/** @type {{ body: string }} */ comment) =>
      comment.body.includes(COMMENT_MARKER),
    );

    if (existingComment) {
      await github.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: existingComment.id,
        body,
      });
    } else {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body,
      });
    }
  } catch (/** @type {any} */ error) {
    console.error(error);
    core.setFailed(`Error running performance benchmarks: ${error.message}`);
  }
}

/**
 * @param {string} path
 * @returns {Promise<any | null>}
 */
async function readBaselineJson(path) {
  try {
    const baselineBuffer = await fs.readFile(path);

    const json = JSON.parse(baselineBuffer.toString('utf-8'));
    console.log('Baseline file read successfully:', path);

    return json;
  } catch (error) {
    console.log('Could not read baseline file:', error);
    return null;
  }
}

/**
 * @param {string} path
 * @returns {Promise<any>}
 */
async function readCompareJson(path) {
  try {
    const compareBuffer = await fs.readFile(path);

    const json = JSON.parse(compareBuffer.toString('utf-8'));
    console.log('Compare file read successfully:', path);

    return json;
  } catch (error) {
    console.error(`Aborting comparison because compare file could not be read:`, error);
    throw new Error('Compare file read error');
  }
}
