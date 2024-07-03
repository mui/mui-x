import { useCartesianContext } from '../context/CartesianProvider';

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
