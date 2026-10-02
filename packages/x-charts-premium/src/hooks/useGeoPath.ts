'use client';
import type { GeoPath } from '@mui/x-charts-vendor/d3-geo';
import { useStore } from '@mui/x-charts/internals';
import { selectorChartGeoPath } from '../internals/plugins/useGeoProjection';
import type { UseGeoProjectionSignature } from '../internals/plugins/useGeoProjection';

/**
 * Get the geo path registered with the geo chart, resolved against d3-geo and
 * fitted to the chart's drawing area.
 */
export function useGeoPath(): GeoPath | null {
  const store = useStore<[UseGeoProjectionSignature]>();
  return store.use(selectorChartGeoPath);
}
