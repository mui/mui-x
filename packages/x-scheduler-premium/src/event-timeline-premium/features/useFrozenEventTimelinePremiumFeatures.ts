'use client';
import type { EventTimelinePremiumStoreFeatures } from '@mui/x-scheduler-internals-premium/internals';
import { useFrozenFeatures } from '../../internals/features/useFrozenFeatures';
import type { EventTimelinePremiumFeatures } from './EventTimelinePremiumFeatures.types';

function deriveStoreFeatures(
  features: EventTimelinePremiumFeatures,
): EventTimelinePremiumStoreFeatures {
  return {
    recurringEvents: features.recurringEvents?.store,
    dependencies: features.dependencies?.store,
  };
}

/**
 * Reads the features once, on mount, and derives the features of the store from them.
 */
export function useFrozenEventTimelinePremiumFeatures(
  features: EventTimelinePremiumFeatures | undefined,
) {
  return useFrozenFeatures(features, 'EventTimelinePremium', deriveStoreFeatures);
}
