import type {
  SchedulerEvent,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  WeekStartsOn,
} from '../../models';
import { BaseTemporal } from './base-temporal';
import {
  getStartOfWeekDayNumber,
  isoDateToDayNumber,
  MS_PER_DAY,
} from './plain-date-utils/dayNumber';
import { getDayNumber, getMsInDay, plainDateFromDayNumber } from './plain-date-utils/plainDate';
import type { WeekInfo } from './date-locale';
import { toEditedEpochMs, toEpochMs, toPlainDateTime } from './plain-date-utils/timeZone';
import { isDateOnlyString, isInstantString } from './plain-date-utils/date';

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

/**
 * Writes the `until` of a processed rule in the format of `originalString`, like
 * `timestampToEventString()`. A plain date covers its whole day: it stays date-only after a
 * date-only string, and is written as the last instant of its day otherwise. A plain date-time is
 * written as its instant.
 */
export function untilToEventString(
  until: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime,
  originalString: string,
  dataTimezone: string,
): string {
  if (until instanceof BaseTemporal.PlainDateTime) {
    return timestampToEventString(toEpochMs(until, dataTimezone), originalString, dataTimezone);
  }
  if (isDateOnlyString(originalString)) {
    return until.toString();
  }
  return timestampToEventString(
    toEpochMs(until.add({ days: 1 }), dataTimezone) - 1,
    originalString,
    dataTimezone,
  );
}

/**
 * The string whose format the `until` written to an event follows: its current `until`, including
 * the UNTIL of an RRULE string, or else its start.
 */
export function getUntilReferenceString(event: SchedulerEvent): string {
  if (typeof event.rrule === 'object') {
    return event.rrule.until ?? event.start;
  }
  // The date form of UNTIL, like `20250110`, or its UTC date-time form, like `20250110T090000Z`.
  const match = event.rrule?.match(
    /(?:^|;)\s*UNTIL\s*=\s*(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z)?\s*(?:;|$)/i,
  );
  if (match == null) {
    return event.start;
  }
  const date = `${match[1]}-${match[2]}-${match[3]}`;
  return match[4] === undefined ? date : `${date}T${match[4]}:${match[5]}:${match[6]}Z`;
}

type EventDateKey = 'start' | 'end' | 'exDates' | 'rrule';

/**
 * `TChanges` with its dates written as event strings.
 */
type WithEventDateStrings<TChanges> = {
  [K in keyof TChanges]: K extends EventDateKey ? SchedulerEvent[K] : TChanges[K];
};

/**
 * The instants of the bounds of an event, in milliseconds since the Unix epoch.
 */
interface EventBounds {
  start: number;
  end: number;
}

/**
 * Resolves the dates of an edit to instants with `toEditedEpochMs()`: each one keeps the instant
 * of `current` when it reads the same, and the end resolves at or after the start. The inclusive
 * end of an all-day event, at 23:59:59.999, resolves to the last instant of its day, like
 * `getEndOfDayMs()`. A date missing from `changes` stays `undefined`.
 */
export function resolveEditedBounds(
  changes: Partial<Pick<SchedulerEventUpdatedProperties, 'start' | 'end'>>,
  current: EventBounds,
  timezone: string,
  allDay: boolean | undefined,
): Partial<EventBounds> {
  const start =
    changes.start == null ? undefined : toEditedEpochMs(changes.start, timezone, current.start);
  if (changes.end == null) {
    return { start };
  }
  const end =
    allDay && getMsInDay(changes.end) === MS_PER_DAY - 1
      ? toEpochMs(changes.end.toPlainDate().add({ days: 1 }), timezone) - 1
      : toEditedEpochMs(changes.end, timezone, current.end, start ?? current.start);
  return { start, end };
}

/**
 * Writes the dates of an edit of `event`, or of an event derived from it, as event strings in the
 * format of its own, in a copy of `changes`. The dates resolve with `resolveEditedBounds()` against
 * `current`, the bounds of `event` by default, or of the edited occurrence. A date that resolves to
 * the instant `event` has keeps its string, so an unchanged date keeps its format: `start`, `end`,
 * and for an exception the one at the same index. A new exception takes the format of `start`. A
 * processed `until` takes the format `getUntilReferenceString()` returns.
 */
export function toEventDateStrings<
  TChanges extends Partial<Pick<SchedulerEventUpdatedProperties, EventDateKey | 'allDay'>>,
>(
  changes: TChanges,
  event: SchedulerProcessedEvent,
  current?: EventBounds,
): WithEventDateStrings<TChanges> {
  const model = event.modelInBuiltInFormat;
  const { timezone } = event;
  const { dataStart, dataEnd } = event.unstable_internalInfos;
  const result: Partial<Pick<SchedulerEvent, EventDateKey>> = {
    ...(changes as Partial<Pick<SchedulerEvent, EventDateKey>>),
  };

  const bounds = resolveEditedBounds(
    changes,
    current ?? { start: dataStart, end: dataEnd },
    timezone,
    changes.allDay ?? event.allDay,
  );
  if (bounds.start !== undefined) {
    result.start =
      bounds.start === dataStart
        ? model.start
        : timestampToEventString(bounds.start, model.start, timezone);
  }
  if (bounds.end !== undefined) {
    result.end =
      bounds.end === dataEnd ? model.end : timestampToEventString(bounds.end, model.end, timezone);
  }
  if (changes.exDates != null) {
    result.exDates = changes.exDates.map((exDate, index) =>
      event.exDates?.[index]?.equals(exDate)
        ? model.exDates![index]
        : timestampToEventString(
            toEpochMs(exDate, timezone),
            model.exDates?.[index] ?? model.start,
            timezone,
          ),
    );
  }
  const { rrule } = changes;
  if (rrule?.until != null) {
    result.rrule = {
      ...rrule,
      until: untilToEventString(rrule.until, getUntilReferenceString(model), timezone),
    };
  }
  return result as WithEventDateStrings<TChanges>;
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
