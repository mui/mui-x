'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
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
  const adapter = useAdapter();
  const ResolvedStoreClass = StoreClass ?? EventCalendarStore;
  const store = useRefWithInit(() => new ResolvedStoreClass(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
