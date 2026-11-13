import type { SchedulerEvent, SchedulerProcessedEvent, WeekStartsOn } from '../../models';
import { BaseTemporal } from './base-temporal';
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
  dataTimezone: string,
): string {
  if (isInstantString(originalString)) {
    return new Date(epochMs).toISOString();
  }
  // Like the strings of the events, without milliseconds.
  return toPlainDateTime(Math.floor(epochMs / 1000) * 1000, dataTimezone).toString();
}

// The instants of the timed cutoffs read from one, which their wall-clock time can't tell apart
// in the hour a DST transition repeats. Spreading a rule keeps the cutoff, and its instant.
const UNTIL_INSTANTS = new WeakMap<
  BaseTemporal.PlainDateTime,
  { epochMs: number; timezone: string }
>();

/**
 * The timed recurrence cutoff of an instant in `timezone`, which remembers the instant.
 */
export function createUntilFromTimestamp(
  epochMs: number,
  timezone: string,
): BaseTemporal.PlainDateTime {
  const until = toPlainDateTime(epochMs, timezone);
  UNTIL_INSTANTS.set(until, { epochMs, timezone });
  return until;
}

/**
 * The instant of a timed recurrence cutoff in `timezone`: the one it was created from with
 * `createUntilFromTimestamp()`, or else its wall-clock time resolved like `toEpochMs()`.
 * Newly selected end-of-day values use the last instant of the day, like the date picker.
 */
export function getUntilTimestamp(until: BaseTemporal.PlainDateTime, timezone: string): number {
  const instant = UNTIL_INSTANTS.get(until);
  if (instant?.timezone === timezone) {
    return instant.epochMs;
  }
  return until.toPlainTime().toString() === '23:59:59.999'
    ? toEpochMs(until.toPlainDate().add({ days: 1 }), timezone) - 1
    : toEpochMs(until, timezone);
}

/**
 * Whether two recurrence cutoffs end the series at the same time. Timed cutoffs compare their
 * instants in the timezone they were read in, so the two instances of a repeated hour differ.
 */
export function isSameUntil(
  untilA: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime | undefined,
  untilB: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime | undefined,
): boolean {
  if (
    !(untilA instanceof BaseTemporal.PlainDateTime) ||
    !(untilB instanceof BaseTemporal.PlainDateTime)
  ) {
    return untilA?.constructor === untilB?.constructor && untilA?.toString() === untilB?.toString();
  }
  const timezone = (UNTIL_INSTANTS.get(untilA) ?? UNTIL_INSTANTS.get(untilB))?.timezone;
  return timezone === undefined
    ? untilA.toString() === untilB.toString()
    : getUntilTimestamp(untilA, timezone) === getUntilTimestamp(untilB, timezone);
}

/**
 * Writes an inclusive recurrence cutoff in the format of `originalString`.
 * Date-only strings stay date-only, unless a timed cutoff falls after midnight. An all-day cutoff in a date-time format uses the end of its day.
 * A timed cutoff whose instant its wall-clock time can't give back is written as an instant.
 */
export function untilToEventString(
  until: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime,
  originalString: string,
  dataTimezone: string,
): string {
  const isDateOnly = /^[+-]?\d{4,6}-\d{2}-\d{2}$/.test(originalString);
  if (until instanceof BaseTemporal.PlainDate) {
    return isDateOnly
      ? until.toString()
      : timestampToEventString(
          toEpochMs(until.add({ days: 1 }), dataTimezone) - 1,
          originalString,
          dataTimezone,
        );
  }
  // A cutoff read from the event keeps its instant. The date picker writes the end of the chosen
  // day: keep the later instant when the timezone repeats its last hour, rather than the first.
  const wallClockTimestamp = toEpochMs(until, dataTimezone);
  const timestamp = getUntilTimestamp(until, dataTimezone);
  // Wall-clock strings are read back like `toEpochMs()`.
  if (isInstantString(originalString) || timestamp !== wallClockTimestamp) {
    return new Date(timestamp).toISOString();
  }
  // A timed cutoff in the middle of a day needs its time, or it would move back to midnight.
  return isDateOnly && until.toPlainTime().toString() === '00:00:00'
    ? until.toPlainDate().toString()
    : until.toString();
}

/** The original UNTIL string whose date-only, wall-time or instant format edits preserve. */
export function getUntilReferenceString(event: SchedulerEvent): string {
  if (typeof event.rrule === 'object') {
    return event.rrule.until ?? event.start;
  }
  const match = event.rrule?.match(
    /(?:^|;)\s*UNTIL\s*=\s*(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z)?\s*(?:;|$)/i,
  );
  if (match == null) {
    return event.start;
  }
  const date = `${match[1]}-${match[2]}-${match[3]}`;
  return match[4] === undefined ? date : `${date}T${match[4]}:${match[5]}:${match[6]}Z`;
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
