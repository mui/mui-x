'use client';
import { useStore } from '@mui/x-internals/store';
import { selectorChartRawXAxis } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartRawRotationAxis,
  UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';

import { useChartStore } from '../internals/store/useChartStore';

/**
 * @internals
 *
 * Get the coordinate system implemented.
 * The hook assumes polar and cartesian are never implemented at the same time.
 * @returns The coordinate system
 */
export function useAxisSystem(): 'none' | 'polar' | 'cartesian' {
  const store = useChartStore<[UseChartPolarAxisSignature]>();
  const rawRotationAxis = useStore(store, selectorChartRawRotationAxis);
  const rawXAxis = useStore(store, selectorChartRawXAxis);

  if (rawRotationAxis !== undefined) {
    return 'polar';
  }
  if (rawXAxis !== undefined) {
    return 'cartesian';
  }
  return 'none';
}
