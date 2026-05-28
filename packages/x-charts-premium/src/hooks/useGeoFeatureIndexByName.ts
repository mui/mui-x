'use client';
import { useStore } from '@mui/x-charts/internals';
import {
  selectorChartGeoFeatureIndexesByName,
  type UseGeoProjectionSignature,
} from '../internals/plugins/useGeoProjection';

/**
 * Get a map from `feature.properties.name` to the index of that feature in `geoData.features`.
 *
 * Used to join `mapShape` series data rows to geographic features by name.
 * Returns an empty map when no `geoData` is registered.
 */
export function useGeoFeatureIndexesByName(): ReadonlyMap<string, number[]> {
  const store = useStore<[UseGeoProjectionSignature]>();
  return store.use(selectorChartGeoFeatureIndexesByName);
}
