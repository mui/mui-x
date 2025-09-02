// Types for downsampling configuration
export type DownsampleStrategy = 'linear' | 'peak' | 'max' | 'min' | 'average' | 'none';

/**
 * Default target points for downsampling when enabled with boolean true
 */
const DEFAULT_TARGET_POINTS = 200;

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

/**
 * Linear downsampling - selects evenly spaced points
 */
export function linearDownsample<TValue>(data: readonly TValue[], targetPoints: number): TValue[] {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result: TValue[] = [];
  const step = (data.length - 1) / (targetPoints - 1);

  for (let i = 0; i < targetPoints; i += 1) {
    const index = Math.round(i * step);
    result.push(data[index]);
  }

  return result;
}

/**
 * Peak downsampling - preserves local maxima and minima
 */
export function peakDownsample(
  data: readonly (number | null)[],
  targetPoints: number,
): (number | null)[] {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result: (number | null)[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      // Include the last point
      result.push(data[data.length - 1]);
      continue;
    }

    let maxValue = -Infinity;
    let minValue = Infinity;
    let maxIndex = bucketStart;
    let minIndex = bucketStart;

    // Find max and min in this bucket
    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null) {
        if (value > maxValue) {
          maxValue = value;
          maxIndex = j;
        }
        if (value < minValue) {
          minValue = value;
          minIndex = j;
        }
      }
    }

    // Add the point that has the most significant change
    const prevValue = i > 0 ? (result[result.length - 1] ?? 0) : 0;
    const maxDiff = Math.abs(maxValue - prevValue);
    const minDiff = Math.abs(minValue - prevValue);

    if (maxDiff >= minDiff) {
      result.push(data[maxIndex]);
    } else {
      result.push(data[minIndex]);
    }
  }

  return result;
}

/**
 * Max downsampling - selects maximum values in each bucket
 */
export function maxDownsample(
  data: readonly (number | null)[],
  targetPoints: number,
): (number | null)[] {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result: (number | null)[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      // Include the last point
      result.push(data[data.length - 1]);
      continue;
    }

    let maxValue = -Infinity;
    let maxIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null && value > maxValue) {
        maxValue = value;
        maxIndex = j;
      }
    }

    result.push(data[maxIndex]);
  }

  return result;
}

/**
 * Min downsampling - selects minimum values in each bucket
 */
export function minDownsample(
  data: readonly (number | null)[],
  targetPoints: number,
): (number | null)[] {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result: (number | null)[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      // Include the last point
      result.push(data[data.length - 1]);
      continue;
    }

    let minValue = Infinity;
    let minIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null && value < minValue) {
        minValue = value;
        minIndex = j;
      }
    }

    result.push(data[minIndex]);
  }

  return result;
}

/**
 * Average downsampling - calculates average values in each bucket
 */
export function averageDownsample(
  data: readonly (number | null)[],
  targetPoints: number,
): (number | null)[] {
  if (data.length <= targetPoints) {
    return [...data];
  }

  const result: (number | null)[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      // Include the last point
      result.push(data[data.length - 1]);
      continue;
    }

    let sum = 0;
    let count = 0;

    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null) {
        sum += value;
        count += 1;
      }
    }

    result.push(count > 0 ? sum / count : null);
  }

  return result;
}

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
  if (!downsample || downsample === 'none') {
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

/**
 * Get indices for linear downsampling
 */
function getLinearDownsampleIndices(dataLength: number, targetPoints: number): number[] {
  if (dataLength <= targetPoints) {
    return Array.from({ length: dataLength }, (_, i) => i);
  }

  const indices: number[] = [];
  const step = (dataLength - 1) / (targetPoints - 1);

  for (let i = 0; i < targetPoints; i += 1) {
    indices.push(Math.round(i * step));
  }

  return indices;
}

/**
 * Get indices for various downsampling strategies
 */
function getDownsampleIndices(
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

function getPeakDownsampleIndices(
  data: readonly (number | null)[],
  targetPoints: number,
): number[] {
  const indices: number[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      indices.push(data.length - 1);
      continue;
    }

    let maxValue = -Infinity;
    let minValue = Infinity;
    let maxIndex = bucketStart;
    let minIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null) {
        if (value > maxValue) {
          maxValue = value;
          maxIndex = j;
        }
        if (value < minValue) {
          minValue = value;
          minIndex = j;
        }
      }
    }

    const prevValue = i > 0 ? (data[indices[indices.length - 1]] ?? 0) : 0;
    const maxDiff = Math.abs(maxValue - prevValue);
    const minDiff = Math.abs(minValue - prevValue);

    if (maxDiff >= minDiff) {
      indices.push(maxIndex);
    } else {
      indices.push(minIndex);
    }
  }

  return indices;
}

function getMaxDownsampleIndices(data: readonly (number | null)[], targetPoints: number): number[] {
  const indices: number[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      indices.push(data.length - 1);
      continue;
    }

    let maxValue = -Infinity;
    let maxIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null && value > maxValue) {
        maxValue = value;
        maxIndex = j;
      }
    }

    indices.push(maxIndex);
  }

  return indices;
}

function getMinDownsampleIndices(data: readonly (number | null)[], targetPoints: number): number[] {
  const indices: number[] = [];
  const bucketSize = Math.floor(data.length / targetPoints);

  for (let i = 0; i < targetPoints; i += 1) {
    const bucketStart = i * bucketSize;
    const bucketEnd = Math.min((i + 1) * bucketSize, data.length);

    if (i === targetPoints - 1) {
      indices.push(data.length - 1);
      continue;
    }

    let minValue = Infinity;
    let minIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j += 1) {
      const value = data[j];
      if (value !== null && value < minValue) {
        minValue = value;
        minIndex = j;
      }
    }

    indices.push(minIndex);
  }

  return indices;
}
