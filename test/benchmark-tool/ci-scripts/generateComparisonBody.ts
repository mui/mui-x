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

function formatMs(ms: number): string {
  return `${ms.toFixed(2)} ms`;
}

export function generateComparisonBody(
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
