'use client';
import type { ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { useStore } from '@mui/x-charts/internals';
import { selectorChartGeoData } from '../internals/plugins/useGeoProjection';
import type { UseGeoProjectionSignature } from '../internals/plugins/useGeoProjection';

/**
 * Get the GeoJSON `FeatureCollection` currently registered with the geo chart,
 * or `null` when no `geoData` has been configured.
 */
export function useGeoData(): ExtendedFeatureCollection | null {
  const store = useStore<[UseGeoProjectionSignature]>();
  return store.use(selectorChartGeoData);
}
