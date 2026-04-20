/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth (W) The width available to place bars.
 * @param groupCount (N) The number of bars to place in that space.
 * @param gapRatio (r) The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
export function getBandSize(bandWidth: number, groupCount: number, gapRatio: number) {
  if (gapRatio === 0) {
    return {
      barWidth: bandWidth / groupCount,
      offset: 0,
    };
  }
  const barWidth = bandWidth / (groupCount + (groupCount - 1) * gapRatio);
  const offset = gapRatio * barWidth;
  return {
    barWidth,
    offset,
  };
}
