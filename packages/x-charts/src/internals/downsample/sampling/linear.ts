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
