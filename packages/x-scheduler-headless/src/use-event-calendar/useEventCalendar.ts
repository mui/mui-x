'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useAdapter } from '../use-adapter/useAdapter';
import { EventCalendarStore } from './EventCalendarStore';
import { EventCalendarParameters } from './EventCalendarStore.types';

export function useEventCalendar<TEvent extends object, TResource extends object>(
  parameters: EventCalendarParameters<TEvent, TResource>,
): EventCalendarStore<TEvent, TResource> {
  const adapter = useAdapter();
  const store = useRefWithInit(() => new EventCalendarStore(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
