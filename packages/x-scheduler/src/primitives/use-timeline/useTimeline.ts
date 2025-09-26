'use client';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useAdapter } from '../utils/adapter/useAdapter';
import { TimelineStore } from './TimelineStore';
import { TimelineParameters } from './TimelineStore.types';

export function useTimeline(parameters: TimelineParameters): TimelineStore {
  const adapter = useAdapter();
  const store = useRefWithInit(() => new TimelineStore(parameters, adapter)).current;

  useIsoLayoutEffect(
    () => store.updateStateFromParameters(parameters, adapter),
    [store, adapter, parameters],
  );

  return store;
}
