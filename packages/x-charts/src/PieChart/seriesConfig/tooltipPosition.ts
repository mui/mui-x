import { createSelectorMemoized } from '@mui/x-internals/store';
import { findMinMax } from '../../internals/findMinMax';
import { selectorChartsTooltipItem } from '../../internals/plugins/featurePlugins/useChartTooltip/useChartTooltip.selectors';
import {
  selectorChartSeriesProcessed,
  selectorChartSeriesLayout,
} from '../../internals/plugins/corePlugins/useChartSeries';
import type { TooltipItemPositionSelector } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

export const selectorTooltipItemPosition: TooltipItemPositionSelector = createSelectorMemoized(
  selectorChartsTooltipItem,
  selectorChartSeriesProcessed,
  selectorChartSeriesLayout,
  function selectorTooltipItemPosition(
    identifier,
    series,
    seriesLayout,
    placement: 'top' | 'bottom' | 'left' | 'right' | undefined,
  ) {
    if (!identifier || identifier.type !== 'pie' || identifier.dataIndex === undefined) {
      return null;
    }

    const itemSeries = series.pie?.series[identifier.seriesId];
    const layout = seriesLayout.pie?.[identifier.seriesId];

    if (itemSeries == null || layout == null) {
      return null;
    }

    const { center, radius } = layout;

    const { data } = itemSeries;

    const dataItem = data[identifier.dataIndex];
    if (!dataItem) {
      return null;
    }

    // Compute the 4 corner points of the arc to get the bounding box.
    const points = [
      [radius.inner, dataItem.startAngle],
      [radius.inner, dataItem.endAngle],
      [radius.outer, dataItem.startAngle],
      [radius.outer, dataItem.endAngle],
    ].map(([r, angle]) => ({
      x: center.x + r * Math.sin(angle),
      y: center.y - r * Math.cos(angle),
    }));

    const [x0, x1] = findMinMax(points.map((p) => p.x));
    const [y0, y1] = findMinMax(points.map((p) => p.y));

    switch (placement) {
      case 'bottom':
        return { x: (x1 + x0) / 2, y: y1 };
      case 'left':
        return { x: x0, y: (y1 + y0) / 2 };
      case 'right':
        return { x: x1, y: (y1 + y0) / 2 };
      case 'top':
      default:
        return { x: (x1 + x0) / 2, y: y0 };
    }
  },
);
