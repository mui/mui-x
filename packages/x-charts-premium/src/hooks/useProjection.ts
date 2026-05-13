'use client';
import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { useStore } from '@mui/x-charts/internals';
import {
  selectorChartProjection,
  type UseGeoProjectionSignature,
} from '../internals/plugins/useGeoProjection';

/**
 * Get the projection registered with the geo chart, resolved against d3-geo and
 * fitted to the chart's drawing area.
 *
 * Returns `null` when no projection has been configured or when the configured
 * name is not a known d3-geo projection.
 */
export function useProjection(): GeoProjection | null {
  const store = useStore<[UseGeoProjectionSignature]>();
  return store.use(selectorChartProjection);
}
