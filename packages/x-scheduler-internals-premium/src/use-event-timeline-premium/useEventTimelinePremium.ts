'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useInstance } from '@mui/x-internals/useInstance';
import { useAdapter } from '@mui/x-scheduler-internals/use-adapter';
import { EventTimelinePremiumStore } from './EventTimelinePremiumStore';
import { EventTimelinePremiumParameters } from './EventTimelinePremiumStore.types';

export function useEventTimelinePremium<TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
): EventTimelinePremiumStore<TEvent, TResource> {
  const adapter = useAdapter(parameters.dateLocale);
  const store = useInstance(() => new EventTimelinePremiumStore(parameters, adapter));

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  return store;
}
