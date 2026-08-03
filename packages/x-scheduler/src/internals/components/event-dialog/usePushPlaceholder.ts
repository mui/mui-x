'use client';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventDialogFormValues } from './utils';
import { computeRange } from './utils';

const PLACEHOLDER_KEYS = new Set([
  'startDate',
  'startTime',
  'endDate',
  'endTime',
  'allDay',
  'resourceId',
]);

/**
 * Returns a function that live-updates the creation placeholder in the store
 * from the form values. No-op when the dialog is not creating an event or when
 * none of the written keys affects the placeholder.
 */
export function usePushPlaceholder() {
  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);

  return function pushPlaceholder(values: Record<string, unknown>, changedKeys: string[]) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }
    if (!changedKeys.some((key) => PLACEHOLDER_KEYS.has(key))) {
      return;
    }

    const next = values as EventDialogFormValues;
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
