'use client';
import * as React from 'react';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { AxisDefaultized } from '../models/axis';
import { ZAxisDefaultized } from '../models/z-axis';
import { ColorLegendSelector } from './legend.types';
import { useXAxes, useYAxes } from '../hooks/useAxis';

/**
 * Helper to select an axis definition according to its direction and id.
 */
export function useAxis({
  axisDirection,
  axisId,
}: ColorLegendSelector): ZAxisDefaultized | AxisDefaultized {
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);

  switch (axisDirection) {
    case 'x': {
      const id = typeof axisId === 'string' ? axisId : xAxisIds[axisId ?? 0];
      return xAxis[id];
    }
    case 'y': {
      const id = typeof axisId === 'string' ? axisId : yAxisIds[axisId ?? 0];
      return yAxis[id];
    }
    case 'z':
    default: {
      const id = typeof axisId === 'string' ? axisId : zAxisIds[axisId ?? 0];
      return zAxis[id];
    }
  }
}
