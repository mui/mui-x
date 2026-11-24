'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useDisposable } from '@mui/x-internals/useDisposable';
import { EventCalendarPremiumStore } from './EventCalendarPremiumStore';
import type { EventCalendarPremiumStoreParameters } from './EventCalendarPremiumStore.types';

export function useEventCalendarPremium<TEvent extends object, TResource extends object>(
  parameters: EventCalendarPremiumStoreParameters<TEvent, TResource>,
): EventCalendarPremiumStore<TEvent, TResource> {
  const store = useDisposable(() => new EventCalendarPremiumStore(parameters));

  useIsoLayoutEffect(() => store.updateStateFromParameters(parameters), [store, parameters]);

  return store;
}
