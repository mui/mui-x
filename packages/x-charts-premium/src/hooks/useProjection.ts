'use client';
import { useStore } from '@mui/x-charts/internals';
import {
  selectorChartRawProjection,
  type GeoProjectionInput,
  type UseGeoProjectionSignature,
} from '../internals/plugins/useGeoProjection';

/**
 * Get the projection currently registered with the geo chart.
 *
 * The returned value is whatever was passed to the `projection` prop — either a d3-geo
 * projection name (e.g. `'mercator'`) or a `GeoProjection` instance. Returns `null` when
 * no projection has been configured.
 */
export function useProjection(): GeoProjectionInput | null {
  const store = useStore<[UseGeoProjectionSignature]>();
  return store.use(selectorChartRawProjection);
}
