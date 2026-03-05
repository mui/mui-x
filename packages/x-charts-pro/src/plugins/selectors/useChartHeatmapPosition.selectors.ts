import { createSelector } from '@mui/x-internals/store';
import {
  getDataIndexForOrdinalScaleValue,
  isBandScale,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import { type HeatmapItemIdentifierWithData } from '../../models';

export const selectorHeatmapItemAtPosition = createSelector(
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartSeriesProcessed,
  function selectorHeatmapItemAtPosition(
    { axis: xAxes, axisIds: xAxisIds },
    { axis: yAxes, axisIds: yAxisIds },
    processedSeries,
    svgPoint: Pick<DOMPoint, 'x' | 'y'>,
  ): HeatmapItemIdentifierWithData | undefined {
    const { series, seriesOrder } = processedSeries?.heatmap ?? {};
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    for (const seriesId of seriesOrder ?? []) {
      const aSeries = (series ?? {})[seriesId];

      const xAxisId = aSeries.xAxisId ?? defaultXAxisId;
      const yAxisId = aSeries.yAxisId ?? defaultYAxisId;

      const xAxis = xAxes[xAxisId];
      const yAxis = yAxes[yAxisId];

      const xScale = xAxis.scale;
      const yScale = yAxis.scale;

      if (!isBandScale(xScale) || !isBandScale(yScale)) {
        continue;
      }

      const xIndex = getDataIndexForOrdinalScaleValue(xScale, svgPoint.x);
      const yIndex = getDataIndexForOrdinalScaleValue(yScale, svgPoint.y);

      const value = aSeries.heatmapData.getValue(xIndex, yIndex);

      if (value !== null) {
        return {
          type: 'heatmap',
          seriesId,
          xIndex,
          yIndex,
          value,
        };
      }
    }

    return undefined;
  },
);
