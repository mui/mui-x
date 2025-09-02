import { linearDownsample } from './linear';

/**
 * Min downsampling - selects minimum values in each bucket
 */
export function minDownsample(
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
