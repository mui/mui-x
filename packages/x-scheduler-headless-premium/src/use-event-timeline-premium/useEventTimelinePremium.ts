'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { EventTimelinePremiumStore } from './EventTimelinePremiumStore';
import { EventTimelinePremiumParameters } from './EventTimelinePremiumStore.types';

export function useEventTimelinePremium<TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
): EventTimelinePremiumStore<TEvent, TResource> {
  const adapter = useAdapter();
  const store = useRefWithInit(() => new EventTimelinePremiumStore(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
