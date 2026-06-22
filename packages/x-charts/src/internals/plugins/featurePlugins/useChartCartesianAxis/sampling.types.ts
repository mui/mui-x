import type { SeriesId } from '../../../../models/seriesType/common';

/**
 * Ephemeral view of one level of detail: `subarray` views into the pyramid buffers plus its
 * bucket size. Built on demand by {@link selectSamplingLevelByZoom}, never stored.
 * Bucket `j` covers indices `[j * bucketSize, min((j + 1) * bucketSize - 1, dataLength - 1)]`
 * and the `[min, max]` value envelope of that range (so spikes and troughs survive merging).
 */
export interface SamplingLevel {
  /** Elements merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Minimum value per bucket. */
  min: Float64Array;
  /** Maximum value per bucket. */
  max: Float64Array;
}

/**
 * Precomputed LOD pyramid for one series, stored as flat typed arrays (no per-level or per-bucket
 * objects). All levels are concatenated finest (`bucketSize 2`) to coarsest into `min`/`max`;
 * `offsets[i]..offsets[i + 1]` is level `i` (bucketSize `2 ** (i + 1)`). `offsets.length - 1` levels.
 */
export interface SamplingPyramid {
  dataLength: number;
  /** All levels' minimum values, concatenated finest to coarsest. */
  min: Float64Array;
  /** All levels' maximum values, same order. */
  max: Float64Array;
  /** Level start offsets into `min`/`max`; length `levelCount + 1`, last entry `=== min.length`. */
  offsets: Int32Array;
}

/** State slice set by the pro `useChartProSampling` plugin; absent in community. */
export interface SamplingState {
  enabled: boolean;
}

/** Pyramids keyed by series id, as exposed by the selector. */
export type SamplingPyramidLookup = Record<SeriesId, SamplingPyramid>;
