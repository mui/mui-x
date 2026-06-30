import * as React from 'react';
import { TemporalAdapter } from '@base-ui/react/internals/temporal';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import { TemporalSupportedObject } from '../models';
import type { DateLocale } from './useAdapter.types';

const DEFAULT_ADAPTER = new TemporalAdapterDateFns();

// TODO: Replace with Base UI adapter when available.
export function useAdapter(dateLocale?: DateLocale) {
  return React.useMemo(
    () => (dateLocale ? new TemporalAdapterDateFns({ locale: dateLocale }) : DEFAULT_ADAPTER),
    [dateLocale],
  );
}

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
