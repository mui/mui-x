import * as React from 'react';
import { AxisId } from '@mui/x-charts/internals';
import { ChartZoomBrush } from './ChartZoomBrush';

export interface ChartOverviewProps {
  /**
   * The ID of the axis this overview refers to.
   */
  axisId: AxisId;
  /**
   * The size of the overview.
   * This represents the height if the axis is an x-axis, or the width if the axis is a y-axis.
   */
  size?: number;
}

export function ChartOverview({ axisId, size = 30 }: ChartOverviewProps) {
  return <ChartZoomBrush size={size} axisId={axisId} />;
}
