import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  isBandScale,
  isOrdinalScale,
  selectorChartsTooltipItem,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import type { TooltipItemPositionSelector } from '@mui/x-charts/internals';

export const selectorTooltipItemPosition: TooltipItemPositionSelector = createSelectorMemoized(
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
    if (!identifier || identifier.type !== 'ohlc' || identifier.dataIndex === undefined) {
      return null;
    }

    const itemSeries = series.ohlc?.series[identifier.seriesId];

    if (itemSeries == null) {
      return null;
    }

    const xAxis = xAxes.axis[itemSeries.xAxisId ?? xAxes.axisIds[0]];
    const yAxis = yAxes.axis[itemSeries.yAxisId ?? yAxes.axisIds[0]];

    if (xAxis === undefined || yAxis === undefined) {
      return null;
    }

    const datum = itemSeries.data[identifier.dataIndex];

    if (!datum) {
      return null;
    }

    const xScale = xAxis.scale;
    const yScale = yAxis.scale;

    if (!isBandScale(xScale) || isOrdinalScale(yScale)) {
      return null;
    }

    const [, high, low] = datum;

    const x = xScale(xScale.domain()[identifier.dataIndex])!;
    const width = xScale.bandwidth();
    const y = yScale(high);
    const height = yScale(low) - yScale(high);

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
