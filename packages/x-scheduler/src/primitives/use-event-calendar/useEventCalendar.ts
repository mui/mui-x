'use client';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useAdapter } from '../utils/adapter/useAdapter';
import { EventCalendarStore } from './EventCalendarStore';
import { EventCalendarParameters } from './useEventCalendar.types';

export function useEventCalendar(parameters: EventCalendarParameters): EventCalendarStore {
  const adapter = useAdapter();
  const store = useRefWithInit(() => EventCalendarStore.create(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  return store;
}
