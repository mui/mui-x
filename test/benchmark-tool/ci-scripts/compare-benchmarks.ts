import fs from 'node:fs/promises';
import { fetchMasterMetrics } from './fetchMasterMetrics';
import { generateComparisonBody } from './generateComparisonBody';
import { readPrMetrics } from './readPrMetrics';

async function main() {
  const benchmarksDir = process.env.BENCHMARKS_DIR || './benchmarks';
  const outputFile = process.env.OUTPUT_FILE || './comparison-result.json';
  const failThreshold = parseFloat(process.env.FAIL_THRESHOLD || '5');

  const prMetricsByFile = await readPrMetrics(benchmarksDir);
  const masterMetricsByFile = await fetchMasterMetrics();
  const { body, failedBenchmarks } = generateComparisonBody(
    prMetricsByFile,
    masterMetricsByFile,
    failThreshold,
  );

  const output = {
    body,
    failedBenchmarks,
    shouldFail: failedBenchmarks.length > 0,
    failMessage:
      failedBenchmarks.length > 0
        ? `Performance regression detected: ${failedBenchmarks.map((b) => b.name).join(', ')} exceeded the ${failThreshold}% threshold`
        : null,
  };

  await fs.writeFile(outputFile, JSON.stringify(output, null, 2));
}

main();
