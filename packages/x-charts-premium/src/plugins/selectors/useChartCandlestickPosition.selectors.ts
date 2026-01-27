import { createSelector } from '@mui/x-internals/store';
import {
  getDataIndexForOrdinalScaleValue,
  isBandScale,
  isOrdinalScale,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import { type OHLCItemIdentifier } from '../../models';

export const selectorCandlestickItemAtPosition = createSelector(
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartSeriesProcessed,
  function selectorHeatmapItemAtPosition(
    { axis: xAxes, axisIds: xAxisIds },
    { axis: yAxes, axisIds: yAxisIds },
    processedSeries,
    svgPoint: Pick<DOMPoint, 'x' | 'y'>,
  ): OHLCItemIdentifier | undefined {
    const { series, seriesOrder } = processedSeries?.ohlc ?? {};
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

      if (!isBandScale(xScale) || isOrdinalScale(yScale)) {
        continue;
      }

      const dataIndex = getDataIndexForOrdinalScaleValue(xScale, svgPoint.x);
      const yValue = yScale.invert(svgPoint.y);

      const datum = aSeries.data[dataIndex];

      if (datum == null) {
        continue;
      }

      const min = Math.min(...datum);
      const max = Math.max(...datum);

      if (yValue.valueOf() >= min && yValue.valueOf() <= max) {
        return {
          type: 'ohlc',
          seriesId,
          dataIndex,
        };
      }
    }

    return undefined;
  },
);
