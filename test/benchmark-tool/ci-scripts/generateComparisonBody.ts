import type { ComparisonResult, FailedBenchmark } from './types';

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

function formatMs(microseconds: number): string {
  const ms = microseconds / 1000;
  return `${ms.toFixed(2)} ms`;
}

export function generateComparisonBody(
  prMetricsByFile: Record<string, number>,
  masterMetricsByFile: Record<string, number>,
  failThreshold: number,
): ComparisonResult {
  const allFiles = [
    ...new Set([...Object.keys(prMetricsByFile), ...Object.keys(masterMetricsByFile)]),
  ].sort();
  const hasMasterMetrics = Object.keys(masterMetricsByFile).length > 0;
  const failedBenchmarks: FailedBenchmark[] = [];

  let body: string;

  if (hasMasterMetrics) {
    const fileRows = allFiles
      .map((file) => {
        const prDuration = prMetricsByFile[file] || 0;
        const masterDuration = masterMetricsByFile[file] || 0;
        const diff = prDuration - masterDuration;
        const diffPercent = calculateDiffPercent(diff, masterDuration, prDuration);
        const emoji = getEmoji(diffPercent.num, failThreshold);
        const benchmarkName = file.replace('.json', '');

        if (diffPercent.num > failThreshold) {
          failedBenchmarks.push({ name: benchmarkName, diff: diffPercent.str });
        }

        const diffMs = diff / 1000;
        return `| ${benchmarkName} | ${formatMs(masterDuration)} | ${formatMs(prDuration)} | ${emoji} ${diffMs > 0 ? '+' : ''}${diffMs.toFixed(2)} ms (${diffPercent.str}%) |`;
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
${fileRows}
`;
  } else {
    const fileRows = allFiles
      .map((file) => {
        const prDuration = prMetricsByFile[file] || 0;
        const benchmarkName = file.replace('.json', '');
        return `| ${benchmarkName} | ${formatMs(prDuration)} |`;
      })
      .join('\n');

    body = `## Performance Comparison

> **Note:** Baseline metrics not found. Showing PR metrics only.

| Benchmark | PR |
|-----------|-----|
${fileRows}
`;
  }

  return { body, failedBenchmarks };
}
