'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useDisposable } from '@mui/x-internals/useDisposable';
import { useAdapter } from '@mui/x-scheduler-internals/use-adapter';
import { EventTimelinePremiumStore } from './EventTimelinePremiumStore';
import type { EventTimelinePremiumParameters } from './EventTimelinePremiumStore.types';

export function useEventTimelinePremium<TEvent extends object, TResource extends object>(
  parameters: EventTimelinePremiumParameters<TEvent, TResource>,
): EventTimelinePremiumStore<TEvent, TResource> {
  const adapter = useAdapter(parameters.dateLocale);
  const store = useDisposable(() => new EventTimelinePremiumStore(parameters, adapter));

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  return store;
}
