'use client';
import type { AxisId, AxisScaleConfig, ScaleName } from '../models/axis';
import { useRadiusAxis, useRotationAxis, useXAxis, useYAxis } from './useAxis';

/**
 * Get the X scale.
 *
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `xAxis` prop
 *   - Undefined to get the default (first) X axis
 * @returns The X axis scale
 */
export function useXScale<S extends ScaleName>(axisId?: AxisId): AxisScaleConfig[S]['scale'] {
  const axis = useXAxis(axisId);

  return axis.scale;
}

/**
 * Get the Y scale.
 *
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `yAxis` prop
 *   - Undefined to get the default (first) Y axis
 * @returns The Y axis scale
 */
export function useYScale<S extends ScaleName>(axisId?: AxisId): AxisScaleConfig[S]['scale'] {
  const axis = useYAxis(axisId);

  return axis.scale;
}

/**
 * Get the rotation scale.
 *
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `rotationAxis` prop
 *   - Undefined to get the default rotation axis
 * @returns The rotation axis scale, or undefined if not found
 */
export function useRotationScale<S extends ScaleName>(
  axisId?: number | string,
): AxisScaleConfig[S]['scale'] | undefined {
  const axis = useRotationAxis(axisId);

  return axis?.scale;
}

/**
 * Get the radius scale.
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `radiusAxis` prop
 *   - Undefined to get the default radius axis
 * @returns The radius axis scale, or undefined if not found
 */
export function useRadiusScale<S extends ScaleName>(
  axisId?: number | string,
): AxisScaleConfig[S]['scale'] | undefined {
  const axis = useRadiusAxis(axisId);

  return axis?.scale;
}
