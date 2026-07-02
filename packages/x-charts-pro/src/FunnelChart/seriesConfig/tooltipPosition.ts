import { createSelectorMemoized } from '@mui/x-internals/store';
import {
  findMinMax,
  selectorChartsTooltipItem,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import type { TooltipItemPositionSelector } from '@mui/x-charts/internals';
import { createPositionGetter } from '../coordinateMapper';

export const selectorTooltipItemPosition: TooltipItemPositionSelector<'funnel'> =
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
      if (!identifier || identifier.type !== 'funnel' || identifier.dataIndex === undefined) {
        return null;
      }

      const itemSeries = series.funnel?.series[identifier.seriesId];

      if (itemSeries == null) {
        return null;
      }

      const xAxis = xAxes.axis[itemSeries.xAxisId ?? xAxes.axisIds[0]];
      const yAxis = yAxes.axis[itemSeries.yAxisId ?? yAxes.axisIds[0]];

      if (xAxis === undefined || yAxis === undefined) {
        return null;
      }

      const isHorizontal = itemSeries.layout === 'horizontal';
      const baseScaleConfig = isHorizontal ? xAxis : yAxis;

      // FIXME gap should be obtained from the store.
      // Maybe moving it to the series would be a good idea similar to what we do with bar charts and their stackingGroups
      const gap = 0;

      const xPosition = createPositionGetter(xAxis.scale, isHorizontal, gap, baseScaleConfig.data);
      const yPosition = createPositionGetter(yAxis.scale, !isHorizontal, gap, baseScaleConfig.data);

      const allY = itemSeries.dataPoints[identifier.dataIndex].map((v) =>
        yPosition(v.y, identifier.dataIndex, v.stackOffset, v.useBandWidth),
      );
      const allX = itemSeries.dataPoints[identifier.dataIndex].map((v) =>
        xPosition(v.x, identifier.dataIndex, v.stackOffset, v.useBandWidth),
      );

      const [x0, x1] = findMinMax(allX);
      const [y0, y1] = findMinMax(allY);

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
