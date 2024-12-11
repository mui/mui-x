'use client';
import { useSelector, useStore } from '@mui/x-charts/internals';
import { selectorChartZoomIsInteracting } from '../../internals/plugins/useChartProZoom';

/**
 * Get access to the zoom state.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
export function useZoomIsInteracting(): boolean {
  const store = useStore<[UseChartProCartesianAxisSignature]>();
  const isInteracting = useSelector(store, selectorChartZoomIsInteracting);

  return isInteracting;
}
