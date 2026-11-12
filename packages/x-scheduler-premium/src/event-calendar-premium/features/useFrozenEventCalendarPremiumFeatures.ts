'use client';
import type { EventCalendarPremiumStoreFeatures } from '@mui/x-scheduler-internals-premium/internals';
import { useFrozenFeatures } from '../../internals/features/useFrozenFeatures';
import type { StandaloneViewPremiumFeatures } from './EventCalendarPremiumFeatures.types';

function deriveStoreFeatures(
  features: StandaloneViewPremiumFeatures,
): EventCalendarPremiumStoreFeatures {
  return { recurringEvents: features.recurringEvents?.store };
}

/**
 * Reads the features of the Event Calendar and its standalone views once, on mount.
 */
export function useFrozenEventCalendarPremiumFeatures<
  TFeatures extends StandaloneViewPremiumFeatures,
>(features: TFeatures | undefined, componentName: string) {
  return useFrozenFeatures(features, componentName, deriveStoreFeatures);
}
