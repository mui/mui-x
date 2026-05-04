'use client';
import * as React from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { UnstableTemporalAdapterDateFns } from '../base-ui-copy/temporal-adapter-date-fns';
import {
  SchedulerStoreContext,
  SchedulerStoreInContext,
} from '../use-scheduler-store-context/useSchedulerStoreContext';
import type { Adapter } from '../use-adapter/useAdapter.types';

const DEFAULT_ADAPTER = new UnstableTemporalAdapterDateFns();

const getAdapter = (state: { adapter: Adapter }) => state.adapter;

/**
 * Reads the adapter from the nearest scheduler store context.
 * Use this in child components instead of `useAdapter()`.
 * Falls back to the default adapter when used outside a store context (e.g. in unit tests).
 */
export function useAdapterContext() {
  const store = React.useContext(SchedulerStoreContext) as SchedulerStoreInContext<any, any> | null;

  const subscribe = React.useCallback(
    (cb: () => void) => (store ? store.subscribe(cb) : () => {}),
    [store],
  );
  const getSnapshot = React.useCallback(
    () => (store ? getAdapter(store.state) : DEFAULT_ADAPTER),
    [store],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
