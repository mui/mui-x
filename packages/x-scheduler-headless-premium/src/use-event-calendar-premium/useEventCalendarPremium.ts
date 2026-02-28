'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { EventCalendarPremiumStore } from './EventCalendarPremiumStore';
import { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

export function useEventCalendarPremium<TEvent extends object, TResource extends object>(
  parameters: EventCalendarPremiumParameters<TEvent, TResource>,
): EventCalendarPremiumStore<TEvent, TResource> {
  const adapter = useAdapter();
  const store = useRefWithInit(() => new EventCalendarPremiumStore(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
