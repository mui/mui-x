import type { TemporalTimezone, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { getStartOfWeek as getStartOfWeekDayNumber, PlainDate } from './base-temporal/PlainDate';
import {
  buildTemporalPlainDate,
  createEndOfPlainDate,
  createStartOfPlainDate,
} from './plain-date-utils/adapter';
import { plainDateFromDayNumber } from './plain-date-utils/plainDate';

/**
 * Builds an adapter-agnostic format string that produces an ISO 8601 date.
 * Produces e.g. `yyyy'-'MM'-'dd` for date-fns.
 */
export function getIsoDateFormat(adapter: Adapter): string {
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
  ].join('');
}

/**
 * Builds an adapter-agnostic format string that produces an ISO 8601 date-time
 * **without** the trailing `Z` (wall-time representation).
 * Produces e.g. `yyyy'-'MM'-'dd'T'HH':'mm':'ss` for date-fns.
 */
export function getWallTimeIsoFormat(adapter: Adapter): string {
  const f = adapter.formats;
  const esc = adapter.escapedCharacters;
  return [
    getIsoDateFormat(adapter),
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
 * The JS weekday (0=Sun … 6=Sat) of a date, read in its own timezone.
 */
export function getJsDayOfWeek(adapter: Adapter, date: TemporalSupportedObject): number {
  // ISO weekdays go from 1 (Monday) to 7 (Sunday).
  return buildTemporalPlainDate(adapter, date).dayOfWeek % 7;
}

function checkWeekStartsOn(weekStartsOn: WeekStartsOn) {
  if (process.env.NODE_ENV !== 'production') {
    if (
      !Number.isInteger(weekStartsOn) ||
      (weekStartsOn as number) < 0 ||
      (weekStartsOn as number) > 6
    ) {
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: weekStartsOn must be an integer between 0 (Sunday) and 6 (Saturday),` +
          ` but received ${weekStartsOn}.`,
      );
    }
  }
}

/**
 * The first day of the week of `date`, read in its own timezone.
 */
export function getWeekStartPlainDate(
  adapter: Adapter,
  date: TemporalSupportedObject,
  weekStartsOn: WeekStartsOn | undefined,
): PlainDate {
  const plainDate = buildTemporalPlainDate(adapter, date);
  if (weekStartsOn === undefined) {
    // The adapter numbers the days of the week from 1, starting on the first day of the locale.
    return plainDate.add({ days: 1 - adapter.getDayOfWeek(date) });
  }
  checkWeekStartsOn(weekStartsOn);
  // `weekStartsOn` and ISO weekdays agree, except for Sunday (0 and 7), which both accept.
  return plainDateFromDayNumber(getStartOfWeekDayNumber(plainDate.dayNumber, weekStartsOn));
}

/**
 * Returns the start of the week for `date`, using `weekStartsOn` as the first
 * day of the week (0 = Sunday … 6 = Saturday).
 *
 * When `weekStartsOn` is `undefined` the first day of the week of the locale is used.
 */
export function getStartOfWeek(
  adapter: Adapter,
  date: TemporalSupportedObject,
  weekStartsOn: WeekStartsOn | undefined,
): TemporalSupportedObject {
  const weekStartPlainDate = getWeekStartPlainDate(adapter, date, weekStartsOn);
  return createStartOfPlainDate(adapter, weekStartPlainDate, adapter.getTimezone(date));
}

/**
 * Returns the end of the week for `date` (inclusive last moment of the 7th day),
 * using `weekStartsOn` as the first day of the week.
 *
 * When `weekStartsOn` is `undefined` the first day of the week of the locale is used.
 */
export function getEndOfWeek(
  adapter: Adapter,
  date: TemporalSupportedObject,
  weekStartsOn: WeekStartsOn | undefined,
): TemporalSupportedObject {
  const weekEndPlainDate = getWeekStartPlainDate(adapter, date, weekStartsOn).add({ days: 6 });
  return createEndOfPlainDate(adapter, weekEndPlainDate, adapter.getTimezone(date));
}

/**
 * Returns the week number for `date`, using `weekStartsOn` as the first day of
 * the week (0 = Sunday … 6 = Saturday).
 *
 * Applies the ISO 8601 "4-day minimum" rule (the Thursday of each week
 * determines its year) with a parametric first day of the week. When
 * `weekStartsOn` is 1 the result is a standard ISO 8601 week number; for
 * other values it is the same algorithm with a shifted origin.
 */
export function getWeekNumber(
  adapter: Adapter,
  date: TemporalSupportedObject,
  weekStartsOn: WeekStartsOn | undefined,
): number {
  if (weekStartsOn === undefined) {
    return adapter.getWeekNumber(date);
  }
  const weekStartPlainDate = getWeekStartPlainDate(adapter, date, weekStartsOn);
  // The week belongs to the year of its 4th day, and the first week of a year holds January 4th.
  const year = weekStartPlainDate.add({ days: 3 }).year;
  const firstWeekStart = getStartOfWeekDayNumber(
    PlainDate.from({ year, month: 1, day: 4 }).dayNumber,
    weekStartsOn,
  );
  return (weekStartPlainDate.dayNumber - firstWeekStart) / 7 + 1;
}
