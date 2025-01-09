'use client';
import { AxisDefaultized } from '../models/axis';
import { useCartesianContext } from '../context/CartesianProvider/useCartesianContext';

import { ZAxisDefaultized } from '../models/z-axis';
import { useZAxis } from '../hooks/useZAxis';
import { ColorLegendSelector } from './colorLegend.types';

/**
 * Helper to select an axis definition according to its direction and id.
 */
export function useAxis({
  axisDirection,
  axisId,
}: ColorLegendSelector): ZAxisDefaultized | AxisDefaultized {
  const { xAxis, xAxisIds, yAxis, yAxisIds } = useCartesianContext();
  const { zAxis, zAxisIds } = useZAxis();

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
