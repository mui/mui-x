'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useDisposable } from '@mui/x-internals/useDisposable';
import type { ExtendableEventCalendarStore } from './EventCalendarStore';
import { EventCalendarStore } from './EventCalendarStore';
import type { EventCalendarParameters } from './EventCalendarStore.types';

export type EventCalendarStoreConstructor<
  TEvent extends object = any,
  TResource extends object = any,
> = new (
  parameters: EventCalendarParameters<TEvent, TResource>,
) => ExtendableEventCalendarStore<TEvent, TResource>;

export function useEventCalendar<TEvent extends object, TResource extends object>(
  parameters: EventCalendarParameters<TEvent, TResource>,
  StoreClass?: EventCalendarStoreConstructor<TEvent, TResource>,
): ExtendableEventCalendarStore<TEvent, TResource> {
  const ResolvedStoreClass = StoreClass ?? EventCalendarStore;
  const store = useDisposable(() => new ResolvedStoreClass(parameters));

  useIsoLayoutEffect(() => store.updateStateFromParameters(parameters), [store, parameters]);

  return store;
}
