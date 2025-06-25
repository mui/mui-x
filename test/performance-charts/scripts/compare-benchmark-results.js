// @ts-check
/* eslint-disable no-console */
import util from 'node:util';

/**
 * @param {any} data
 * @returns {Array<import('./compare-benchmark-results.types.js').BenchmarkResult>}
 */
function parseBenchmarkResults(data) {
  const benchmarks = data.files
    ?.flatMap((/** @type {{ groups: any[]; }} */ file) =>
      file?.groups?.flatMap((g) => g?.benchmarks),
    )
    .filter(
      (
        /** @type {import('./compare-benchmark-results.types.js').BenchmarkResult | undefined} */ bench,
      ) => bench !== undefined,
    );

  return benchmarks;
}

/**
 *
 * @param {Array<import('./compare-benchmark-results.types.js').BenchmarkResult>} compareBenchmarks
 * @param {Array<import('./compare-benchmark-results.types.js').BenchmarkResult> | null} baselineBenchmarks
 * @param {number} threshold
 * @returns {import('./compare-benchmark-results.types.js').BenchmarkResults}
 */
function processResults(compareBenchmarks, baselineBenchmarks, threshold) {
  const added = [];
  const removed = [];
  const unchanged = [];
  const regressed = [];
  const improved = [];
  /** @type {Array<import('./compare-benchmark-results.types.js').FailedBenchmarkResult>} */
  const failed = [];

  const compareMap = new Map(compareBenchmarks.map((b) => [b.name, b]));
  const baselineMap = new Map(baselineBenchmarks?.map((b) => [b.name, b]) ?? []);

  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  for (const [_, baselineBench] of baselineMap) {
    const compareBench = compareMap.get(baselineBench.name);

    if (!compareBench) {
      removed.push(baselineBench);
    } else if ('min' in compareBench) {
      const diff = (compareBench.min - baselineBench.min) / baselineBench.min;
      const benchmark = {
        name: baselineBench.name,
        baseline: baselineBench,
        compare: compareBench,
        diff,
      };

      if (diff > threshold) {
        regressed.push(benchmark);
      } else if (diff < -threshold) {
        improved.push(benchmark);
      } else {
        unchanged.push(benchmark);
      }

      compareMap.delete(baselineBench.name);
    } else {
      failed.push(compareBench);
      compareMap.delete(baselineBench.name);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  for (const [_, compareBench] of compareMap) {
    if ('median' in compareBench) {
      added.push(compareBench);
    } else {
      failed.push(compareBench);
    }
  }

  return {
    added,
    removed,
    regressed,
    improved,
    unchanged,
    failed,
  };
}

/**
 * @param {import('./compare-benchmark-results.types.js').BenchmarkResults} results
 */
function printResults(results) {
  console.log(
    `Overall result: ${results.failed.length > 0 || results.regressed.length > 0 ? 'fail' : 'pass'}`,
  );

  console.log(`Regressed benchmarks: ${results.regressed.length}`);
  if (results.regressed.length > 0) {
    const changedTable = results.regressed.map((c) => ({
      name: c.name,
      minBaseline: c.baseline.min.toFixed(2),
      minCompare: c.compare.min.toFixed(2),
      diff: `${(c.diff * 100).toFixed(2)}%`,
      sampleCount: c.compare.sampleCount,
      mean: c.compare.mean.toFixed(2),
      median: c.compare.median.toFixed(2),
      p75: c.compare.p75.toFixed(2),
      p99: c.compare.p99.toFixed(2),
      marginOfError: c.compare.moe.toFixed(2),
    }));
    console.table(changedTable);
  }

  console.log(`Improved benchmarks: ${results.improved.length}`);
  if (results.improved.length > 0) {
    const changedTable = results.improved.map((c) => ({
      name: c.name,
      minBaseline: c.baseline.min.toFixed(2),
      minCompare: c.compare.min.toFixed(2),
      diff: `${(c.diff * 100).toFixed(2)}%`,
      sampleCount: c.compare.sampleCount,
      mean: c.compare.mean.toFixed(2),
      median: c.compare.median.toFixed(2),
      p75: c.compare.p75.toFixed(2),
      p99: c.compare.p99.toFixed(2),
      marginOfError: c.compare.moe.toFixed(2),
    }));
    console.table(changedTable);
  }

  console.log(`Unchanged benchmarks: ${results.unchanged.length}`);
  if (results.unchanged.length > 0) {
    const unchangedTable = results.unchanged.map((c) => ({
      name: c.name,
      minBaseline: c.baseline.min.toFixed(2),
      minCompare: c.compare.min.toFixed(2),
      diff: `${(c.diff * 100).toFixed(2)}%`,
      sampleCount: c.compare.sampleCount,
      mean: c.compare.mean.toFixed(2),
      median: c.compare.median.toFixed(2),
      p75: c.compare.p75.toFixed(2),
      p99: c.compare.p99.toFixed(2),
      marginOfError: c.compare.moe.toFixed(2),
    }));
    console.table(unchangedTable);
  }

  console.log(`Added benchmarks: ${results.added.length}`);
  results.added.forEach((b) => console.log(`- ${b.name}`));
  if (results.added.length > 0) {
    const addedTable = results.added.map((c) => ({
      name: c.name,
      min: c.min.toFixed(2),
      sampleCount: c.sampleCount,
      mean: c.mean.toFixed(2),
      median: c.median.toFixed(2),
      p75: c.p75.toFixed(2),
      p99: c.p99.toFixed(2),
      marginOfError: c.moe.toFixed(2),
    }));
    console.table(addedTable);
  }

  console.log(`Removed benchmarks: ${results.removed.length}`);
  results.removed.forEach((b) => console.log(`- ${b.name}`));

  console.log(`Failed benchmarks: ${results.failed.length}`);
  results.failed.forEach((b) => console.log(`- ${b.name}`));
}

/**
 * @param {import('./compare-benchmark-results.types.js').BenchmarkResults} results
 */
function generateResultMarkdown(results) {
  let markdown = '';

  const fMs = (/** @type {number} */ number) => `${number.toFixed(2)}ms`;
  const fPerc = (/** @type {number} */ number) => `${number.toFixed(2)}%`;

  if (results.regressed.length > 0) {
    markdown += `\n**Regressed benchmarks**: ${results.regressed.length}\n`;

    markdown += `| Name | Min (Baseline) | Min (This run) | Diff | Sample Count | Margin of Error |\n`;
    markdown += `| ---- | -------------- | -------------- | ---- | ------------ | --------------- |\n`;

    results.regressed.forEach((r) => {
      markdown += `| ${r.name} | ${fMs(r.baseline.min)} | ${fMs(r.compare.min)} | ${fPerc(r.diff * 100)} | ${r.compare.sampleCount} | ${fPerc(r.compare.moe)} |\n`;
    });

    markdown += `<details>\n`;
    markdown += `<summary>Detailed Results</summary>\n\n`;
    markdown += `| Name | Min (Baseline) | Min (This run) | Diff | Sample Count | Mean | Median | P75 | P99 | Max | Margin of Error |\n`;
    markdown += `| ---- | -------------- | -------------- | ---- | ------------ | ---- | ------ | --- | --- | --- | --------------- |\n`;

    results.regressed.forEach((r) => {
      markdown += `| ${r.name} | ${fMs(r.baseline.min)} | ${fMs(r.compare.min)} | ${fPerc(r.diff * 100)} | ${r.compare.sampleCount} | ${fMs(r.compare.mean)} | ${fMs(r.compare.median)} | ${fMs(r.compare.p75)} | ${fMs(r.compare.p99)} | ${fMs(r.compare.max)} | ${fPerc(r.compare.moe)} |\n`;
    });

    markdown += `</details>\n`;
  }

  if (results.improved.length > 0) {
    markdown += `\n**Improved benchmarks**: ${results.improved.length}\n`;

    markdown += `| Name | Min (Baseline) | Min (This run) | Diff | Sample Count | Margin of Error |\n`;
    markdown += `| ---- | -------------- | -------------- | ---- | ------------ | --------------- |\n`;

    results.improved.forEach((r) => {
      markdown += `| ${r.name} | ${fMs(r.baseline.min)} | ${fMs(r.compare.min)} | ${fPerc(r.diff * 100)} | ${r.compare.sampleCount} | ${fPerc(r.compare.moe)} |\n`;
    });

    markdown += `<details>\n`;
    markdown += `<summary>Detailed Results</summary>\n\n`;
    markdown += `| Name | Min (Baseline) | Min (This run) | Diff | Sample Count | Mean | Median | P75 | P99 | Max | Margin of Error |\n`;
    markdown += `| ---- | -------------- | -------------- | ---- | ------------ | ---- | ------ | --- | --- | --- | --------------- |\n`;

    results.improved.forEach((r) => {
      markdown += `| ${r.name} | ${fMs(r.baseline.min)} | ${fMs(r.compare.min)} | ${fPerc(r.diff * 100)} | ${r.compare.sampleCount} | ${fMs(r.compare.mean)} | ${fMs(r.compare.median)} | ${fMs(r.compare.p75)} | ${fMs(r.compare.p99)} | ${fMs(r.compare.max)} | ${fPerc(r.compare.moe)} |\n`;
    });

    markdown += `</details>\n`;
  }

  if (results.unchanged.length > 0) {
    markdown += `\n**Unchanged benchmarks**: ${results.unchanged.length}\n`;

    markdown += `<details>\n`;
    markdown += `<summary>Detailed Results</summary>\n\n`;

    markdown += `| Name | Min (Baseline) | Min (This run) | Diff | Sample Count | Mean | Median | P75 | P99 | Max | Margin of Error |\n`;
    markdown += `| ---- | -------------- | -------------- | ---- | ------------ | ---- | ------ | --- | --- | --- | --------------- |\n`;

    results.unchanged.forEach((r) => {
      markdown += `| ${r.name} | ${fMs(r.baseline.min)} | ${fMs(r.compare.min)} | ${fPerc(r.diff * 100)} | ${r.compare.sampleCount} | ${fMs(r.compare.mean)} | ${fMs(r.compare.median)} | ${fMs(r.compare.p75)} | ${fMs(r.compare.p99)} | ${fMs(r.compare.max)} | ${fPerc(r.compare.moe)} |\n`;
    });

    markdown += `</details>\n`;
  }

  if (results.added.length > 0) {
    markdown += `\n**Added benchmarks**: ${results.added.length}\n`;
    markdown += `| Name | Min | Sample Count | Mean | Median | P75 | P99 | Max | Margin of Error |\n`;
    markdown += `| ---- | --- | ------------ | ---- | ------ | --- | --- | --- | --------------- |\n`;

    results.added.forEach((r) => {
      markdown += `| ${r.name} | ${fMs(r.min)} | ${r.sampleCount} | ${fMs(r.mean)} | ${fMs(r.median)} | ${fMs(r.p75)} | ${fMs(r.p99)} | ${fMs(r.max)} | ${fPerc(r.moe)} |\n`;
    });
  }

  if (results.removed.length > 0) {
    markdown += `\n**Removed benchmarks**: ${results.removed.length}\n`;
    results.removed.forEach((r) => {
      markdown += `- ${r.name}\n`;
    });
  }

  if (results.failed.length > 0) {
    markdown += `\n**Failed benchmarks**: ${results.failed.length}\n`;
    results.failed.forEach((r) => {
      markdown += `- ${r.name}\n`;
    });
  }

  return markdown;
}

/**
 * @param {string | null} baselineJson
 * @param {string} compareJson
 * @param {number} threshold
 * @returns {Promise<{ results: import('./compare-benchmark-results.types.js').BenchmarkResults, markdown: string }>}
 */
export async function compareResults(baselineJson, compareJson, threshold) {
  const compareBenchmarks = parseBenchmarkResults(compareJson);
  const baselineBenchmarks = baselineJson ? parseBenchmarkResults(baselineJson) : null;

  const results = processResults(compareBenchmarks, baselineBenchmarks, threshold);

  try {
    printResults(results);
  } catch (error) {
    console.error(error);
    console.log(util.inspect(results, { depth: null }));
  }

  return { results, markdown: generateResultMarkdown(results) };
}
