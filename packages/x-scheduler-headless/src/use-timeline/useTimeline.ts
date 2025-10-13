'use client';
import { useOnMount } from '@base-ui-components/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useAdapter } from '../use-adapter/useAdapter';
import { TimelineStore } from './TimelineStore';
import { TimelineParameters } from './TimelineStore.types';

export function useTimeline<TEvent extends object, TResource extends object>(
  parameters: TimelineParameters<TEvent, TResource>,
): TimelineStore<TEvent, TResource> {
  const adapter = useAdapter();
  const store = useRefWithInit(() => new TimelineStore(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  useOnMount(store.disposeEffect);

  return store;
}
