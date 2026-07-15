/**
 * The active level of detail for the current zoom: the slice `[start, end)` of the pyramid's
 * `argMin`/`argMax` arrays plus its bucket size. Bucket `j` (`j` from `0`) covers indices
 * `[j * bucketSize, min((j + 1) * bucketSize - 1, dataLength - 1)]`.
 */
export interface ActiveSamplingLevel {
  /** Elements merged per bucket (power of two, `>= 2`). */
  bucketSize: number;
  /** Start offset into `argMin`/`argMax`. */
  start: number;
  /** End offset (exclusive) into `argMin`/`argMax`. */
  end: number;
}

/**
 * Precomputed LOD pyramid for one series, shared by every chart type and sampling method.
 * Stored as flat typed arrays (no per-level or per-bucket objects): for each bucket it keeps the
 * original index of the minimum (`argMin`, over the low channel) and the maximum (`argMax`, over
 * the high channel). Consumers read the values back from their own series data by index.
 *
 * All levels are concatenated finest (`bucketSize 2`) to coarsest; `offsets[i]..offsets[i + 1]` is
 * level `i` (bucketSize `2 ** (i + 1)`), and there are `offsets.length - 1` levels.
 */
export interface SamplingPyramid {
  dataLength: number;
  /** Index of the per-bucket minimum (low channel), concatenated finest to coarsest. */
  argMin: Int32Array;
  /** Index of the per-bucket maximum (high channel), same order. */
  argMax: Int32Array;
  /** Level start offsets into `argMin`/`argMax`; length `levelCount + 1`. */
  offsets: Int32Array;
  /** Ascending null-point indices, merged back into the output as line breaks. Absent without nulls. */
  nullIndices?: Int32Array;
}
