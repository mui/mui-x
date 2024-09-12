'use client';
import { useCartesianContext } from '../context/CartesianProvider';
import { useRadialContext } from '../context/RadialProvider';

export function useXAxis(identifier?: number | string) {
  const { xAxis, xAxisIds } = useCartesianContext();

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id];
}

export function useYAxis(identifier?: number | string) {
  const { yAxis, yAxisIds } = useCartesianContext();

  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];

  return yAxis[id];
}

export function useRadiusAxis(identifier?: number | string) {
  const { radiusAxis, radiusAxisIds } = useRadialContext();

  const id = typeof identifier === 'string' ? identifier : radiusAxisIds[identifier ?? 0];

  return radiusAxis[id];
}

export function useRotationAxis(identifier?: number | string) {
  const { rotationAxis, rotationAxisIds } = useRadialContext();

  const id = typeof identifier === 'string' ? identifier : rotationAxisIds[identifier ?? 0];

  return rotationAxis[id];
}
