'use client';
import { selectorChartRawXAxis } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartRawRotationAxis,
  UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

/**
 * @internals
 *
 * Get the coordinate system implemented.
 * The hook assumes polar and cartesian are never implemented at the same time.
 * @returns The coordinate system
 */
export function useAxisSystem(): 'none' | 'polar' | 'cartesian' {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const rawRotationAxis = useSelector(store, selectorChartRawRotationAxis);
  const rawXAxis = useSelector(store, selectorChartRawXAxis);

  if (rawRotationAxis !== undefined) {
    return 'polar';
  }
  if (rawXAxis !== undefined) {
    return 'cartesian';
  }
  return 'none';
}
