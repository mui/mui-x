'use client';
import * as React from 'react';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import useLazyRef from '@mui/utils/useLazyRef';
import { warnOnce } from '@mui/x-internals/warning';
import type { EventTimelinePremiumStoreFeatures } from '@mui/x-scheduler-internals-premium/internals';
import type { EventTimelinePremiumFeatures } from './EventTimelinePremiumFeatures.types';

function hasChanged(frozen: EventTimelinePremiumFeatures, current: EventTimelinePremiumFeatures) {
  const keys = new Set([...Object.keys(frozen), ...Object.keys(current)]);
  for (const key of keys) {
    if (
      frozen[key as keyof EventTimelinePremiumFeatures] !==
      current[key as keyof EventTimelinePremiumFeatures]
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Reads the features once, on mount, and derives the features of the store from them.
 */
export function useFrozenEventTimelinePremiumFeatures(
  features: EventTimelinePremiumFeatures | undefined,
): {
  features: EventTimelinePremiumFeatures;
  storeFeatures: EventTimelinePremiumStoreFeatures;
} {
  const frozen = useLazyRef(() => {
    const value: EventTimelinePremiumFeatures = features ?? EMPTY_OBJECT;
    return {
      features: value,
      storeFeatures: {
        recurringEvents: value.recurringEvents?.store,
        dependencies: value.dependencies?.store,
      },
    };
  }).current;

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      hasChanged(frozen.features, features ?? EMPTY_OBJECT)
    ) {
      warnOnce(
        [
          'MUI X Scheduler: The `features` prop of <EventTimelinePremium /> changed after the first render.',
          'The features are read once when the component mounts, so the change is ignored.',
          'Pass stable feature values, or remount the component (for example, with a `key`) to apply the change.',
        ].join('\n'),
      );
    }
  }, [frozen, features]);

  return frozen;
}
