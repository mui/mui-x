'use client';
import { useChartStore } from '@mui/x-charts/internals';
import { useStore } from '@mui/x-internals/store';
import { selectorChartZoomIsInteracting } from '../../internals/plugins/useChartProZoom';
import { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom/useChartProZoom.types';

/**
 * Get access to the zoom state.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
export function useIsZoomInteracting(): boolean {
  const store = useChartStore<[UseChartProZoomSignature]>();
  const isInteracting = useStore(store, selectorChartZoomIsInteracting);

  return isInteracting;
}
