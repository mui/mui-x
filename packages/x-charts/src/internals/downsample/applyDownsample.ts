import type { DownsampleProp } from './types';
import { DEFAULT_TARGET_POINTS } from './types';
import { linearDownsample } from './linearDownsample';
import { peakDownsample } from './peakDownsample';
import { maxDownsample } from './maxDownsample';
import { minDownsample } from './minDownsample';
import { averageDownsample } from './averageDownsample';

/**
 * Apply downsampling to numerical data based on configuration
 */
export function applyDownsample(
  data: readonly (number | null)[],
  downsample: DownsampleProp<number | null>,
): (number | null)[] {
  if (!downsample || downsample === 'none') {
    return [...data];
  }

  // Handle boolean true - use default config
  if (downsample === true) {
    return linearDownsample(data, DEFAULT_TARGET_POINTS);
  }

  // Handle function
  if (typeof downsample === 'function') {
    return downsample(data, DEFAULT_TARGET_POINTS);
  }

  // Handle config object
  const { targetPoints, strategy = 'linear' } = downsample;

  if (data.length <= targetPoints) {
    return [...data];
  }

  switch (strategy) {
    case 'linear':
      return linearDownsample(data, targetPoints);
    case 'peak':
      return peakDownsample(data, targetPoints);
    case 'max':
      return maxDownsample(data, targetPoints);
    case 'min':
      return minDownsample(data, targetPoints);
    case 'average':
      return averageDownsample(data, targetPoints);
    case 'none':
      return [...data];
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Unknown downsampling strategy: ${strategy}. Using linear.`);
      }
      return linearDownsample(data, targetPoints);
  }
}
