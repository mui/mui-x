'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { getValueToPositionMapper, useScatterSeriesContext, useXAxes, useYAxes } from '../hooks';

export function FocusedScatterMark(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const scatterSeries = useScatterSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (focusedItem === null || focusedItem.type !== 'scatter' || !scatterSeries) {
    return null;
  }

  const series = scatterSeries?.series[focusedItem.seriesId];

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];

  const getXPosition = getValueToPositionMapper(xAxis[xAxisId].scale);
  const getYPosition = getValueToPositionMapper(yAxis[yAxisId].scale);

  const scatterPoint = series.data[focusedItem.dataIndex];
  const x = getXPosition(scatterPoint.x);
  const y = getYPosition(scatterPoint.y);
  const size = series.markerSize + 3;

  return (
    <rect
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      x={x - size}
      y={y - size}
      width={2 * size}
      height={2 * size}
      rx={3}
      ry={3}
      {...props}
    />
  );
}
