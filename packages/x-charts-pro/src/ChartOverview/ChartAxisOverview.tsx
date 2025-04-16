import * as React from 'react';
import { AxisId } from '@mui/x-charts/internals';
import { DEFAULT_ZOOM_BRUSH_SIZE } from '@mui/x-charts/constants';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { ChartZoomBrush } from './ChartZoomBrush';

export interface ChartAxisOverviewProps {
  /**
   * The ID of the axis this overview refers to.
   */
  axisId: AxisId;
  /**
   * The direction of the axis.
   */
  axisDirection: 'x' | 'y';
  /**
   * The size of the overview.
   * This represents the height if the axis is an x-axis, or the width if the axis is a y-axis.
   */
  size?: number;
}

export function ChartAxisOverview({
  axisId,
  axisDirection,
  size = DEFAULT_ZOOM_BRUSH_SIZE,
}: ChartAxisOverviewProps) {
  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();

  const axis = axisDirection === 'x' ? xAxis[axisId] : yAxis[axisId];

  if (typeof axis.zoom !== 'object' || !axis.zoom.overview?.enabled) {
    return null;
  }

  return <ChartZoomBrush key={axisId} size={size} axisId={axisId} axisDirection={axisDirection} />;
}
