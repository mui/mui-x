'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useInstance } from '@mui/x-internals/useInstance';
import { useAdapter } from '../use-adapter/useAdapter';
import { EventCalendarStore, ExtendableEventCalendarStore } from './EventCalendarStore';
import { EventCalendarParameters } from './EventCalendarStore.types';
import { Adapter } from '../use-adapter/useAdapter.types';

export type EventCalendarStoreConstructor<
  TEvent extends object = any,
  TResource extends object = any,
> = new (
  parameters: EventCalendarParameters<TEvent, TResource>,
  adapter: Adapter,
) => ExtendableEventCalendarStore<TEvent, TResource>;

export function useEventCalendar<TEvent extends object, TResource extends object>(
  parameters: EventCalendarParameters<TEvent, TResource>,
  StoreClass?: EventCalendarStoreConstructor<TEvent, TResource>,
): ExtendableEventCalendarStore<TEvent, TResource> {
  const adapter = useAdapter(parameters.dateLocale);
  const ResolvedStoreClass = StoreClass ?? EventCalendarStore;
  const store = useInstance(() => new ResolvedStoreClass(parameters, adapter));

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  return store;
}
