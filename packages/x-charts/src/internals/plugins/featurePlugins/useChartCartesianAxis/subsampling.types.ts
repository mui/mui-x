import type { SeriesId } from '../../../../models/seriesType/common';

/** Aggregation used when collapsing elements into a bucket. Only `minMaxEnvelope` is wired today. */
export type SubsamplingStrategyName = 'minMaxEnvelope' | 'max' | 'average' | 'stride';

/** One aggregated bucket, in value space (stays valid across zoom). */
export interface SubsamplingBucket {
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
export interface SubsamplingLevel {
  /** Elements merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Buckets ordered by `startIndex`. */
  buckets: SubsamplingBucket[];
}

/** Precomputed LOD pyramid for one series. `levels[i].bucketSize === 2 ** (i + 1)`. */
export interface SubsamplingPyramid {
  dataLength: number;
  /** Ordered finest (`bucketSize 2`) to coarsest. */
  levels: SubsamplingLevel[];
}

/** State slice set by the pro `useChartProSubsampling` plugin; absent in community. */
export interface SubsamplingState {
  enabled: boolean;
  strategy: SubsamplingStrategyName;
}

/** Pyramids keyed by series id, as exposed by the selector. */
export type SubsamplingPyramidLookup = Record<SeriesId, SubsamplingPyramid>;
