/**
 * Derived overlay series — a fitted trend line and a running cumulative total.
 * Both return an array aligned 1:1 with the input indices (so they plot on the
 * same x-axis as the source series) and are NaN/null-safe.
 */

/**
 * Fits a least-squares line over the non-null points and evaluates it at every
 * index, returning the in-range trend line. Useful as a "trend" overlay.
 *
 * With fewer than two numeric points no line can be fit, so every position is
 * `null`.
 *
 * @param values The series values; nulls are ignored when fitting.
 * @returns The fitted value at each index, or all-null when undefined.
 */
export function computeTrend(values: (number | null)[]): (number | null)[] {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v != null && Number.isFinite(v)) {
      xs.push(i);
      ys.push(v);
    }
  }

  const n = xs.length;
  if (n < 2) {
    return values.map(() => null);
  }

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i += 1) {
    sumX += xs[i];
    sumY += ys[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i] - meanX;
    sxx += dx * dx;
    sxy += dx * (ys[i] - meanY);
  }

  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = meanY - slope * meanX;

  return values.map((_value, index) => slope * index + intercept);
}

/**
 * Running cumulative total. Null entries contribute nothing but the running
 * total carries forward; positions before the first numeric value are `null`.
 *
 * @param values The series values; nulls add nothing.
 * @returns The cumulative total at each index.
 */
export function computeCumulative(values: (number | null)[]): (number | null)[] {
  let total = 0;
  let seen = false;
  return values.map((value) => {
    if (value != null && Number.isFinite(value)) {
      total += value;
      seen = true;
    }
    return seen ? total : null;
  });
}
