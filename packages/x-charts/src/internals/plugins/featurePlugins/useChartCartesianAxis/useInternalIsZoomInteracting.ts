'use client';
import { useStore } from '../../../store/useStore';
import { selectorChartZoomIsInteracting } from './useChartCartesianAxisRendering.selectors';
import { type UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';

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
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const isInteracting = store.use(selectorChartZoomIsInteracting);

  return isInteracting;
}
