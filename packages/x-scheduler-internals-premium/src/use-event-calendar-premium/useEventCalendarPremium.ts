'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useInstance } from '@mui/x-internals/useInstance';
import { useAdapter } from '@mui/x-scheduler-internals/use-adapter';
import { EventCalendarPremiumStore } from './EventCalendarPremiumStore';
import { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

export function useEventCalendarPremium<TEvent extends object, TResource extends object>(
  parameters: EventCalendarPremiumParameters<TEvent, TResource>,
): EventCalendarPremiumStore<TEvent, TResource> {
  const adapter = useAdapter(parameters.dateLocale);
  const store = useInstance(() => new EventCalendarPremiumStore(parameters, adapter));

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  return store;
}
