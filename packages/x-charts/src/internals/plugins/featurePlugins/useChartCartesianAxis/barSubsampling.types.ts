import type { SeriesId } from '../../../../models/seriesType/common';

/** Aggregation used when collapsing bars into a bucket. Only `minMaxEnvelope` is wired today. */
export type BarSubsamplingStrategyName = 'minMaxEnvelope' | 'max' | 'average' | 'stride';

/** One aggregated bucket, in value space (stays valid across zoom). */
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

/** One level of detail. */
export interface BarSubsamplingLevel {
  /** Bars merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Buckets ordered by `startIndex`. */
  buckets: BarSubsamplingBucket[];
}

/** Precomputed LOD pyramid for one series. `levels[i].bucketSize === 2 ** (i + 1)`. */
export interface BarSubsamplingPyramid {
  dataLength: number;
  /** Ordered finest (`bucketSize 2`) to coarsest. */
  levels: BarSubsamplingLevel[];
}

/** State slice set by the pro `useChartProBarSubsampling` plugin; absent in community. */
export interface BarSubsamplingState {
  enabled: boolean;
  strategy: BarSubsamplingStrategyName;
}

/** Pyramids keyed by series id, as exposed by the selector. */
export type BarSubsamplingPyramidLookup = Record<SeriesId, BarSubsamplingPyramid>;
