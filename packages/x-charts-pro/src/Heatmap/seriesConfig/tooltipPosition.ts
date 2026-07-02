import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  isBandScaleConfig,
  selectorChartsTooltipItem,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import type { TooltipItemPositionSelector } from '@mui/x-charts/internals';

export const selectorTooltipItemPosition: TooltipItemPositionSelector<'heatmap'> =
  createSelectorMemoized(
    selectorChartsTooltipItem,
    selectorChartSeriesProcessed,
    selectorChartXAxis,
    selectorChartYAxis,
    function selectorTooltipItemPosition(
      identifier,
      series,
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

      const x = xAxis.scale(xAxis.scale.domain()[identifier.xIndex]);
      const y = yAxis.scale(yAxis.scale.domain()[identifier.yIndex]);

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
