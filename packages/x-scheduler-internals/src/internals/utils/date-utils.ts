import type { TemporalTimezone, TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import { getStartOfWeek as getStartOfWeekDayNumber, PlainDate } from './base-temporal/PlainDate';
import { plainDateFromDayNumber } from './plain-date-utils/plainDate';
import type { WeekInfo } from './date-locale';
import { toWallClockIsoString } from './plain-date-utils/timeZone';

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

function checkWeekStartsOn(weekStartsOn: WeekStartsOn) {
  if (process.env.NODE_ENV !== 'production') {
    if (
      !Number.isInteger(weekStartsOn) ||
      (weekStartsOn as number) < 1 ||
      (weekStartsOn as number) > 7
    ) {
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: weekStartsOn must be an integer between 1 (Monday) and 7 (Sunday),` +
          ` but received ${weekStartsOn}.`,
      );
    }
  }
}

/**
 * The first day of the week of `plainDate`.
 */
export function getPlainDateWeekStart(plainDate: PlainDate, weekStartsOn: WeekStartsOn): PlainDate {
  checkWeekStartsOn(weekStartsOn);
  return plainDateFromDayNumber(getStartOfWeekDayNumber(plainDate.dayNumber, weekStartsOn));
}

/**
 * Returns the week number of `plainDate`, with weeks starting on `weekInfo.firstDay`
 * (1 = Monday … 7 = Sunday).
 *
 * The first week of a year is the first one with at least `weekInfo.minimalDays` days in that
 * year. With weeks starting on Monday and 4 minimal days, the result is the ISO 8601 week number.
 */
export function getWeekNumber(plainDate: PlainDate, weekInfo: WeekInfo): number {
  const { firstDay: weekStartsOn, minimalDays } = weekInfo;
  const weekStartPlainDate = getPlainDateWeekStart(plainDate, weekStartsOn);
  // A week belongs to the year of its last `minimalDays` days, and the first week of a year holds
  // its `minimalDays`-th day.
  const year = weekStartPlainDate.add({ days: 7 - minimalDays }).year;
  const firstWeekStart = getStartOfWeekDayNumber(
    PlainDate.from({ year, month: 1, day: minimalDays }).dayNumber,
    weekStartsOn,
  );
  return (weekStartPlainDate.dayNumber - firstWeekStart) / 7 + 1;
}
