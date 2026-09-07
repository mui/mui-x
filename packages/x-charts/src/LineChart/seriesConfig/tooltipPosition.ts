import { createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartsTooltipItem } from '../../internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.selectors';
import { selectorChartSeriesProcessed } from '../../internals/plugins/corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import type { TooltipItemPositionSelector } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

export const selectorTooltipItemPosition: TooltipItemPositionSelector<'line'> =
  createSelectorMemoized(
    selectorChartsTooltipItem,
    selectorChartSeriesProcessed,
    selectorChartXAxis,
    selectorChartYAxis,
    function selectorTooltipItemPosition(identifier, series, xAxes, yAxes) {
      if (!identifier || identifier.type !== 'line' || identifier.dataIndex === undefined) {
        return null;
      }

      const itemSeries = series.line?.series[identifier.seriesId];

      if (itemSeries == null) {
        return null;
      }

      const xAxis = xAxes.axis[itemSeries.xAxisId ?? xAxes.axisIds[0]];
      const yAxis = yAxes.axis[itemSeries.yAxisId ?? yAxes.axisIds[0]];

      if (xAxis === undefined || yAxis === undefined) {
        return null;
      }

      const xValue = xAxis.data?.[identifier.dataIndex];
      const yValue =
        itemSeries.data[identifier.dataIndex] == null
          ? null
          : itemSeries.visibleStackedData[identifier.dataIndex][1];

      if (xValue == null || yValue == null) {
        return null;
      }

      return {
        x: xAxis.scale(xValue)!,
        y: yAxis.scale(yValue)!,
      };
    },
  );
