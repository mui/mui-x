import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import type { BaseTemporal } from './base-temporal';
import { getStartOfWeekDayNumber, isoDateToDayNumber } from './plain-date-utils/dayNumber';
import { getDayNumber, plainDateFromDayNumber } from './plain-date-utils/plainDate';
import type { WeekInfo } from './date-locale';
import { toEpochMs, toPlainDateTime } from './plain-date-utils/timeZone';
import { isInstantString } from './plain-date-utils/date';

/**
 * Converts an instant back to an event date string, respecting the format of `originalString`:
 * after an instant string (ending with `Z` or an offset), a UTC ISO string, and after a wall-time
 * string, the wall-clock time in the event's data timezone, without the `Z` suffix.
 */
export function timestampToEventString(
  epochMs: number,
  originalString: string,
  dataTimezone: TemporalTimezone,
): string {
  if (isInstantString(originalString)) {
    return new Date(epochMs).toISOString();
  }
  // Like the strings of the events, without milliseconds.
  return toPlainDateTime(Math.floor(epochMs / 1000) * 1000, dataTimezone).toString();
}

/**
 * Converts the last day of a recurrence rule to the `until` of an event model: the last instant of
 * that day in the event's data timezone, in the format of `originalString` like
 * `timestampToEventString()`.
 */
export function untilToEventString(
  until: BaseTemporal.PlainDate,
  originalString: string,
  dataTimezone: TemporalTimezone,
): string {
  const endOfDayMs = toEpochMs(until.add({ days: 1 }), dataTimezone) - 1;
  return timestampToEventString(endOfDayMs, originalString, dataTimezone);
}

/**
 * Gets the timestamp of the end of an event occurrence from the timestamp of its start.
 * For now, the occurrence always has the same duration as the original event, even when the DST applies between its start and the end.
 */
export function getOccurrenceEnd({
  event,
  occurrenceStart,
}: {
  event: SchedulerProcessedEvent;
  occurrenceStart: number;
}): number {
  return (
    occurrenceStart + event.unstable_internalInfos.dataEnd - event.unstable_internalInfos.dataStart
  );
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
export function getPlainDateWeekStart(
  plainDate: BaseTemporal.PlainDate,
  weekStartsOn: WeekStartsOn,
): BaseTemporal.PlainDate {
  checkWeekStartsOn(weekStartsOn);
  return plainDateFromDayNumber(getStartOfWeekDayNumber(getDayNumber(plainDate), weekStartsOn));
}

/**
 * Returns the week number of `plainDate`, with weeks starting on `weekInfo.firstDay`
 * (1 = Monday … 7 = Sunday).
 *
 * The first week of a year is the first one with at least `weekInfo.minimalDays` days in that
 * year. With weeks starting on Monday and 4 minimal days, the result is the ISO 8601 week number.
 */
export function getWeekNumber(
  plainDate: BaseTemporal.PlainDate,
  weekInfo: Pick<WeekInfo, 'firstDay' | 'minimalDays'>,
): number {
  const { firstDay: weekStartsOn, minimalDays } = weekInfo;
  const weekStartPlainDate = getPlainDateWeekStart(plainDate, weekStartsOn);
  // A week belongs to the year of its last `minimalDays` days, and the first week of a year holds
  // its `minimalDays`-th day.
  const year = weekStartPlainDate.add({ days: 7 - minimalDays }).year;
  const firstWeekStart = getStartOfWeekDayNumber(
    isoDateToDayNumber(year, 1, minimalDays),
    weekStartsOn,
  );
  return (getDayNumber(weekStartPlainDate) - firstWeekStart) / 7 + 1;
}
