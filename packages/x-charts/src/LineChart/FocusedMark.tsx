'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useLineSeriesContext, useXAxes, useYAxes } from '../hooks';

const RADIUS = 6;
export function FocusedMark() {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const lineSeries = useLineSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (focusedItem === null || focusedItem.seriesType !== 'line' || !lineSeries) {
    return null;
  }

  const series = lineSeries?.series[focusedItem.seriesId];

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];

  return (
    <rect
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      x={xAxis[xAxisId].scale(xAxis[xAxisId].data![focusedItem.dataIndex])! - RADIUS}
      y={yAxis[yAxisId].scale(series.stackedData[focusedItem.dataIndex][1])! - RADIUS}
      width={2 * RADIUS}
      height={2 * RADIUS}
      rx={3}
      ry={3}
    />
  );
}
