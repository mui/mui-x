// Types for downsampling configuration
export type DownsampleStrategy = 'linear' | 'peak' | 'max' | 'min' | 'average' | 'none';

/**
 * Default target points for downsampling when enabled with boolean true
 */
export const DEFAULT_TARGET_POINTS = 200;

export interface DownsampleConfig {
  /**
   * The target number of data points after downsampling.
   * If the original data has fewer points, no downsampling is applied.
   */
  targetPoints: number;
  /**
   * The downsampling strategy to use.
   * @default 'linear'
   */
  strategy?: DownsampleStrategy;
}

export type DownsampleFunction<TValue> = (
  data: readonly TValue[],
  targetPoints: number,
) => TValue[];

export type DownsampleProp<TValue> = boolean | DownsampleConfig | DownsampleFunction<TValue>;
