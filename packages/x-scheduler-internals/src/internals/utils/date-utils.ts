import type { TemporalTimezone, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { getStartOfWeek as getStartOfWeekDayNumber, PlainDate } from './base-temporal/PlainDate';
import {
  buildTemporalPlainDate,
  createAdapterDate,
  createLabelDate,
} from './plain-date-utils/adapter';
import { plainDateFromDayNumber } from './plain-date-utils/plainDate';
import { toWallClockIsoString } from './plain-date-utils/timeZone';

/**
 * @example "1:30 PM" or "13:30"
 */
export function formatHourAndMinutes(
  date: TemporalSupportedObject,
  adapter: Adapter,
  ampm: boolean,
): string {
  const f = adapter.formats;
  const timeFormat = ampm
    ? `${f.hours12h}:${f.minutesPadded} ${f.meridiem}`
    : `${f.hours24h}:${f.minutesPadded}`;

  return adapter.formatByString(date, timeFormat);
}

const hourLabels = new WeakMap<Adapter, string[]>();

/**
 * Formats a wall-clock hour, like `9:00 AM`, rather than an instant: the hour that a
 * spring-forward transition skips has no instant on that day. The label is built on a date in
 * UTC, which has no DST transition. The labels are cached per adapter, as the headers build one
 * label per hour on every render.
 */
export function formatWallClockHour(adapter: Adapter, hour: number, ampm: boolean): string {
  let labels = hourLabels.get(adapter);
  if (!labels) {
    labels = [];
    hourLabels.set(adapter, labels);
  }
  const index = ampm ? hour + 24 : hour;
  labels[index] ??= formatHourAndMinutes(
    createAdapterDate(adapter, Date.UTC(2020, 0, 1, hour), 'UTC'),
    adapter,
    ampm,
  );
  return labels[index];
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
  return toWallClockIsoString(adapter.getTime(date), dataTimezone);
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
    const monday = createLabelDate(adapter, PlainDate.from('2024-01-01'));
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
    // The adapter numbers the weeks with the rules of its locale.
    return adapter.getWeekNumber(createLabelDate(adapter, plainDate));
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
