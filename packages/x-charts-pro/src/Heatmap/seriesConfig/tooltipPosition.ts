import { createSelectorMemoized } from '@base-ui/utils/store';
import {
  getOrdinalBandStartMapper,
  isBandScaleConfig,
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

export const selectorTooltipItemPosition: TooltipItemPositionSelector<'heatmap'> =
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
      if (!identifier || identifier.type !== 'heatmap') {
        return null;
      }

      const itemSeries = series.heatmap?.series[identifier.seriesId];

      if (itemSeries == null) {
        return null;
      }

      const xAxis = xAxes.axis[itemSeries.xAxisId ?? xAxes.axisIds[0]];
      const yAxis = yAxes.axis[itemSeries.yAxisId ?? yAxes.axisIds[0]];

      if (
        xAxis === undefined ||
        yAxis === undefined ||
        !isBandScaleConfig(xAxis) ||
        !isBandScaleConfig(yAxis)
      ) {
        return null;
      }

      const x = getOrdinalBandStartMapper(xAxis.scale, xAxis.data ?? [])(identifier.xIndex);
      const y = getOrdinalBandStartMapper(yAxis.scale, yAxis.data ?? [])(identifier.yIndex);

      if (x === undefined || y === undefined) {
        return null;
      }

      const width = xAxis.scale.bandwidth();
      const height = yAxis.scale.bandwidth();

      switch (placement) {
        case 'bottom':
          return { x: x + width / 2, y: y + height };
        case 'left':
          return { x, y: y + height / 2 };
        case 'right':
          return { x: x + width, y: y + height / 2 };
        case 'top':
        default:
          return { x: x + width / 2, y };
      }
    },
  );
