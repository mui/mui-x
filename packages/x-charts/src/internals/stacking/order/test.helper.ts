/**
 * Generates series data for stacking order tests.
 * Each series is an array of data points, where each data point has a `data` object
 * containing the original value.
 *
 * Use the optional `zeros` parameter to specify custom end values for each data point.
 * The `zeros` array accepts `undefined` to indicate that the default end value should be used.
 *
 * @example
 * ```tsx
 *  const series = generateSeries(
 *    [[10, 5]],
 *    [[undefined, 0]],
 *  );
 * // series will be:
 * [[
 *   { data: { S0: 10 }, 0: 0, 1: 10 },
 *   { data: { S0: 0 }, 0: 0, 1: 5 },
 * ]]
 * ```
 *
 * @param data - A 2D array where each sub-array represents a series and contains the values for that series.
 * @param zeros - (Optional) A 2D array of the same shape as `data` to specify custom end values for each data point.
 * @returns An array of series formatted for stacking order tests.
 */
export const generateSeries = (
  data: (number | null)[][],
  zeros?: (number | undefined | null)[][],
): any => {
  const series: any = data.map((seriesData, seriesIndex) => {
    const points: any = seriesData.map((value, pointIndex) => ({
      data: { [`S${seriesIndex}`]: value },
      0: 0,
      1:
        zeros?.[seriesIndex]?.[pointIndex] === undefined
          ? value
          : zeros?.[seriesIndex]?.[pointIndex],
    }));
    points.key = `S${seriesIndex}`;
    return points;
  });
  return series;
};
