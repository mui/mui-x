// Types for downsampling configuration
export type DownsampleStrategy = 'linear' | 'peak' | 'max' | 'min' | 'average';

export interface DownsampleConfig {
  /**
   * The target number of data points after downsampling.
   * If the original data has fewer points, no downsampling is applied.
   */
  targetPoints: number;
  /**
   * The downsampling strategy to use.
   *
   * - `linear`: Results in points selected at regular intervals, preserving the timeline distribution
   * - `peak`: Results in data that maintains the visual shape by prioritizing local extremes (peaks and valleys)
   * - `max`: Results in data that shows the highest values within each sampling interval
   * - `min`: Results in data that shows the lowest values within each sampling interval
   * - `average`: Results in data that represents the mean value within each sampling interval
   *
   * @default 'linear'
   */
  strategy?: DownsampleStrategy;
}

export type DownsampleFunction<TValue> = (
  data: readonly TValue[],
  targetPoints: number,
  type: 'axis' | 'series',
) => TValue[];

export type DownsampleProp<TValue> = DownsampleConfig | DownsampleFunction<TValue>;
