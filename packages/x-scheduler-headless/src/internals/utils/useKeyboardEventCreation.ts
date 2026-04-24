'use client';
import { useStore } from '@base-ui/utils/store';
import { SchedulerEventCreationConfig } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors } from '../../scheduler-selectors';
import type { CreationPlaceholderFields } from './useEventCreation';

interface GetKeyboardCreationPlaceholderParams {
  creationConfig: SchedulerEventCreationConfig;
}

/**
 * Hook that returns a function to trigger event creation via keyboard (Enter key).
 * Returns `undefined` when event creation is disabled.
 *
 * This is the keyboard counterpart of `useEventCreation` (which handles mouse clicks).
 * Both call `store.setOccurrencePlaceholder` with the same `type: 'creation'` placeholder.
 */
export function useKeyboardEventCreation(
  getCreationPlaceholder: (
    params: GetKeyboardCreationPlaceholderParams,
  ) => CreationPlaceholderFields,
): (() => void) | undefined {
  const store = useSchedulerStoreContext();
  const creationConfig = useStore(store, schedulerEventSelectors.creationConfig);

  if (creationConfig === false) {
    return undefined;
  }

  return () => {
    store.setOccurrencePlaceholder({
      type: 'creation',
      ...getCreationPlaceholder({ creationConfig }),
    });
  };
}
