import { useCartesianContext } from '../context/CartesianProvider';
import { isBandScale } from '../internals/isBandScale';
import { AxisScaleConfig, D3Scale, ScaleName } from '../models/axis';

/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
export function getValueToPositionMapper(scale: D3Scale) {
  if (isBandScale(scale)) {
    return (value: any) => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }
  return (value: any) => scale(value) as number;
}

export function useXScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleConfig[S]['scale'] {
  const { xAxis, xAxisIds } = useCartesianContext();

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id].scale;
}

export function useYScale<S extends ScaleName>(
  identifier?: number | string,
): AxisScaleConfig[S]['scale'] {
  const { yAxis, yAxisIds } = useCartesianContext();

  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];

  return yAxis[id].scale;
}
