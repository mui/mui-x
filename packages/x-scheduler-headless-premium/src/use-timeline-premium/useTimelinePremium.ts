'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { TimelinePremiumStore } from './TimelinePremiumStore';
import { TimelinePremiumParameters } from './TimelinePremiumStore.types';

export function useTimelinePremium<TEvent extends object, TResource extends object>(
  parameters: TimelinePremiumParameters<TEvent, TResource>,
): TimelinePremiumStore<TEvent, TResource> {
  const adapter = useAdapter();
  const store = useRefWithInit(() => new TimelinePremiumStore(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
