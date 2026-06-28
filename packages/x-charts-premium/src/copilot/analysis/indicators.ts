import type { IndicatorKind, IndicatorResult } from './types';
import { computeForecast } from './forecast';

const DEFAULT_PERIOD = 14;

/**
 * Trailing simple moving average over a fixed window.
 *
 * Each output position holds the mean of the `period` most recent values
 * (inclusive). Leading positions where the window is not yet filled, and
 * windows containing a null/non-finite value, are `null`.
 */
function simpleMovingAverage(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 0) {
    return out;
  }
  for (let i = period - 1; i < values.length; i += 1) {
    let sum = 0;
    let ok = true;
    for (let j = i - period + 1; j <= i; j += 1) {
      const v = values[j];
      if (v == null || !Number.isFinite(v)) {
        ok = false;
        break;
      }
      sum += v;
    }
    out[i] = ok ? sum / period : null;
  }
  return out;
}

/**
 * Exponential moving average, seeded with the SMA of the first full window.
 *
 * Uses the smoothing factor `alpha = 2 / (period + 1)`. Leading null/non-finite
 * positions are skipped; the EMA is seeded with the SMA of the first
 * `period`-long run of consecutive numeric values, so the first non-null output
 * sits at the right edge of that window. This lets the signal EMA of a MACD
 * line (which itself starts with nulls) seed correctly. Nulls after the seed
 * leave a gap but keep the running EMA.
 */
function exponentialMovingAverage(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 0) {
    return out;
  }

  // Find the right edge of the first `period`-long run of numeric values.
  let run = 0;
  let seedEnd = -1;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v == null || !Number.isFinite(v)) {
      run = 0;
      continue;
    }
    run += 1;
    if (run === period) {
      seedEnd = i;
      break;
    }
  }
  if (seedEnd === -1) {
    return out;
  }

  // Seed with the SMA of that window.
  let seed = 0;
  for (let j = seedEnd - period + 1; j <= seedEnd; j += 1) {
    seed += values[j] as number;
  }
  let prev = seed / period;
  out[seedEnd] = prev;

  const alpha = 2 / (period + 1);
  for (let i = seedEnd + 1; i < values.length; i += 1) {
    const v = values[i];
    if (v == null || !Number.isFinite(v)) {
      // Skip the point but keep the running EMA so later points stay seeded.
      out[i] = null;
      continue;
    }
    prev = alpha * v + (1 - alpha) * prev;
    out[i] = prev;
  }
  return out;
}

/** Trailing population standard deviation over a fixed window (null when not filled). */
function rollingStdDev(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 0) {
    return out;
  }
  for (let i = period - 1; i < values.length; i += 1) {
    let sum = 0;
    let ok = true;
    for (let j = i - period + 1; j <= i; j += 1) {
      const v = values[j];
      if (v == null || !Number.isFinite(v)) {
        ok = false;
        break;
      }
      sum += v;
    }
    if (!ok) {
      continue;
    }
    const mean = sum / period;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j += 1) {
      const diff = (values[j] as number) - mean;
      variance += diff * diff;
    }
    out[i] = Math.sqrt(variance / period);
  }
  return out;
}

/** Wilder's RSI: 100 - 100 / (1 + avgGain / avgLoss), seeded over `period` deltas. */
function relativeStrengthIndex(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  // RSI needs `period` deltas, i.e. `period + 1` points; the first value sits
  // at index `period`.
  if (period <= 0 || values.length < period + 1) {
    return out;
  }

  // Seed average gain/loss over the first `period` deltas.
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i += 1) {
    const cur = values[i];
    const prev = values[i - 1];
    if (cur == null || prev == null || !Number.isFinite(cur) || !Number.isFinite(prev)) {
      return out;
    }
    const delta = cur - prev;
    if (delta >= 0) {
      gain += delta;
    } else {
      loss -= delta;
    }
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < values.length; i += 1) {
    const cur = values[i];
    const prev = values[i - 1];
    if (cur == null || prev == null || !Number.isFinite(cur) || !Number.isFinite(prev)) {
      out[i] = null;
      continue;
    }
    const delta = cur - prev;
    const curGain = delta > 0 ? delta : 0;
    const curLoss = delta < 0 ? -delta : 0;
    // Wilder's smoothing.
    avgGain = (avgGain * (period - 1) + curGain) / period;
    avgLoss = (avgLoss * (period - 1) + curLoss) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

/** Bollinger Bands: SMA mid line +/- k * rolling stdDev. */
function bollingerBands(
  values: (number | null)[],
  period: number,
  k: number,
): IndicatorResult['series'] {
  const mid = simpleMovingAverage(values, period);
  const sd = rollingStdDev(values, period);
  const upper: (number | null)[] = new Array(values.length).fill(null);
  const lower: (number | null)[] = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i += 1) {
    const m = mid[i];
    const s = sd[i];
    if (m != null && s != null) {
      upper[i] = m + k * s;
      lower[i] = m - k * s;
    }
  }
  return [
    { id: 'upper', data: upper },
    { id: 'mid', data: mid },
    { id: 'lower', data: lower },
  ];
}

/**
 * Classic (floor) pivot points from the high/low/close of the series.
 *
 * Derives the pivot, two support levels, and two resistance levels from the
 * max (high), min (low), and last (close) of the numeric values, then repeats
 * each level across the whole series so each renders as a flat line.
 */
function pivotPoints(values: (number | null)[]): IndicatorResult['series'] {
  let high = -Infinity;
  let low = Infinity;
  let close: number | null = null;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (v == null || !Number.isFinite(v)) {
      continue;
    }
    if (v > high) {
      high = v;
    }
    if (v < low) {
      low = v;
    }
    close = v;
  }

  const ids = ['r2', 'r1', 'pivot', 's1', 's2'] as const;
  if (close == null) {
    return ids.map((id) => ({ id, data: new Array(values.length).fill(null) }));
  }

  const pivot = (high + low + close) / 3;
  const r1 = 2 * pivot - low;
  const s1 = 2 * pivot - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);
  const levels: Record<(typeof ids)[number], number> = { r2, r1, pivot, s1, s2 };
  return ids.map((id) => ({ id, data: new Array(values.length).fill(levels[id]) }));
}

/**
 * Trailing best-fit (least-squares) line, reusing the forecast regression.
 *
 * Each filled window is regressed independently; the output at the window's
 * right edge is the fitted value there (`endValue`). Leading positions and
 * windows containing a null/non-finite value are `null`.
 */
function linearRegression(values: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 1) {
    return out;
  }
  for (let i = period - 1; i < values.length; i += 1) {
    const window = values.slice(i - period + 1, i + 1);
    if (window.some((v) => v == null || !Number.isFinite(v))) {
      continue;
    }
    out[i] = computeForecast(window, 0).endValue;
  }
  return out;
}

/** MACD line (EMA12 - EMA26), signal (EMA9 of MACD), and histogram. */
function macd(values: (number | null)[]): IndicatorResult['series'] {
  const fast = exponentialMovingAverage(values, 12);
  const slow = exponentialMovingAverage(values, 26);
  const macdLine: (number | null)[] = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i += 1) {
    const f = fast[i];
    const s = slow[i];
    macdLine[i] = f != null && s != null ? f - s : null;
  }
  const signal = exponentialMovingAverage(macdLine, 9);
  const histogram: (number | null)[] = new Array(values.length).fill(null);
  for (let i = 0; i < values.length; i += 1) {
    const m = macdLine[i];
    const sig = signal[i];
    histogram[i] = m != null && sig != null ? m - sig : null;
  }
  return [
    { id: 'macd', data: macdLine },
    { id: 'signal', data: signal },
    { id: 'histogram', data: histogram },
  ];
}

/**
 * Computes a technical indicator over a single numeric series.
 *
 * Supports `sma`, `ema`, `bollinger`, `pivot`, `linreg`, `rsi`, and `macd`. The
 * `period` parameter defaults to 14 and applies to the windowed indicators
 * (`sma`, `ema`, `bollinger`, `linreg`, `rsi`); `macd` uses the fixed 12/26/9
 * configuration and `pivot` ignores the period. Each output line aligns 1:1
 * with the input: leading positions where the window is not yet filled are
 * `null`, as are windows that contain a null/non-finite value.
 *
 * Bollinger produces upper/mid/lower lines (k = 2); MACD produces macd/signal/
 * histogram lines; pivot produces r2/r1/pivot/s1/s2 flat lines; the rest
 * produce a single line. An unrecognized `kind` returns an empty `series`
 * array (no throw).
 *
 * @param kind The indicator to compute.
 * @param values The series values; nulls are treated as gaps.
 * @param params Optional parameters; `period` defaults to 14.
 * @returns The indicator kind, the effective period, and the output line(s).
 */
export function computeIndicator(
  kind: IndicatorKind,
  values: (number | null)[],
  params: { period?: number },
): IndicatorResult {
  const period = params.period ?? DEFAULT_PERIOD;

  let series: IndicatorResult['series'];
  switch (kind) {
    case 'sma':
      series = [{ id: 'sma', data: simpleMovingAverage(values, period) }];
      break;
    case 'ema':
      series = [{ id: 'ema', data: exponentialMovingAverage(values, period) }];
      break;
    case 'bollinger':
      series = bollingerBands(values, period, 2);
      break;
    case 'pivot':
      series = pivotPoints(values);
      break;
    case 'linreg':
      series = [{ id: 'linreg', data: linearRegression(values, period) }];
      break;
    case 'rsi':
      series = [{ id: 'rsi', data: relativeStrengthIndex(values, period) }];
      break;
    case 'macd':
      series = macd(values);
      break;
    default:
      // Unknown kind: return an empty result rather than throwing.
      series = [];
      break;
  }

  return { kind, period, series };
}
