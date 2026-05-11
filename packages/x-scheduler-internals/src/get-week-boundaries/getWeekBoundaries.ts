import { TemporalSupportedObject } from '../models';
import { TemporalAdapter } from '../base-ui-copy/types';

/**
 * The 1..7 adapter day-number that corresponds to a given JS weekday (0=Sun … 6=Sat).
 * Resolved once per adapter instance via a known-Sunday reference date.
 *
 * getDayOfWeek returns a locale-relative number (1 = locale's first weekday).
 * By probing a known Sunday we anchor the mapping without touching the adapter
 * interface or pulling in date-library internals.
 */
const sundayDayNumberCache = new WeakMap<TemporalAdapter, number>();

function getSundayDayNumber(adapter: TemporalAdapter): number {
  let cached = sundayDayNumberCache.get(adapter);
  if (cached === undefined) {
    // 2025-01-05 is a Sunday; use UTC noon to survive any timezone offset
    const knownSunday = adapter.date('2025-01-05T12:00:00.000Z', 'utc');
    cached = adapter.getDayOfWeek(knownSunday);
    sundayDayNumberCache.set(adapter, cached);
  }
  return cached;
}

/**
 * Returns the start of the week for `date`, using `weekStartsOn` as the first
 * day of the week (0 = Sunday … 6 = Saturday).
 *
 * When `weekStartsOn` is `undefined` the locale default (adapter.startOfWeek)
 * is used unchanged.
 *
 * Uses only the adapter primitives `getDayOfWeek`, `addDays`, and `startOfDay`
 * so it works with any TemporalAdapter implementation.
 */
export function getStartOfWeek(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined,
): TemporalSupportedObject {
  if (weekStartsOn === undefined) {
    return adapter.startOfWeek(date);
  }

  // Adapter day-number for the desired first weekday:
  //   getDayOfWeek(Sunday) = s  (a number in 1..7)
  //   getDayOfWeek(Sunday + k) = ((s - 1 + k) % 7) + 1
  const s = getSundayDayNumber(adapter);
  const targetDayNumber = ((s - 1 + weekStartsOn) % 7) + 1;

  const currentDayNumber = adapter.getDayOfWeek(date); // 1..7
  const delta = (currentDayNumber - targetDayNumber + 7) % 7; // days since target weekday
  return adapter.startOfDay(adapter.addDays(date, -delta));
}

/**
 * Returns the end of the week for `date` (inclusive last moment of the 7th day),
 * using `weekStartsOn` as the first day of the week.
 *
 * When `weekStartsOn` is `undefined` the locale default (adapter.endOfWeek) is used.
 */
export function getEndOfWeek(
  adapter: TemporalAdapter,
  date: TemporalSupportedObject,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined,
): TemporalSupportedObject {
  if (weekStartsOn === undefined) {
    return adapter.endOfWeek(date);
  }

  const weekStart = getStartOfWeek(adapter, date, weekStartsOn);
  return adapter.endOfDay(adapter.addDays(weekStart, 6));
}
