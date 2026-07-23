'use client';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import type { ControlledValue } from './utils';
import { computeRange } from './utils';

/**
 * Returns a function that live-updates the creation placeholder in the store
 * from the next form values. No-op when the dialog is not creating an event.
 */
export function usePushPlaceholder() {
  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);

  return function pushPlaceholder(next: ControlledValue) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }

    const { start, end, surfaceType } = computeRange(adapter, next, displayTimezone);
    const surfaceTypeToUse = rawPlaceholder.lockSurfaceType
      ? rawPlaceholder.surfaceType
      : surfaceType;

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: surfaceTypeToUse,
      resourceId: next.resourceId,
      start,
      end,
      lockSurfaceType: rawPlaceholder.lockSurfaceType,
    });
  };
}
