import type { CorrelationResult } from './types';

/**
 * Buckets the absolute correlation coefficient into a strength label.
 *
 * @param absR The absolute value of the Pearson coefficient.
 * @returns The strength bucket for the coefficient.
 */
function strengthOf(absR: number): CorrelationResult['strength'] {
  if (absR >= 0.7) {
    return 'strong';
  }
  if (absR >= 0.4) {
    return 'moderate';
  }
  if (absR >= 0.2) {
    return 'weak';
  }
  return 'none';
}

/**
 * Computes the Pearson correlation coefficient over index-aligned non-null pairs.
 *
 * Indices where either value is null or non-finite are dropped. When fewer than
 * two pairs remain, or when either series is constant over the shared indices
 * (zero variance), the coefficient is `0` to avoid dividing by zero.
 *
 * @param a The first series values.
 * @param b The second series values.
 * @returns The Pearson coefficient in the range [-1, 1].
 */
function pearson(a: (number | null)[], b: (number | null)[]): number {
  const xs: number[] = [];
  const ys: number[] = [];
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) {
    const x = a[i];
    const y = b[i];
    if (x != null && y != null && Number.isFinite(x) && Number.isFinite(y)) {
      xs.push(x);
      ys.push(y);
    }
  }

  const n = xs.length;
  if (n < 2) {
    return 0;
  }

  let meanX = 0;
  let meanY = 0;
  for (let i = 0; i < n; i += 1) {
    meanX += xs[i];
    meanY += ys[i];
  }
  meanX /= n;
  meanY /= n;

  let cov = 0;
  let varX = 0;
  let varY = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    cov += dx * dy;
    varX += dx * dx;
    varY += dy * dy;
  }

  const denom = Math.sqrt(varX * varY);
  if (denom === 0) {
    return 0;
  }

  const r = cov / denom;
  // Clamp to guard against floating-point drift just outside [-1, 1].
  if (r > 1) {
    return 1;
  }
  if (r < -1) {
    return -1;
  }
  return r;
}

/**
 * Computes the pairwise Pearson correlation across every distinct series pair.
 *
 * Each pair uses only the indices where both series have a non-null, finite
 * value. The strength bucket is `|r| >= 0.7` strong, `>= 0.4` moderate,
 * `>= 0.2` weak, otherwise none; the direction is positive when `r >= 0`
 * and negative otherwise.
 *
 * @param series A map of series label to series values.
 * @returns One result per distinct unordered pair of series.
 */
export function computeCorrelations(
  series: Record<string, (number | null)[]>,
): CorrelationResult[] {
  const labels = Object.keys(series);
  const results: CorrelationResult[] = [];

  for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      const a = labels[i];
      const b = labels[j];
      const r = pearson(series[a], series[b]);
      results.push({
        a,
        b,
        r,
        strength: strengthOf(Math.abs(r)),
        direction: r >= 0 ? 'positive' : 'negative',
      });
    }
  }

  return results;
}
