import type { DownsampleProp } from './types';
import { DEFAULT_TARGET_POINTS } from './types';
import { getLinearDownsampleIndices } from './linearDownsample';
import { getDownsampleIndices } from './utils';

/**
 * Apply downsampling to data with corresponding axis data
 * This ensures that axis data is downsampled using the same indices
 */
export function applyDownsampleWithAxis<TAxisValue>(
  data: readonly (number | null)[],
  axisData: readonly TAxisValue[],
  downsample: DownsampleProp<number | null>,
): { data: (number | null)[]; axisData: TAxisValue[] } {
  if (!downsample || downsample === 'none') {
    return { data: [...data], axisData: [...axisData] };
  }

  // Handle boolean true - use default config
  if (downsample === true) {
    const indices = getLinearDownsampleIndices(data.length, DEFAULT_TARGET_POINTS);
    return {
      data: indices.map((i) => data[i]),
      axisData: indices.map((i) => axisData[i]),
    };
  }

  // Handle function - apply to data and then get corresponding axis data
  if (typeof downsample === 'function') {
    const downsampledData = downsample(data, DEFAULT_TARGET_POINTS);
    // For custom functions, we need to map back to find indices
    // This is a simplified approach - for more complex cases, the function should handle axis data too
    const step = (data.length - 1) / (downsampledData.length - 1);
    const newAxisData: TAxisValue[] = [];
    for (let i = 0; i < downsampledData.length; i += 1) {
      const index = Math.round(i * step);
      newAxisData.push(axisData[index]);
    }
    return { data: downsampledData, axisData: newAxisData };
  }

  // Handle config object
  const { targetPoints, strategy = 'linear' } = downsample;

  if (data.length <= targetPoints) {
    return { data: [...data], axisData: [...axisData] };
  }

  const indices = getDownsampleIndices(data, targetPoints, strategy);
  return {
    data: indices.map((i) => data[i]),
    axisData: indices.map((i) => axisData[i]),
  };
}
