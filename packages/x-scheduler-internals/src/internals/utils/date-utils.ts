import type { TemporalTimezone, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { getStartOfWeek as getStartOfWeekDayNumber, PlainDate } from './base-temporal/PlainDate';
import {
  buildTemporalPlainDate,
  createAdapterDate,
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

const hourLabelTemplates = new WeakMap<Adapter, TemporalSupportedObject>();

/**
 * Formats a wall-clock hour, like `9:00 AM`, rather than an instant: the hour that a
 * spring-forward transition skips has no instant on that day. The label is built on a date in
 * UTC, which has no DST transition, cached per adapter as the headers build one label per hour.
 */
export function formatWallClockHour(adapter: Adapter, hour: number, ampm: boolean): string {
  let template = hourLabelTemplates.get(adapter);
  if (!template) {
    template = createAdapterDate(adapter, Date.UTC(2020, 0, 1), 'UTC');
    hourLabelTemplates.set(adapter, template);
  }
  const f = adapter.formats;
  const pattern = ampm
    ? `${f.hours12h}:${f.minutesPadded} ${f.meridiem}`
    : `${f.hours24h}:${f.minutesPadded}`;
  return adapter.formatByString(adapter.setHours(template, hour), pattern);
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

const localeFirstDaysOfWeek = new WeakMap<Adapter, number>();

/**
 * The ISO weekday (1 = Monday … 7 = Sunday) the weeks of the locale of the adapter start on.
 */
function getLocaleFirstDayOfWeek(adapter: Adapter): number {
  let firstDayOfWeek = localeFirstDaysOfWeek.get(adapter);
  if (firstDayOfWeek === undefined) {
    // The adapter numbers the days of the week from 1, starting on the first day of the locale.
    // January 1st, 2024 is a Monday.
    const monday = createAdapterDate(adapter, Date.UTC(2024, 0, 1, 12), 'UTC');
    firstDayOfWeek = ((8 - adapter.getDayOfWeek(monday)) % 7) + 1;
    localeFirstDaysOfWeek.set(adapter, firstDayOfWeek);
  }
  return firstDayOfWeek;
}

/**
 * The first day of the week of `plainDate`. Without `weekStartsOn`, the week starts on the first
 * day of the locale of the adapter.
 */
export function getPlainDateWeekStart(
  adapter: Adapter,
  plainDate: PlainDate,
  weekStartsOn: WeekStartsOn | undefined,
): PlainDate {
  if (weekStartsOn !== undefined) {
    checkWeekStartsOn(weekStartsOn);
  }
  // `weekStartsOn` and ISO weekdays agree, except for Sunday (0 and 7), which both accept.
  return plainDateFromDayNumber(
    getStartOfWeekDayNumber(plainDate.dayNumber, weekStartsOn ?? getLocaleFirstDayOfWeek(adapter)),
  );
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
  const weekStartPlainDate = getPlainDateWeekStart(
    adapter,
    buildTemporalPlainDate(adapter, date),
    weekStartsOn,
  );
  return createStartOfPlainDate(adapter, weekStartPlainDate, adapter.getTimezone(date));
}

/**
 * Returns the week number of `plainDate`, using `weekStartsOn` as the first day of
 * the week (0 = Sunday … 6 = Saturday).
 *
 * Applies the ISO 8601 "4-day minimum" rule (the Thursday of each week
 * determines its year) with a parametric first day of the week. When
 * `weekStartsOn` is 1 the result is a standard ISO 8601 week number; for
 * other values it is the same algorithm with a shifted origin.
 */
export function getWeekNumber(
  adapter: Adapter,
  plainDate: PlainDate,
  weekStartsOn: WeekStartsOn | undefined,
): number {
  if (weekStartsOn === undefined) {
    // The adapter numbers the weeks with the rules of its locale. It reads them on a date in UTC,
    // which skips no day.
    return adapter.getWeekNumber(createStartOfPlainDate(adapter, plainDate, 'UTC'));
  }
  const weekStartPlainDate = getPlainDateWeekStart(adapter, plainDate, weekStartsOn);
  // The week belongs to the year of its 4th day, and the first week of a year holds January 4th.
  const year = weekStartPlainDate.add({ days: 3 }).year;
  const firstWeekStart = getStartOfWeekDayNumber(
    PlainDate.from({ year, month: 1, day: 4 }).dayNumber,
    weekStartsOn,
  );
  return (weekStartPlainDate.dayNumber - firstWeekStart) / 7 + 1;
}
