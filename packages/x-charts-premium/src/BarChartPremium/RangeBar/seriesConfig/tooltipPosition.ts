import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartsTooltipItem,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import type {
  ChartSeriesType,
  ProcessedSeries,
  TooltipItemPositionSelector,
} from '@mui/x-charts/internals';
import type { SeriesItemIdentifierWithType } from '@mui/x-charts/models';
import { createGetRangeBarDimensions } from '../createGetRangeBarDimensions';

export const selectorTooltipItemPosition: TooltipItemPositionSelector<'rangeBar'> =
  createSelectorMemoized(
    selectorChartsTooltipItem,
    selectorChartSeriesProcessed,
    selectorChartXAxis,
    selectorChartYAxis,
    function selectorTooltipItemPosition(
      identifier: SeriesItemIdentifierWithType<ChartSeriesType> | null,
      series: ProcessedSeries,
      xAxes,
      yAxes,
      placement: 'top' | 'bottom' | 'left' | 'right' | undefined,
    ) {
      if (!identifier || identifier.type !== 'rangeBar' || identifier.dataIndex === undefined) {
        return null;
      }

      const itemSeries = series.rangeBar?.series[identifier.seriesId];

      if (!series.rangeBar || !itemSeries) {
        return null;
      }

      const xAxis = xAxes.axis[itemSeries.xAxisId ?? xAxes.axisIds[0]];
      const yAxis = yAxes.axis[itemSeries.yAxisId ?? yAxes.axisIds[0]];

      if (xAxis === undefined || yAxis === undefined) {
        return null;
      }

      const dimensions = createGetRangeBarDimensions({
        verticalLayout: itemSeries.layout === 'vertical',
        xAxisConfig: xAxis,
        yAxisConfig: yAxis,
        series: itemSeries,
        numberOfGroups: series.rangeBar.seriesOrder.length,
      })(
        identifier.dataIndex,
        series.rangeBar.seriesOrder.findIndex((id) => id === itemSeries.id),
      );

      if (dimensions == null) {
        return null;
      }

      const { x, y, width, height } = dimensions;
      switch (placement) {
        case 'right':
          return { x: x + width, y: y + height / 2 };
        case 'bottom':
          return { x: x + width / 2, y: y + height };
        case 'left':
          return { x, y: y + height / 2 };
        case 'top':
        default:
          return { x: x + width / 2, y };
      }
    },
  );
