'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useDisposable } from '@mui/x-internals/useDisposable';
import { useAdapter } from '@mui/x-scheduler-internals/use-adapter';
import { useExternalDragPlaceholderCleanup } from '@mui/x-scheduler-internals/internals';
import { EventCalendarPremiumStore } from './EventCalendarPremiumStore';
import type { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

export function useEventCalendarPremium<TEvent extends object, TResource extends object>(
  parameters: EventCalendarPremiumParameters<TEvent, TResource>,
): EventCalendarPremiumStore<TEvent, TResource> {
  const adapter = useAdapter(parameters.dateLocale);
  const store = useDisposable(() => new EventCalendarPremiumStore(parameters, adapter));

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useExternalDragPlaceholderCleanup(store);

  return store;
}
