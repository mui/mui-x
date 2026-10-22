import * as React from 'react';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import type { TemporalAdapter } from '@base-ui/react/internals/temporal';
import type { TemporalSupportedObject } from '../models';
import type { DateLocale } from './useAdapter.types';
import { getIsoDayOfWeek } from '../internals/utils/base-temporal/iso';
import { getAdapterDayNumber } from '../internals/utils/plain-date-utils/adapter';

const DEFAULT_ADAPTER = new TemporalAdapterDateFns();

// TODO: Replace with Base UI adapter when available.
export function useAdapter(dateLocale?: DateLocale) {
  return React.useMemo(
    () => (dateLocale ? new TemporalAdapterDateFns({ locale: dateLocale }) : DEFAULT_ADAPTER),
    [dateLocale],
  );
}

/**
 * Checks if the given day number is a weekend (Saturday or Sunday).
 */
export function isWeekendDay(dayNumber: number): boolean {
  // ISO weekdays 6 and 7 are Saturday and Sunday.
  return getIsoDayOfWeek(dayNumber) >= 6;
}

/**
 * Checks if the given date is a weekend (Saturday or Sunday), in its own timezone.
 */
export function isWeekend(adapter: TemporalAdapter, value: TemporalSupportedObject): boolean {
  return isWeekendDay(getAdapterDayNumber(adapter, value));
}
