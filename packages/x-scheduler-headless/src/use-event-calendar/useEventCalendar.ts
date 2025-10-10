'use client';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useAdapter } from '../use-adapter/useAdapter';
import { EventCalendarStore } from './EventCalendarStore';
import { EventCalendarParameters } from './EventCalendarStore.types';

export function useEventCalendar<TEvent extends {}, TResource extends {}>(
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
