import type { SeriesId } from '../../../../models/seriesType/common';

/** Aggregation used when collapsing elements into a bucket. Only `minMaxEnvelope` is wired today. */
export type SamplingStrategyName = 'minMaxEnvelope' | 'max' | 'average' | 'stride';

/** One aggregated bucket, in value space (stays valid across zoom). */
export interface SamplingBucket {
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
export interface SamplingLevel {
  /** Elements merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Buckets ordered by `startIndex`. */
  buckets: SamplingBucket[];
}

/** Precomputed LOD pyramid for one series. `levels[i].bucketSize === 2 ** (i + 1)`. */
export interface SamplingPyramid {
  dataLength: number;
  /** Ordered finest (`bucketSize 2`) to coarsest. */
  levels: SamplingLevel[];
}

/** State slice set by the pro `useChartProSampling` plugin; absent in community. */
export interface SamplingState {
  enabled: boolean;
  strategy: SamplingStrategyName;
}

/** Pyramids keyed by series id, as exposed by the selector. */
export type SamplingPyramidLookup = Record<SeriesId, SamplingPyramid>;
