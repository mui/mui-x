import { SchedulerValidDate } from '../models';
import { AdapterLuxon } from './AdapterLuxon';
import { Adapter } from './useAdapter.types';

export const DO_NOT_USE_THIS_VARIABLE_ADAPTER_CLASS = new AdapterLuxon();

// TODO: Replace with Base UI adapter when available.
export function useAdapter() {
  return DO_NOT_USE_THIS_VARIABLE_ADAPTER_CLASS;
}

const MS_MIN = 60 * 1000;
const MS_HOUR = MS_MIN * 60;
const MS_DAY = MS_HOUR * 24;
const MS_WEEK = MS_DAY * 7;

/**
 * Calculate the difference between two dates in the specified unit.
 * TODO: move to adapter (and make sure it works well with DST and timezone).
 */
export function diffIn(
  adapter: Adapter,
  a: SchedulerValidDate,
  b: SchedulerValidDate,
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years',
): number {
  switch (unit) {
    case 'minutes': {
      const msA = adapter.toJsDate(a).getTime();
      const msB = adapter.toJsDate(b).getTime();
      return Math.floor((msA - msB) / MS_MIN);
    }
    case 'hours': {
      const msA = adapter.toJsDate(a).getTime();
      const msB = adapter.toJsDate(b).getTime();
      return Math.floor((msA - msB) / MS_HOUR);
    }
    case 'days': {
      const yA = adapter.getYear(a);
      const mA = adapter.getMonth(a);
      const dA = adapter.getDate(a);
      const yB = adapter.getYear(b);
      const mB = adapter.getMonth(b);
      const dB = adapter.getDate(b);
      const utcA = Date.UTC(yA, mA, dA);
      const utcB = Date.UTC(yB, mB, dB);
      return Math.floor((utcA - utcB) / MS_DAY);
    }
    case 'weeks': {
      const A = adapter.startOfWeek(a);
      const B = adapter.startOfWeek(b);
      const yA = adapter.getYear(A);
      const mA = adapter.getMonth(A);
      const dA = adapter.getDate(A);
      const yB = adapter.getYear(B);
      const mB = adapter.getMonth(B);
      const dB = adapter.getDate(B);
      const utcA = Date.UTC(yA, mA, dA);
      const utcB = Date.UTC(yB, mB, dB);
      return Math.floor((utcA - utcB) / MS_WEEK);
    }
    case 'months': {
      const ya = adapter.getYear(a);
      const yb = adapter.getYear(b);
      const ma = adapter.getMonth(a);
      const mb = adapter.getMonth(b);
      return ya * 12 + ma - (yb * 12 + mb);
    }
    case 'years': {
      return adapter.getYear(a) - adapter.getYear(b);
    }
    default:
      return 0;
  }
}

/**
 * Checks if the given date is a weekend (Saturday or Sunday).
 * TODO: move to adapter.
 */
export function isWeekend(adapter: Adapter, value: SchedulerValidDate): boolean {
  const sunday = adapter.format(adapter.date('2025-08-09'), 'weekday');
  const saturday = adapter.format(adapter.date('2025-08-10'), 'weekday');
  const formattedValue = adapter.format(value, 'weekday');

  return formattedValue === sunday || formattedValue === saturday;
}
