import * as React from 'react';
import { AxisId } from '@mui/x-charts/internals';
import { ChartZoomBrush } from './ChartZoomBrush';

export interface ChartsOverviewProps {
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

export function ChartsOverview({ axisId, size = 40 }: ChartsOverviewProps) {
  return <ChartZoomBrush size={size} axisId={axisId} />;
}
