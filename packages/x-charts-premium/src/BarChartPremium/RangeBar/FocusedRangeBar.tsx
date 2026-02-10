'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { createGetRangeBarDimensions } from './createGetRangeBarDimensions';
import { useRangeBarSeriesContext } from '../../hooks/useRangeBarSeries';

export function FocusedRangeBar(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const rangeBarSeries = useRangeBarSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (focusedItem === null || focusedItem.type !== 'rangeBar' || !rangeBarSeries) {
    return null;
  }

  const series = rangeBarSeries.series[focusedItem.seriesId];

  if (series.data[focusedItem.dataIndex] == null) {
    // Handle missing data
    return null;
  }

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];

  const xAxisConfig = xAxis[xAxisId];
  const yAxisConfig = yAxis[yAxisId];

  const verticalLayout = rangeBarSeries.series[focusedItem.seriesId].layout === 'vertical';

  const groupIndex = rangeBarSeries.seriesOrder.findIndex(
    (seriesId) => seriesId === focusedItem.seriesId,
  );

  const barDimensions = createGetRangeBarDimensions({
    verticalLayout,
    xAxisConfig,
    yAxisConfig,
    series,
    numberOfGroups: rangeBarSeries.seriesOrder.length,
  })(focusedItem.dataIndex, groupIndex);

  if (barDimensions === null) {
    return null;
  }

  const { x, y, height, width } = barDimensions;
  return (
    <rect
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      x={x - 3}
      y={y - 3}
      width={width + 6}
      height={height + 6}
      rx={3}
      ry={3}
      {...props}
    />
  );
}
