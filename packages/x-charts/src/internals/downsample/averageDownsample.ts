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
