import { TemporalTimezone, TemporalSupportedObject } from '../../base-ui-copy/types';
import { SchedulerProcessedEvent } from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';

/**
 * Builds an adapter-agnostic format string that produces an ISO 8601 date-time
 * **without** the trailing `Z` (wall-time representation).
 * Produces e.g. `yyyy'-'MM'-'dd'T'HH':'mm':'ss` for date-fns.
 */
export function getWallTimeIsoFormat(adapter: Adapter): string {
  const f = adapter.formats;
  const esc = adapter.escapedCharacters;
  return [
    f.yearPadded,
    esc.start,
    '-',
    esc.end,
    f.monthPadded,
    esc.start,
    '-',
    esc.end,
    f.dayOfMonthPadded,
    esc.start,
    'T',
    esc.end,
    f.hours24hPadded,
    esc.start,
    ':',
    esc.end,
    f.minutesPadded,
    esc.start,
    ':',
    esc.end,
    f.secondsPadded,
  ].join('');
}

/**
 * Converts a `TemporalSupportedObject` back to a string, respecting the
 * original date format: instant strings (ending with `Z`) stay as UTC ISO
 * strings, while wall-time strings (no `Z`) are formatted in the event's
 * data timezone without the `Z` suffix.
 */
export function dateToEventString(
  adapter: Adapter,
  date: TemporalSupportedObject,
  originalString: string,
  dataTimezone: TemporalTimezone,
): string {
  if (originalString.endsWith('Z')) {
    return adapter.toJsDate(date).toISOString();
  }
  const dateInDataTz = adapter.setTimezone(date, dataTimezone);
  return adapter.formatByString(dateInDataTz, getWallTimeIsoFormat(adapter));
}

export function mergeDateAndTime(
  adapter: Adapter,
  dateParam: TemporalSupportedObject,
  timeParam: TemporalSupportedObject,
): TemporalSupportedObject {
  let mergedDate = dateParam;
  mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
  mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
  mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
  mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));

  return mergedDate;
}

/**
 * Returns a string representation of the date.
 * It can be used as key in Maps or passed to the React `key` property when looping through days.
 * It only contains date information, two dates representing the same day but with different time will have the same key.
 */
export function getDateKey(day: TemporalSupportedObject, adapter: Adapter): string {
  return adapter.format(day, 'localizedNumericDate');
}

/**
 * Gets the end date of an event occurrence based on its start date.
 * For now, the occurrence always has the same duration as the original event, even when the DST applies between its start and the end.
 */
export function getOccurrenceEnd({
  event,
  occurrenceStart,
  adapter,
}: {
  event: SchedulerProcessedEvent;
  occurrenceStart: TemporalSupportedObject;
  adapter: Adapter;
}): TemporalSupportedObject {
  const durationMs = event.dataTimezone.end.timestamp - event.dataTimezone.start.timestamp;
  return adapter.addMilliseconds(occurrenceStart, durationMs);
}

/**
 * The 1..7 adapter day-number that corresponds to a given JS weekday (0=Sun … 6=Sat).
 * Resolved once per adapter instance via a known-Sunday reference date.
 *
 * getDayOfWeek returns a locale-relative number (1 = locale's first weekday).
 * By probing a known Sunday we anchor the mapping without touching the adapter
 * interface or pulling in date-library internals.
 */
const sundayDayNumberCache = new WeakMap<Adapter, number>();

function getSundayDayNumber(adapter: Adapter): number {
  let cached = sundayDayNumberCache.get(adapter);
  if (cached === undefined) {
    // 2025-01-05 is a Sunday; use UTC noon to survive any timezone offset
    const knownSunday = adapter.date('2025-01-05', 'UTC');
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
  adapter: Adapter,
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
  adapter: Adapter,
  date: TemporalSupportedObject,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined,
): TemporalSupportedObject {
  if (weekStartsOn === undefined) {
    return adapter.endOfWeek(date);
  }

  const weekStart = getStartOfWeek(adapter, date, weekStartsOn);
  return adapter.endOfDay(adapter.addDays(weekStart, 6));
}

/**
 * Returns the week number for `date`, using `weekStartsOn` as the first day of
 * the week (0 = Sunday … 6 = Saturday).
 */
export function getWeekNumber(
  adapter: Adapter,
  date: TemporalSupportedObject,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined,
): number {
  if (weekStartsOn === undefined) {
    return adapter.getWeekNumber(date);
  }
  const weekStart = getStartOfWeek(adapter, date, weekStartsOn);
  const midWeek = adapter.addDays(weekStart, 3);
  const jan4 = adapter.addDays(adapter.startOfYear(midWeek), 3);
  const week1Start = getStartOfWeek(adapter, jan4, weekStartsOn);
  return adapter.differenceInDays(weekStart, week1Start) / 7 + 1;
}
