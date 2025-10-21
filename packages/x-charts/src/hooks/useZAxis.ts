'use client';
import { useStore } from '@mui/x-internals/store';
import { useChartStore } from '../internals/store/useChartStore';
import {
  selectorChartZAxis,
  UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';

export function useZAxes() {
  const store = useChartStore<[UseChartZAxisSignature]>();
  const { axis: zAxis, axisIds: zAxisIds } = useStore(store, selectorChartZAxis) ?? {
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
