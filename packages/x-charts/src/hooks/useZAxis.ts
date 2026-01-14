'use client';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartZAxis,
  type UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';

export function useZAxes() {
  const store = useStore<[UseChartZAxisSignature]>();
  const { axis: zAxis, axisIds: zAxisIds } = store.use(selectorChartZAxis) ?? {
    axis: {},
    axisIds: [],
  };

  return { zAxis, zAxisIds };
}

export function useZAxis(identifier?: number | string) {
  const { zAxis, zAxisIds } = useZAxes();

  const id = typeof identifier === 'string' ? identifier : zAxisIds[identifier ?? 0];

  return zAxis[id];
}
