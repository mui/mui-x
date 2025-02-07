'use client';
import { useCartesianContext } from '../context/CartesianProvider';
import { AxisId } from '../models/axis';

/**
 * Get the X axis.
 * @param {AxisId | undefined} axisId - If provided returns the x axis with axisId, else returns the values for the default x axis.
 * @returns The X axis.
 */
export function useXAxis(axisId?: AxisId) {
  const { xAxis, xAxisIds } = useCartesianContext();

  const id = axisId ?? xAxisIds[0];

  return xAxis[id];
}

/**
 * Get the Y axis.
 * @param {AxisId | undefined} axisId - If provided returns the y axis with axisId, else returns the values for the default y axis.
 * @returns The Y axis.
 */
export function useYAxis(axisId?: AxisId) {
  const { yAxis, yAxisIds } = useCartesianContext();

  const id = axisId ?? yAxisIds[0];

  return yAxis[id];
}
