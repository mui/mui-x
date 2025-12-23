'use client';
import { isOrdinalScale } from '../internals/scaleGuards';
import { type AxisId, type AxisScaleConfig, type D3Scale, type ScaleName } from '../models/axis';
import { useRadiusAxis, useRotationAxis, useXAxis, useYAxis } from './useAxis';

/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param {D3Scale} scale The scale to use
 * @returns {(value: any) => number} A function that map value to their position
 */
export function getValueToPositionMapper<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
>(scale: D3Scale<Domain, Range>): (value: any) => number {
  if (isOrdinalScale(scale)) {
    return (value: any) => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }

  const domain = scale.domain();

  // Fixes https://github.com/mui/mui-x/issues/18999#issuecomment-3173787401
  if (domain[0] === domain[1]) {
    return (value: any) => (value === domain[0] ? scale(value) : NaN);
  }

  return (value: any) => scale(value) as number;
}

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
