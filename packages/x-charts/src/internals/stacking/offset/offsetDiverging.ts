import type { Series } from '@mui/x-charts-vendor/d3-shape';

/**
 * Adapted from D3.js's offsetDiverging function https://github.com/d3/d3-shape/blob/main/src/offset/diverging.js
 * The original function return 0 values stacked at 0, this implementation put them either
 * at the positive or negative sum according to the original data.
 */
export function offsetDiverging(series: Series<any, any>, order: Iterable<number>) {
  if (series.length === 0) {
    return;
  }

  const seriesCount = series.length;
  const numericOrder = order as number[];
  const pointCount = series[numericOrder[0]].length;

  for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
    let positiveSum = 0;
    let negativeSum = 0;

    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex += 1) {
      const currentSeries = series[numericOrder[seriesIndex]] as any as Series<any, any>;
      const dataPoint = currentSeries[pointIndex];
      const difference = dataPoint[1] - dataPoint[0];

      if (difference > 0) {
        dataPoint[0] = positiveSum;
        positiveSum += difference;
        dataPoint[1] = positiveSum;
      } else if (difference < 0) {
        dataPoint[1] = negativeSum;
        negativeSum += difference;
        dataPoint[0] = negativeSum;
      } else if (dataPoint.data[currentSeries.key] > 0) {
        dataPoint[0] = positiveSum;
        dataPoint[1] = positiveSum;
      } else if (dataPoint.data[currentSeries.key] < 0) {
        dataPoint[1] = negativeSum;
        dataPoint[0] = negativeSum;
      } else {
        dataPoint[0] = 0;
        dataPoint[1] = 0;
      }
    }
  }
}
