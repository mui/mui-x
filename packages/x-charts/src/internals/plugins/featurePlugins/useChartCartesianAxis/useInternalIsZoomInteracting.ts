'use client';
import { useStore } from '@mui/x-internals/store';
import { useChartStore } from '../../../store/useChartStore';
import { selectorChartZoomIsInteracting } from './useChartCartesianAxisRendering.selectors';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';

/**
 * Check if the zoom is interacting.
 *
 * This should probably be moved/merged to the AnimationContext when we move it to the new API.
 *
 * @ignore Internal hook, similar to the PRO one.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
export function useInternalIsZoomInteracting(): boolean | undefined {
  const store = useChartStore<[UseChartCartesianAxisSignature]>();
  const isInteracting = useStore(store, selectorChartZoomIsInteracting);

  return isInteracting;
}
