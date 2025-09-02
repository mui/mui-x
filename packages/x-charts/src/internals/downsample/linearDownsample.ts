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
 * Get indices for linear downsampling
 */
export function getLinearDownsampleIndices(dataLength: number, targetPoints: number): number[] {
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
