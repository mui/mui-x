'use client';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { getPrimaryResourceId } from '@mui/x-scheduler-internals/internals';
import type { EventDialogBuiltInFormValues, EventDialogFormValues } from './utils';
import { computeRange } from './utils';

// Gate on the whole hook: only writes to these keys reach the placeholder.
// Must stay in sync with what `computeRange` reads, plus `resourceIds`.
const PLACEHOLDER_KEYS: ReadonlySet<string> = new Set<keyof EventDialogBuiltInFormValues>([
  'startDate',
  'startTime',
  'endDate',
  'endTime',
  'allDay',
  'resourceIds',
]);

/**
 * Returns a function that live-updates the creation placeholder in the store
 * from the form values. No-op when the dialog is not creating an event or when
 * none of the written keys affects the placeholder.
 */
export function usePushPlaceholder() {
  const adapter = useAdapterContext();
  const store = useSchedulerStoreContext();

  return function pushPlaceholder(values: EventDialogFormValues, changedKeys: string[]) {
    // Read the store directly: the callback runs synchronously after each write,
    // and subscribing would re-render the whole dialog on every push.
    const rawPlaceholder = schedulerOccurrencePlaceholderSelectors.value(store.state);
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }
    if (!changedKeys.some((key) => PLACEHOLDER_KEYS.has(key))) {
      return;
    }

    const displayTimezone = schedulerOtherSelectors.displayTimezone(store.state);
    const { start, end, surfaceType } = computeRange(adapter, values, displayTimezone);
    const surfaceTypeToUse = rawPlaceholder.lockSurfaceType
      ? rawPlaceholder.surfaceType
      : surfaceType;

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: surfaceTypeToUse,
      resourceId: getPrimaryResourceId(values.resourceIds),
      start,
      end,
      lockSurfaceType: rawPlaceholder.lockSurfaceType,
    });
  };
}
