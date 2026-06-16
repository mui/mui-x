import type { BarSubsamplingStrategyName } from './barSubsampling.types';

// Aggregates a bucket into one `{ low, high }` pair. Each `stacked` entry is a `[base, top]` pair.
export type BarSubsamplingStrategy = (
  stacked: readonly [number, number][],
  startIndex: number,
  endIndex: number,
) => { low: number; high: number };

/** Default: full extent of the bucket (min base, max top) — keeps spikes and troughs. */
const minMaxEnvelope: BarSubsamplingStrategy = (stacked, startIndex, endIndex) => {
  let low = Infinity;
  let high = -Infinity;
  for (let i = startIndex; i <= endIndex; i += 1) {
    const [base, top] = stacked[i];
    if (base < low) {
      low = base;
    }
    if (top > high) {
      high = top;
    }
  }
  return { low, high };
};

/** Peak-preserving: render to the bucket's max top, dropping troughs. */
const max: BarSubsamplingStrategy = (stacked, startIndex, endIndex) => {
  let low = Infinity;
  let high = -Infinity;
  for (let i = startIndex; i <= endIndex; i += 1) {
    const [base, top] = stacked[i];
    if (base < low) {
      low = base;
    }
    if (top > high) {
      high = top;
    }
  }
  return { low: Math.min(low, 0), high };
};

/** Smoothing: mean of the bucket tops over a flat base. */
const average: BarSubsamplingStrategy = (stacked, startIndex, endIndex) => {
  let baseSum = 0;
  let topSum = 0;
  const count = endIndex - startIndex + 1;
  for (let i = startIndex; i <= endIndex; i += 1) {
    baseSum += stacked[i][0];
    topSum += stacked[i][1];
  }
  return { low: baseSum / count, high: topSum / count };
};

/** Cheapest: keep the first point of the bucket, drop the rest. */
const stride: BarSubsamplingStrategy = (stacked, startIndex) => {
  const [base, top] = stacked[startIndex];
  return { low: base, high: top };
};

export const BAR_SUBSAMPLING_STRATEGIES: Record<
  BarSubsamplingStrategyName,
  BarSubsamplingStrategy
> = {
  minMaxEnvelope,
  max,
  average,
  stride,
};
