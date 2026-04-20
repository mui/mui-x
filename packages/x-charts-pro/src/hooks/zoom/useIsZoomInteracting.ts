'use client';
import { useStore } from '@mui/x-charts/internals';
import { selectorChartZoomIsInteracting } from '../../internals/plugins/useChartProZoom';
import { type UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom/useChartProZoom.types';

/**
 * Get access to the zoom state.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
export function useIsZoomInteracting(): boolean {
  const store = useStore<[UseChartProZoomSignature]>();
  const isInteracting = store.use(selectorChartZoomIsInteracting);

  return isInteracting;
}
