import type { SeriesId } from '../../../../models/seriesType/common';

/**
 * Aggregation used when collapsing several original bars into one rendered bucket.
 * Only `minMaxEnvelope` is wired today; the others are kept as ready alternatives.
 */
export type BarSubsamplingStrategyName = 'minMaxEnvelope' | 'max' | 'average' | 'stride';

/**
 * One aggregated bucket, expressed in value (data) space so it stays valid across zoom.
 * `low`/`high` are the aggregated bounds of the stacked values inside the bucket.
 */
export interface BarSubsamplingBucket {
  /** First original data index covered by the bucket. */
  startIndex: number;
  /** Last original data index covered by the bucket (inclusive). */
  endIndex: number;
  /** Lower stacked value of the bucket. */
  low: number;
  /** Upper stacked value of the bucket. */
  high: number;
}

/** One level of detail. `levels[0]` is the coarsest stored level (`bucketSize === 2`). */
export interface BarSubsamplingLevel {
  /** Number of original bars merged into each bucket (a power of two, `>= 2`). */
  bucketSize: number;
  /** The aggregated buckets, ordered by `startIndex`. */
  buckets: BarSubsamplingBucket[];
}

/**
 * The precomputed level-of-detail pyramid for a single series.
 * `levels[i].bucketSize === 2 ** (i + 1)`. The identity level (one bar per data point)
 * is intentionally not stored; it is represented by the absence of an active level.
 */
export interface BarSubsamplingPyramid {
  /** Number of original data points. */
  dataLength: number;
  /** Coarser-detail levels, ordered from finest (`bucketSize 2`) to coarsest. */
  levels: BarSubsamplingLevel[];
}

/**
 * State slice activated by the pro `useChartProBarSubsampling` plugin.
 * Absent in the community build, in which case subsampling never runs.
 */
export interface BarSubsamplingState {
  enabled: boolean;
  strategy: BarSubsamplingStrategyName;
}

/** Pyramids keyed by series id, as exposed by the selector. */
export type BarSubsamplingPyramidLookup = Record<SeriesId, BarSubsamplingPyramid>;
