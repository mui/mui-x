import type { DownsampleStrategy } from './types';
import { getLinearDownsampleIndices } from './linearDownsample';
import { getPeakDownsampleIndices } from './peakDownsample';
import { getMaxDownsampleIndices } from './maxDownsample';
import { getMinDownsampleIndices } from './minDownsample';

/**
 * Get indices for various downsampling strategies
 */
export function getDownsampleIndices(
  data: readonly (number | null)[],
  targetPoints: number,
  strategy: DownsampleStrategy,
): number[] {
  if (data.length <= targetPoints) {
    return Array.from({ length: data.length }, (_, i) => i);
  }

  switch (strategy) {
    case 'linear':
      return getLinearDownsampleIndices(data.length, targetPoints);
    case 'peak':
      return getPeakDownsampleIndices(data, targetPoints);
    case 'max':
      return getMaxDownsampleIndices(data, targetPoints);
    case 'min':
      return getMinDownsampleIndices(data, targetPoints);
    case 'average':
      // Average doesn't preserve original indices, use linear as fallback
      return getLinearDownsampleIndices(data.length, targetPoints);
    case 'none':
      return Array.from({ length: data.length }, (_, i) => i);
    default:
      return getLinearDownsampleIndices(data.length, targetPoints);
  }
}
