'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useDisposable } from '@mui/x-internals/useDisposable';
import { EventTimelinePremiumStore } from './EventTimelinePremiumStore';
import type { EventTimelinePremiumStoreParameters } from './EventTimelinePremiumStore.types';

export function useEventTimelinePremium<TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumStoreParameters<TEvent, TResource>,
): EventTimelinePremiumStore<TEvent, TResource> {
  const store = useDisposable(() => new EventTimelinePremiumStore(parameters));

  useIsoLayoutEffect(() => store.updateStateFromParameters(parameters), [store, parameters]);

  return store;
}
