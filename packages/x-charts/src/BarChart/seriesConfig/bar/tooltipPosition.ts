import { createSelectorMemoized } from '@mui/x-internals/store';
import { createGetBarDimensions } from '../../../internals/createGetBarDimensions';
import { selectorChartsTooltipItem } from '../../../internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.selectors';
import { selectorChartSeriesProcessed } from '../../../internals/plugins/corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import type { TooltipItemPositionSelector } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

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
    /**
     * The preferred placement of the tooltip related to the element.
     * @default 'top'
     */
    placement: 'top' | 'bottom' | 'left' | 'right' | undefined,
  ) {
    if (!identifier || identifier.type !== 'bar' || identifier.dataIndex === undefined) {
      return null;
    }

    const itemSeries = series.bar?.series[identifier.seriesId];

    if (!series.bar || !itemSeries) {
      return null;
    }

    const xAxisId = itemSeries.xAxisId ?? xAxes.axisIds[0];
    const yAxisId = itemSeries.yAxisId ?? yAxes.axisIds[0];

    const groupIndex = series.bar.stackingGroups.findIndex((group) =>
      group.ids.includes(itemSeries.id),
    );

    const dimensions = createGetBarDimensions({
      verticalLayout: itemSeries.layout === 'vertical',
      xAxisConfig: xAxes.axis[xAxisId],
      yAxisConfig: yAxes.axis[yAxisId],
      series: itemSeries,
      numberOfGroups: series.bar.stackingGroups.length,
    })(identifier.dataIndex, groupIndex);

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
