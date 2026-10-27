'use client';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerEventCreationConfig, TemporalTimezone } from '../../models';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import type { CreationPlaceholderFields } from './useEventCreation';

interface GetKeyboardCreationPlaceholderParams {
  creationConfig: SchedulerEventCreationConfig;
  /**
   * The display timezone, in which the dates of the placeholder are read.
   */
  timezone: TemporalTimezone;
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
): ((event?: Event) => void) | undefined {
  const store = useSchedulerStoreContext();
  const creationConfig = useStore(store, schedulerEventSelectors.creationConfig);

  if (creationConfig === false) {
    return undefined;
  }

  return (event?: Event) => {
    store.setOccurrencePlaceholder(
      {
        type: 'creation',
        ...getCreationPlaceholder({
          creationConfig,
          timezone: schedulerOtherSelectors.displayTimezone(store.state),
        }),
      },
      event,
    );
  };
}
