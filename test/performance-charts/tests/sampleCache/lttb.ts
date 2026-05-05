/**
 * Largest-Triangle-Three-Buckets downsampling. Returns the indices kept,
 * in order. First and last indices are always preserved.
 */
export function lttbIndices(
  xs: ArrayLike<number>,
  ys: ArrayLike<number>,
  threshold: number,
): number[] {
  const dataLen = xs.length;
  if (threshold >= dataLen || threshold <= 2) {
    const all = new Array<number>(dataLen);
    for (let i = 0; i < dataLen; i += 1) {
      all[i] = i;
    }
    return all;
  }

  const sampled = new Array<number>(threshold);
  const every = (dataLen - 2) / (threshold - 2);

  let a = 0;
  sampled[0] = 0;

  for (let i = 0; i < threshold - 2; i += 1) {
    let avgX = 0;
    let avgY = 0;
    const avgRangeStart = Math.floor((i + 1) * every) + 1;
    let avgRangeEnd = Math.floor((i + 2) * every) + 1;
    avgRangeEnd = avgRangeEnd < dataLen ? avgRangeEnd : dataLen;
    const avgRangeLen = avgRangeEnd - avgRangeStart;

    for (let j = avgRangeStart; j < avgRangeEnd; j += 1) {
      avgX += xs[j];
      avgY += ys[j];
    }
    avgX /= avgRangeLen;
    avgY /= avgRangeLen;

    const rangeOffs = Math.floor(i * every) + 1;
    const rangeTo = Math.floor((i + 1) * every) + 1;

    const pointAX = xs[a];
    const pointAY = ys[a];

    let maxArea = -1;
    let maxAreaPoint = rangeOffs;

    for (let j = rangeOffs; j < rangeTo; j += 1) {
      const area =
        Math.abs((pointAX - avgX) * (ys[j] - pointAY) - (pointAX - xs[j]) * (avgY - pointAY)) * 0.5;
      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = j;
      }
    }

    sampled[i + 1] = maxAreaPoint;
    a = maxAreaPoint;
  }

  sampled[threshold - 1] = dataLen - 1;
  return sampled;
}
