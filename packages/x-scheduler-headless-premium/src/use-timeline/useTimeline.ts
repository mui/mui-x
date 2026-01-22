'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
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
