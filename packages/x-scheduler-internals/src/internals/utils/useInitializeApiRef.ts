'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { SchedulerAnyStore, SchedulerPublicAPI } from '../models/publicAPI';

function initializeInputApiRef<TStore extends SchedulerAnyStore>(
  publicAPI: SchedulerPublicAPI<TStore>,
  apiRef: React.RefObject<Partial<SchedulerPublicAPI<TStore>> | undefined> | undefined,
) {
  if (apiRef != null && apiRef.current == null) {
    apiRef.current = publicAPI;
  }
}

export function useInitializeApiRef<TStore extends SchedulerAnyStore>(
  store: TStore,
  apiRef: React.RefObject<Partial<SchedulerPublicAPI<TStore>> | undefined> | undefined,
) {
  const publicAPI = useRefWithInit(() => store.buildPublicAPI())
    .current as SchedulerPublicAPI<TStore>;
  initializeInputApiRef(publicAPI, apiRef);
}
