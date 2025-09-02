import type { DownsampleFunction, DownsampleProp } from './types';
import { linearDownsample } from './sampling/linear';
import { averageDownsample } from './sampling/average';
import { peakDownsample } from './sampling/peak';
import { maxDownsample } from './sampling/max';
import { minDownsample } from './sampling/min';

/**
 * Default target points for downsampling when enabled with boolean true
 */
const DEFAULT_TARGET_POINTS = 200;

/**
 * Get indices for various downsampling strategies
 */
export function getSamplingFunction(
  downsampleConfig: DownsampleProp<number | null>,
): DownsampleFunction<number | null> | null {
  if (!downsampleConfig) {
    return null;
  }

  if (typeof downsampleConfig === 'function') {
    return downsampleConfig;
  }

  if (downsampleConfig === true) {
    return linearDownsample;
  }

  const { strategy } = downsampleConfig;

  switch (strategy) {
    case 'peak':
      return peakDownsample;
    case 'max':
      return maxDownsample;
    case 'min':
      return minDownsample;
    case 'average':
      return averageDownsample;
    default:
      return linearDownsample;
  }
}

export function getTargetPoints(downsampleConfig: DownsampleProp<any>): number {
  if (!downsampleConfig) {
    return DEFAULT_TARGET_POINTS;
  }

  if (typeof downsampleConfig === 'object' && downsampleConfig !== null) {
    return downsampleConfig.targetPoints ?? DEFAULT_TARGET_POINTS;
  }

  return DEFAULT_TARGET_POINTS;
}
