'use client';
import { useSelector, useStore } from '@mui/x-charts/internals';
import { selectorChartZoomIsInteracting } from '../../internals/plugins/useChartProZoom';
import { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom/useChartProZoom.types';

/**
 * Get access to the zoom state.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
export function useIsZoomInteracting(): boolean {
  const store = useStore<[UseChartProZoomSignature]>();
  const isInteracting = useSelector(store, selectorChartZoomIsInteracting);

  return isInteracting;
}
