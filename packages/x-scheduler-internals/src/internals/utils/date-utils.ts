import type {
  SchedulerEvent,
  SchedulerEventRecurrenceRule,
  SchedulerProcessedEvent,
  SchedulerProcessedEventRecurrenceRule,
  WeekStartsOn,
} from '../../models';
import { BaseTemporal } from './base-temporal';
import { getStartOfWeekDayNumber, isoDateToDayNumber } from './plain-date-utils/dayNumber';
import { getDayNumber, plainDateFromDayNumber } from './plain-date-utils/plainDate';
import type { WeekInfo } from './date-locale';
import { toEpochMs, toPlainDateTime } from './plain-date-utils/timeZone';
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
 * The dates of an event edit: instants in milliseconds since the Unix epoch, or event strings.
 */
interface EventDateInputs {
  start?: string | number;
  end?: string | number;
  exDates?: (string | number)[];
  rrule?: SchedulerEventRecurrenceRule | SchedulerProcessedEventRecurrenceRule | string;
  timezone?: string;
}

/**
 * `TChanges` with its dates written as event strings.
 */
type WithEventDateStrings<TChanges> = {
  [K in keyof TChanges]: K extends EventDateKey ? SchedulerEvent[K] : TChanges[K];
};

/**
 * Writes the dates of an event edit as event strings, in a copy of `changes`.
 * An instant takes the format of the matching string of `referenceModel`, the event it is written
 * to or derived from, in the timezone of that event: `start`, `end`, and for an exception the one
 * at the same index, or else `start`. A processed `until` takes the format
 * `getUntilReferenceString()` returns. Without `referenceModel`, for a new event, an instant is
 * written as an ISO instant, and `until` takes the format of the written `start`, in the timezone
 * of `changes`. Strings are kept as they are.
 */
export function toEventDateStrings<TChanges extends EventDateInputs>(
  changes: TChanges,
  referenceModel: SchedulerEvent | null,
): WithEventDateStrings<TChanges> {
  const dataTimezone =
    (referenceModel == null ? changes.timezone : referenceModel.timezone) ?? 'default';
  const toEventString = (value: string | number, referenceString: string | undefined) => {
    if (typeof value === 'string') {
      return value;
    }
    return referenceString == null
      ? new Date(value).toISOString()
      : timestampToEventString(value, referenceString, dataTimezone);
  };

  const result: EventDateInputs = { ...changes };
  if (changes.start != null) {
    result.start = toEventString(changes.start, referenceModel?.start);
  }
  if (changes.end != null) {
    result.end = toEventString(changes.end, referenceModel?.end);
  }
  if (changes.exDates != null) {
    result.exDates = changes.exDates.map((exDate, index) =>
      toEventString(exDate, referenceModel?.exDates?.[index] ?? referenceModel?.start),
    );
  }
  const { rrule } = changes;
  if (typeof rrule === 'object' && rrule.until != null && typeof rrule.until !== 'string') {
    result.rrule = {
      ...rrule,
      until: untilToEventString(
        rrule.until,
        referenceModel == null ? (result.start as string) : getUntilReferenceString(referenceModel),
        dataTimezone,
      ),
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
