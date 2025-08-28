'use client';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useAdapter } from '../utils/adapter/useAdapter';
import { EventCalendarInstance } from './EventCalendarInstance';
import { EventCalendarContextValue, EventCalendarParameters } from './useEventCalendar.types';

export function useEventCalendar(parameters: EventCalendarParameters): EventCalendarContextValue {
  const adapter = useAdapter();
  const { contextValue, updater } = useRefWithInit(() =>
    EventCalendarInstance.create(parameters, adapter),
  ).current;

  useIsoLayoutEffect(() => updater(parameters, adapter), [adapter, parameters]);

  return contextValue;
}
