import * as React from 'react';
import { fr } from 'date-fns/locale/fr';
import { TemporalSupportedObject } from '../models';
import { UnstableTemporalAdapterDateFns } from '../base-ui-copy/temporal-adapter-date-fns';
import { TemporalAdapter } from '../base-ui-copy/types';
import {
  SchedulerStoreContext,
  SchedulerStoreInContext,
} from '../use-scheduler-store-context/useSchedulerStoreContext';
import type { Adapter, DateLocale } from './useAdapter.types';

const DEFAULT_ADAPTER = new UnstableTemporalAdapterDateFns();

// TODO: Replace with Base UI adapter when available.
export function useAdapter(dateLocale?: DateLocale) {
  return React.useMemo(
    () =>
      dateLocale ? new UnstableTemporalAdapterDateFns({ locale: dateLocale }) : DEFAULT_ADAPTER,
    [dateLocale],
  );
}

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

  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * @internal Test-only helper — creates an English adapter.
 */
export function createTestAdapterEn() {
  return new UnstableTemporalAdapterDateFns();
}

/**
 * @internal Test-only helper — creates a French adapter.
 */
export function createTestAdapterFr() {
  return new UnstableTemporalAdapterDateFns({ locale: fr });
}

/**
 * @internal Test-only helper — exposes the French date-fns locale for use as a `dateLocale` prop value.
 */
export const testDateLocaleFr: DateLocale = fr;

/**
 * Checks if the given date is a weekend (Saturday or Sunday).
 * TODO: move to adapter.
 */
export function isWeekend(adapter: TemporalAdapter, value: TemporalSupportedObject): boolean {
  const sunday = adapter.format(adapter.date('2025-08-09', 'default'), 'weekday');
  const saturday = adapter.format(adapter.date('2025-08-10', 'default'), 'weekday');
  const formattedValue = adapter.format(value, 'weekday');

  return formattedValue === sunday || formattedValue === saturday;
}
