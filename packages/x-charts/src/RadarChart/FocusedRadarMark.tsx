'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useRadarSeriesData } from './RadarSeriesPlot/useRadarSeriesData';

export function FocusedRadarMark(props: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();

  const seriesCoordinates = useRadarSeriesData(focusedItem?.seriesId);
  if (!focusedItem || focusedItem.type !== 'radar' || seriesCoordinates.length === 0) {
    return null;
  }

  const point = seriesCoordinates[0].points[focusedItem.dataIndex];

  return (
    <rect
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      x={point.x - 6}
      y={point.y - 6}
      width={2 * 6}
      height={2 * 6}
      rx={3}
      ry={3}
      {...props}
    />
  );
}
