import type { Anomaly } from './types';

/** Default multiple of the mean absolute step delta above which a point is flagged. */
const DEFAULT_THRESHOLD = 3;

/**
 * Detects anomalous points in a single numeric series using the rate-of-change method.
 *
 * Step deltas are computed between consecutive non-null, finite points. A point
 * is flagged when the magnitude of its delta is at least `threshold` times the
 * mean absolute delta across the series. The reported `ratio` is
 * `|delta| / mean(|delta|)` (for example "12.2x the average change"), `kind` is
 * `drop` for a negative delta and `spike` for a positive one, and `index` /
 * `value` refer to the flagged point itself (not the previous one).
 *
 * Nulls and non-finite values are skipped; the delta is taken against the most
 * recent preceding finite value. When the series has fewer than two finite
 * points, or every step delta is zero (a flat or constant series), no anomalies
 * are returned. The `seriesId` field is left empty; callers that analyse a named
 * series should populate it from their own context.
 *
 * @param values The series values; nulls and non-finite values are ignored.
 * @param opts Optional configuration.
 * @param opts.threshold Multiple of the mean absolute delta above which a point is flagged (default 3).
 * @returns The flagged anomalies, in ascending index order.
 */
export function detectAnomalies(
  values: (number | null)[],
  opts?: { threshold?: number },
): Anomaly[] {
  const threshold = opts?.threshold ?? DEFAULT_THRESHOLD;

  // Collect step deltas against the most recent preceding finite value.
  const steps: { index: number; value: number; delta: number }[] = [];
  let prev: number | null = null;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v == null || !Number.isFinite(v)) {
      continue;
    }
    if (prev != null) {
      steps.push({ index: i, value: v, delta: v - prev });
    }
    prev = v;
  }

  if (steps.length === 0) {
    return [];
  }

  let sumAbs = 0;
  for (let i = 0; i < steps.length; i += 1) {
    sumAbs += Math.abs(steps[i].delta);
  }
  const meanAbsDelta = sumAbs / steps.length;

  // A flat or constant series has no meaningful rate of change.
  if (meanAbsDelta === 0) {
    return [];
  }

  const anomalies: Anomaly[] = [];
  for (let i = 0; i < steps.length; i += 1) {
    const { index, value, delta } = steps[i];
    const ratio = Math.abs(delta) / meanAbsDelta;
    if (ratio >= threshold) {
      anomalies.push({
        seriesId: '',
        index,
        value,
        delta,
        ratio,
        kind: delta < 0 ? 'drop' : 'spike',
      });
    }
  }

  return anomalies;
}
