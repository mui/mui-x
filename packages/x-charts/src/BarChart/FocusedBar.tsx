'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useBarSeriesContext, useXAxes, useYAxes } from '../hooks';
import { createGetBarDimensions } from '../internals/getBarDimensions';

export function FocusedBar(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const barSeries = useBarSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (focusedItem === null || focusedItem.type !== 'bar' || !barSeries) {
    return null;
  }

  const series = barSeries.series[focusedItem.seriesId];

  if (series.data[focusedItem.dataIndex] == null) {
    // Handle missing data
    return null;
  }

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];

  const xAxisConfig = xAxis[xAxisId];
  const yAxisConfig = yAxis[yAxisId];

  const verticalLayout = barSeries.series[focusedItem.seriesId].layout === 'vertical';

  const groupIndex = barSeries.stackingGroups.findIndex((group) =>
    group.ids.includes(focusedItem.seriesId),
  );

  const barDimensions = createGetBarDimensions({
    verticalLayout,
    xAxisConfig,
    yAxisConfig,
    series,
    numberOfGroups: barSeries.stackingGroups.length,
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
