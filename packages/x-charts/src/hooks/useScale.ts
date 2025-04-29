'use client';
import { isBandScale } from '../internals/isBandScale';
import { AxisId, AxisScaleConfig, D3Scale, ScaleName } from '../models/axis';
import { useRadiusAxis, useRotationAxis, useXAxis, useYAxis } from './useAxis';

/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param {D3Scale} scale The scale to use
 * @returns {(value: any) => number} A function that map value to their position
 */
export function getValueToPositionMapper(scale: D3Scale): (value: any) => number {
  if (isBandScale(scale)) {
    return (value: any) => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }
  return (value: any) => scale(value) as number;
}

/**
 * Get the X scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns the scale for the x axis with axisId, else returns the values for the default x axis.
 * @returns {AxisScaleConfig[S]['scale']} The scale for the specified X axis.
 */
export function useXScale<S extends ScaleName>(axisId?: AxisId): AxisScaleConfig[S]['scale'] {
  const axis = useXAxis(axisId);

  return axis.scale;
}

/**
 * Get the Y scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns the scale for the y axis with axisId, else returns the values for the default y axis.
 * @returns {AxisScaleConfig[S]['scale']} The scale for the specified Y axis.
 */
export function useYScale<S extends ScaleName>(axisId?: AxisId): AxisScaleConfig[S]['scale'] {
  const axis = useYAxis(axisId);

  return axis.scale;
}

export function useRotationScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleConfig[S]['scale'] | undefined {
  const axis = useRotationAxis(identifier);

  return axis?.scale;
}

export function useRadiusScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleConfig[S]['scale'] | undefined {
  const axis = useRadiusAxis(identifier);

  return axis?.scale;
}
