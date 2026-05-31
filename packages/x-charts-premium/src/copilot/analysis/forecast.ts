import type { ForecastResult } from './types';

/**
 * Computes a least-squares linear forecast for a single numeric series.
 *
 * Fits a line `y = slope * x + intercept` over `index -> value` pairs (using
 * each value's original index as `x`, so projections continue from the right
 * point of the x-domain). Null and non-finite entries are ignored. The
 * `steps` future values are projected from the index following the last point.
 *
 * `r2` is the coefficient of determination of the fit and buckets `fit` into
 * `strong` (>= 0.8), `moderate` (>= 0.5), or `weak`. `startValue` and
 * `endValue` are the fitted line evaluated at the first and last fitted index.
 *
 * When there are fewer than two numeric points (no line can be fit) or
 * `steps <= 0`, `projected` is empty; degenerate inputs are NaN-safe.
 *
 * @param values The series values; nulls are ignored.
 * @param steps The number of future values to project.
 * @returns The regression coefficients, fit quality, and projected values.
 */
export function computeForecast(values: (number | null)[], steps: number): ForecastResult {
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

  // Fewer than two points: no line can be fit.
  if (n < 2) {
    const only = n === 1 ? ys[0] : 0;
    return {
      slope: 0,
      intercept: only,
      r2: 0,
      fit: 'weak',
      projected: [],
      startValue: only,
      endValue: only,
    };
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

  // Vertical line (all x equal) cannot define a slope; treat as flat.
  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = meanY - slope * meanX;

  // Coefficient of determination: 1 - SSres / SStot.
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i += 1) {
    const predicted = slope * xs[i] + intercept;
    const dRes = ys[i] - predicted;
    const dTot = ys[i] - meanY;
    ssRes += dRes * dRes;
    ssTot += dTot * dTot;
  }
  // Constant series (ssTot === 0): the line fits perfectly.
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  let fit: ForecastResult['fit'];
  if (r2 >= 0.8) {
    fit = 'strong';
  } else if (r2 >= 0.5) {
    fit = 'moderate';
  } else {
    fit = 'weak';
  }

  const lastIndex = xs[n - 1];
  const projected: number[] = [];
  for (let s = 1; s <= steps; s += 1) {
    projected.push(slope * (lastIndex + s) + intercept);
  }

  return {
    slope,
    intercept,
    r2,
    fit,
    projected,
    startValue: slope * xs[0] + intercept,
    endValue: slope * lastIndex + intercept,
  };
}
