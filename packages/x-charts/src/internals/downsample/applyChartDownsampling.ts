import type { DownsampleProp, DownsampleStrategy } from './types';
import { DEFAULT_TARGET_POINTS } from './types';
import { getDownsampleIndices } from './utils';

/**
 * Apply chart-level downsampling to series data and axis data
 * This ensures consistent downsampling across all series and maintains axis alignment
 */
export function applyChartDownsampling<TAxisValue>(
  seriesData: readonly (readonly (number | null)[])[],
  axisData: readonly TAxisValue[],
  downsample: DownsampleProp<number | null>,
): {
  seriesData: (number | null)[][];
  axisData: TAxisValue[];
} {
  if (!downsample) {
    return {
      seriesData: seriesData.map((data) => [...data]),
      axisData: [...axisData],
    };
  }

  // Find the maximum data length across all series
  const maxDataLength = Math.max(...seriesData.map((data) => data.length), axisData.length);

  if (maxDataLength === 0) {
    return {
      seriesData: seriesData.map((data) => [...data]),
      axisData: [...axisData],
    };
  }

  // Determine target points and strategy
  let targetPoints: number;
  let strategy: DownsampleStrategy = 'linear';

  if (downsample === true) {
    targetPoints = Math.min(DEFAULT_TARGET_POINTS, maxDataLength);
  } else if (typeof downsample === 'function') {
    // For custom functions, we'll apply them to the combined dataset
    // This is more complex, so we'll use a simplified approach
    targetPoints = Math.min(DEFAULT_TARGET_POINTS, maxDataLength);
  } else {
    targetPoints = Math.min(downsample.targetPoints, maxDataLength);
    strategy = downsample.strategy || 'linear';
  }

  if (maxDataLength <= targetPoints) {
    return {
      seriesData: seriesData.map((data) => [...data]),
      axisData: [...axisData],
    };
  }

  // Get the indices to keep based on the primary series (first non-empty series)
  const primarySeries = seriesData.find((data) => data.length > 0) || [];
  const indices = getDownsampleIndices(primarySeries, targetPoints, strategy);

  // Apply the same indices to all series and axis data
  const downsampledSeriesData = seriesData.map((data) => {
    if (data.length === 0) {
      return [...data];
    }
    return indices.map((i) => (i < data.length ? data[i] : null));
  });

  const downsampledAxisData = indices.map((i) =>
    i < axisData.length ? axisData[i] : axisData[axisData.length - 1],
  );

  return {
    seriesData: downsampledSeriesData,
    axisData: downsampledAxisData,
  };
}
