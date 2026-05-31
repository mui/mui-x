import type { SummaryStats } from './types';

/**
 * Computes descriptive statistics for a single numeric series.
 *
 * Null entries are ignored. The standard deviation is the population stdDev
 * and the median is taken from the sorted middle. `changePct` is the
 * percentage change from the first non-null value to the last non-null value.
 *
 * When the series has no numeric values, every field is `0` (NaN-safe).
 *
 * @param values The series values; nulls are ignored.
 * @returns The descriptive statistics for the series.
 */
export function computeSummaryStats(values: (number | null)[]): SummaryStats {
  const nums: number[] = [];
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v != null && Number.isFinite(v)) {
      nums.push(v);
    }
  }

  const points = nums.length;

  if (points === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      range: 0,
      total: 0,
      points: 0,
      changePct: 0,
    };
  }

  let min = nums[0];
  let max = nums[0];
  let total = 0;
  for (let i = 0; i < points; i += 1) {
    const v = nums[i];
    if (v < min) {
      min = v;
    }
    if (v > max) {
      max = v;
    }
    total += v;
  }

  const mean = total / points;

  const sorted = nums.slice().sort((a, b) => a - b);
  const mid = Math.floor(points / 2);
  const median = points % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  let variance = 0;
  for (let i = 0; i < points; i += 1) {
    const diff = nums[i] - mean;
    variance += diff * diff;
  }
  variance /= points;
  const stdDev = Math.sqrt(variance);

  const first = nums[0];
  const last = nums[points - 1];
  const changePct = first === 0 ? 0 : ((last - first) / Math.abs(first)) * 100;

  return {
    min,
    max,
    mean,
    median,
    stdDev,
    range: max - min,
    total,
    points,
    changePct,
  };
}
