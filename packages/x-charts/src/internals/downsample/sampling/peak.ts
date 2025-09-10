import { linearDownsample } from './linear';

/**
 * Peak downsampling - preserves local maxima and minima
 */
export function peakDownsample(
  data: readonly (number | null)[],
  targetPoints: number,
  type: 'axis' | 'series',
): (number | null)[] {
  if (data.length <= targetPoints) {
    return [...data];
  }

  if (type === 'axis') {
    return linearDownsample(data, targetPoints);
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
