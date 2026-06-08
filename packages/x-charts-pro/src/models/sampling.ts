/**
 * The information given to a custom sampling function.
 *
 * A sampler decides which points of a series are rendered. It receives lightweight accessors rather
 * than the raw data so the same function works across series types, and it returns the indices of
 * the points to keep.
 */
export interface DataSamplerParams<TValue = number> {
  /**
   * The number of points in the series.
   */
  length: number;
  /**
   * The recommended number of points to keep. It is derived from the size of the drawing area and
   * the current zoom level (it doubles roughly every 2x zoom). Returning about this many points
   * keeps the performance and visual density in line with the built-in methods, but you are free to
   * return more or fewer.
   */
  target: number;
  /**
   * The quantized zoom level: `0` when not zoomed, increasing by one roughly every 2x zoom.
   */
  zoomLevel: number;
  /**
   * Returns the value of the point at `index`. Its type follows the series: a `number` for line,
   * bar, and scatter series (the y value, or the cumulative top for stacked series), and a
   * `[start, end]` tuple for range bar series. Use it for value-based strategies such as keeping
   * local minima and maxima.
   * @param {number} index The index of the point.
   * @returns {TValue} The value at that index.
   */
  getValue: (index: number) => TValue;
  /**
   * Returns the position of the point at `index` along the sampled axis: the x value for line and
   * vertical bar series, the data x for scatter, or the index itself when no numeric position is
   * available. Use it for position-aware strategies.
   * @param {number} index The index of the point.
   * @returns {number} The position at that index.
   */
  getPosition: (index: number) => number;
}

/**
 * A custom sampling function.
 *
 * It returns the indices of the points to render. The chart renders them as-is, so they must be
 * valid: unique integers in `[0, length)`, in ascending order. Sampling only affects rendering, so
 * the function must not mutate anything and should be deterministic — returning the same indices for
 * the same params — otherwise the chart will flicker while panning.
 *
 * @example
 * // Keep the local minimum and maximum of every bucket.
 * const minMax: DataSampler = ({ length, target, getValue }) => {
 *   // A Set keeps the indices unique; spread it to an array before returning.
 *   const indices = new Set<number>();
 *   const bucketCount = Math.max(1, Math.floor(target / 2));
 *   const bucketSize = length / bucketCount;
 *   for (let b = 0; b < bucketCount; b += 1) {
 *     const start = Math.floor(b * bucketSize);
 *     const end = Math.min(length, Math.floor((b + 1) * bucketSize));
 *     let min = start;
 *     let max = start;
 *     for (let i = start; i < end; i += 1) {
 *       if (getValue(i) < getValue(min)) min = i;
 *       if (getValue(i) > getValue(max)) max = i;
 *     }
 *     // Each bucket sits after the previous one, so adding min before max stays ascending.
 *     indices.add(Math.min(min, max)).add(Math.max(min, max));
 *   }
 *   return [...indices];
 * };
 *
 * @param {DataSamplerParams} params The series size, target count, and value/position accessors.
 * @returns {number[]} The indices to render: unique, in ascending order.
 */
export type DataSampler<TValue = number> = (params: DataSamplerParams<TValue>) => number[];

/**
 * Downsampling method for line series: a built-in method or a custom {@link DataSampler}.
 */
export type LineSampling =
  /**
   * Largest-Triangle-Three-Buckets. Visually-optimal line decimation: preserves peaks, troughs,
   * and the overall shape. Recommended for line charts.
   */
  | 'lttb'
  /**
   * M4. For each pixel-wide column, keeps the first, last, minimum, and maximum points, so the
   * rasterized line is identical to drawing every point, at the cost of more rendered points.
   */
  | 'm4'
  | DataSampler;

/**
 * Downsampling method for scatter series: a built-in method or a custom {@link DataSampler}.
 */
export type ScatterSampling =
  /**
   * Keeps one representative point per grid cell, sized to the marker. Points that would overlap are
   * visually redundant. Recommended for scatter charts.
   */
  'bucket' | DataSampler;

/**
 * Downsampling method for bar series: a built-in method or a custom {@link DataSampler}.
 */
export type BarSampling =
  /**
   * Buckets consecutive bars into pixel-width buckets and renders one representative bar per bucket
   * (the one with the largest absolute value). Recommended for bar charts.
   */
  'bucket' | DataSampler;
