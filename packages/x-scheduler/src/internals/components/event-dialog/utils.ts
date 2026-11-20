import type {
  SchedulerEvent,
  SchedulerEventColor,
  SchedulerResourceId,
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import {
  BaseTemporal,
  formatMonthAndDayOfMonth,
  formatWeekday,
  FULL_DAY_MINUTES,
  getDayTimezone,
  getMinutesInDay,
  getTimezoneId,
  isEventOccurrence,
  parseDateOnlyString,
  plainTimeFromMsInDay,
  toEpochMs,
  toPlainDate,
  toPlainDateTime,
} from '@mui/x-scheduler-internals/internals';
import type { EventEditingLocaleText, SchedulerWeekday } from '../../../models';

/**
 * Form values handled by the built-in submit logic.
 */
export interface EventDialogBuiltInFormValues {
  title: string;
  description: string;
  /**
   * Start date in the `yyyy-MM-dd` format.
   */
  startDate: string;
  /**
   * Start time in the `HH:mm` format.
   */
  startTime: string;
  /**
   * End date in the `yyyy-MM-dd` format.
   */
  endDate: string;
  /**
   * End time in the `HH:mm` format.
   */
  endTime: string;
  /**
   * Always an array, also when the resource picker is single-select.
   */
  resourceIds: SchedulerResourceId[];
  allDay: boolean;
  /**
   * `null` inherits the color from the resource or the calendar.
   */
  color: SchedulerEventColor | null;
  /**
   * Managed by the Recurrence tab; treat as read-only from custom sections.
   */
  recurrenceSelection: RecurringEventPresetKey | null | 'custom';
  /**
   * Managed by the Recurrence tab; treat as read-only from custom sections.
   * Its `until` is `null` when the recurrence ends on a date, but the date field doesn't hold one.
   */
  rruleDraft: Omit<SchedulerProcessedEventRecurrenceRule, 'until'> & {
    until?: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime | null;
  };
}

/**
 * Typed view of the form values bag. Custom fields from the user's event model
 * live alongside the built-in keys.
 */
export type EventDialogFormValues = EventDialogBuiltInFormValues & Record<string, unknown>;

/**
 * Event property backing each built-in form key, for per-property read-only checks.
 */
export const FORM_KEY_TO_EVENT_PROPERTY: {
  [P in keyof EventDialogBuiltInFormValues]-?: keyof SchedulerEvent;
} = {
  title: 'title',
  description: 'description',
  startDate: 'start',
  startTime: 'start',
  endDate: 'end',
  endTime: 'end',
  resourceIds: 'resource',
  allDay: 'allDay',
  color: 'color',
  recurrenceSelection: 'rrule',
  rruleDraft: 'rrule',
};

/**
 * Form keys handled by the built-in submit logic. Every other key in the values
 * bag is a custom field; the ones the user edited are spread onto the event as-is.
 */
export const BUILT_IN_FORM_KEYS: ReadonlySet<string> = new Set(
  Object.keys(FORM_KEY_TO_EVENT_PROPERTY),
);

const WEEKDAYS: SchedulerWeekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const getWeekdayToken = (plainDate: BaseTemporal.PlainDate) => {
  // ISO weekdays go from 1 (Monday) to 7 (Sunday).
  return WEEKDAYS[plainDate.dayOfWeek % 7];
};

export type EndsSelection = 'never' | 'after' | 'until';

/**
 * Form keys `computeRange` reads.
 */
export const RANGE_FORM_KEYS = ['startDate', 'startTime', 'endDate', 'endTime', 'allDay'] as const;

export type RangeFormKey = (typeof RANGE_FORM_KEYS)[number];

/**
 * Which bounds of the submitted range the user actually edited, per the keys the
 * range in its current mode reads (the all-day branch of `computeRange` ignores
 * the time fields). Toggling `allDay` re-derives both bounds.
 */
function getEditedRangeBounds(
  dirtyValues: Record<string, unknown>,
  allDay: boolean,
): { startEdited: boolean; endEdited: boolean } {
  const isDirty = (key: RangeFormKey) => hasProp(dirtyValues, key);
  const modeEdited = isDirty('allDay');
  return {
    startEdited: modeEdited || isDirty('startDate') || (!allDay && isDirty('startTime')),
    endEdited: modeEdited || isDirty('endDate') || (!allDay && isDirty('endTime')),
  };
}

/**
 * Reads a `yyyy-MM-dd` field, or returns `null` when it isn't an existing date.
 */
export function readDateField(raw: string): BaseTemporal.PlainDate | null {
  return parseDateOnlyString(raw);
}

/**
 * Reads a `HH:mm` field as a time, or returns `null` when it isn't a time.
 */
function readTimeField(raw: string): BaseTemporal.PlainTime | null {
  try {
    return BaseTemporal.PlainTime.from(raw);
  } catch {
    return null;
  }
}

/**
 * Reads a `yyyy-MM-dd` field as the instant in `timezone` of `time` on that date, or of its start
 * without a time. Returns `NaN` when the field isn't an existing date, the time is `null` or the
 * timezone is unknown.
 */
function readDateFieldMs(
  rawDate: string,
  timezone: string,
  time?: BaseTemporal.PlainTime | null,
): number {
  const plainDate = readDateField(rawDate);
  if (plainDate == null || time === null) {
    return NaN;
  }
  return toEpochMs(time === undefined ? plainDate : plainDate.toPlainDateTime(time), timezone);
}

/**
 * Reads a `yyyy-MM-dd` field as the first instant of the day after that date in `timezone`, the
 * exclusive end of an all-day range, or returns `NaN` like `readDateFieldMs()`.
 */
function readDateFieldExclusiveEndMs(rawDate: string, timezone: string): number {
  const plainDate = readDateField(rawDate);
  return plainDate == null ? NaN : toEpochMs(plainDate.add({ days: 1 }), timezone);
}

/**
 * Formats a date-time or a zoned date-time for the `yyyy-MM-dd` and `HH:mm` fields.
 */
export function formatDateAndTimeFields(
  value: BaseTemporal.PlainDateTime | BaseTemporal.ZonedDateTime,
): {
  date: string;
  time: string;
} {
  return { date: value.toPlainDate().toString(), time: formatTimeField(value.toPlainTime()) };
}

function formatTimeField(time: BaseTemporal.PlainTime): string {
  return time.toString().slice(0, 5);
}

function minutesToTimeField(minutesInDay: number): string {
  return formatTimeField(plainTimeFromMsInDay(minutesInDay * 60_000));
}

/**
 * The times of an all-day event made timed: the current time of the display timezone rounded up
 * to the hour, lasting `durationMinutes` but ending on the same day, so the dates don't change.
 */
export function getDefaultTimedFields(
  nowMs: number,
  durationMinutes: number,
  displayTimezone: string,
): { startTime: string; endTime: string } {
  const nowMinutes = getMinutesInDay(toPlainDateTime(nowMs, displayTimezone));
  const startMinutes = (Math.ceil(nowMinutes / 60) * 60) % FULL_DAY_MINUTES;
  const endMinutes = Math.min(startMinutes + durationMinutes, FULL_DAY_MINUTES - 1);

  return { startTime: minutesToTimeField(startMinutes), endTime: minutesToTimeField(endMinutes) };
}

/**
 * The instants of the range the fields describe, read in the display timezone. An all-day range
 * goes from the first instant of its first day to the first instant of the day after its last
 * day. A time field that a DST transition skips moves forward by the length of the gap, and one it
 * repeats resolves to its first instant, whatever the timezone of the system. An empty field reads
 * as now, and a field that doesn't parse as `NaN`.
 */
export function computeRange(
  next: Pick<EventDialogFormValues, RangeFormKey>,
  displayTimezone: string,
): { start: number; end: number; surfaceType: 'day-grid' | 'time-grid' } {
  const now = Date.now();

  if (next.allDay) {
    return {
      start: next.startDate === '' ? now : readDateFieldMs(next.startDate, displayTimezone),
      end: next.endDate === '' ? now : readDateFieldExclusiveEndMs(next.endDate, displayTimezone),
      surfaceType: 'day-grid',
    };
  }

  return {
    start:
      next.startDate === '' || next.startTime === ''
        ? now
        : readDateFieldMs(next.startDate, displayTimezone, readTimeField(next.startTime)),
    end:
      next.endDate === '' || next.endTime === ''
        ? now
        : readDateFieldMs(next.endDate, displayTimezone, readTimeField(next.endTime)),
    surfaceType: 'time-grid',
  };
}

/**
 * Checks the order of the bounds of a range: the exclusive end of an all-day range must be after
 * its start, the end day of a timed range can't be before its start day, and on the same day its
 * end must be after its start. The days are read in `displayTimezone`, the one the fields are read
 * in. `start` and `end` must be finite: check the fields with `findInvalidRangeField()` first.
 */
export function validateRange(
  start: number,
  end: number,
  allDay: boolean,
  displayTimezone: string,
): null | { field: 'endDate' | 'endTime' } {
  if (allDay) {
    return end <= start ? { field: 'endDate' } : null;
  }
  const dayOrder = BaseTemporal.PlainDate.compare(
    toPlainDate(start, displayTimezone),
    toPlainDate(end, displayTimezone),
  );
  // endDay < startDay → date error
  if (dayOrder > 0) {
    return { field: 'endDate' };
  }
  // end <= start → hour error
  if (dayOrder === 0 && end <= start) {
    return { field: 'endTime' };
  }
  return null;
}

/**
 * Returns the first date/time field whose value cannot produce a valid date
 * (empty and malformed included), or `null` when they all parse.
 */
export function findInvalidRangeField(
  values: Pick<EventDialogFormValues, RangeFormKey>,
  displayTimezone: string,
): 'startDate' | 'startTime' | 'endDate' | 'endTime' | null {
  // A date in an unknown timezone gives no instant, so it doesn't parse either.
  const parsesAsDate = (raw: string) => Number.isFinite(readDateFieldMs(raw, displayTimezone));
  const parsesAsTime = (raw: string) => readTimeField(raw) != null;

  if (!parsesAsDate(values.startDate)) {
    return 'startDate';
  }
  if (!values.allDay && !parsesAsTime(values.startTime)) {
    return 'startTime';
  }
  if (!parsesAsDate(values.endDate)) {
    return 'endDate';
  }
  if (!values.allDay && !parsesAsTime(values.endTime)) {
    return 'endTime';
  }
  return null;
}

export function getInvalidValueErrorMessage(
  field: 'startDate' | 'startTime' | 'endDate' | 'endTime',
  localeText: EventEditingLocaleText,
): string {
  return field === 'startDate' || field === 'endDate'
    ? localeText.invalidDateError
    : localeText.invalidTimeError;
}

export function getRangeErrorMessage(
  field: 'endDate' | 'endTime',
  localeText: EventEditingLocaleText,
): string {
  return field === 'endDate'
    ? localeText.startDateAfterEndDateError
    : localeText.startTimeAfterEndTimeError;
}

export function getRecurrenceLabel(
  locale: string,
  startPlainDate: BaseTemporal.PlainDate,
  recurrenceKey: RecurringEventPresetKey | 'custom' | null,
  localeText: EventEditingLocaleText,
): string {
  if (!recurrenceKey) {
    return localeText.recurrenceNoRepeat;
  }

  switch (recurrenceKey) {
    case 'DAILY':
      return localeText.recurrenceDailyPresetLabel;
    case 'WEEKLY': {
      const weekday = getWeekdayToken(startPlainDate);
      const weekdayName = formatWeekday(locale, startPlainDate);
      return localeText.recurrenceWeeklyPresetLabel({ weekday, weekdayName });
    }
    case 'MONTHLY': {
      return localeText.recurrenceMonthlyPresetLabel(startPlainDate.day);
    }
    case 'YEARLY': {
      return localeText.recurrenceYearlyPresetLabel(
        formatMonthAndDayOfMonth(locale, startPlainDate),
      );
    }
    case 'custom':
      return localeText.recurrenceCustomRepeat;
    default:
      return localeText.recurrenceNoRepeat;
  }
}

/**
 * The timezone the recurrence rule of the occurrence is expressed in: the display timezone for an
 * all-day event, whose days are the displayed dates, and for an all-day event made timed, which
 * moves to it. The timezone of the event otherwise.
 * A creation draft has no event yet: it is created in the `default` timezone.
 */
export function getRuleTimezone(
  occurrence: SchedulerRenderableEventOccurrence,
  allDay: boolean,
  displayTimezone: string,
): string {
  if (!isEventOccurrence(occurrence)) {
    return allDay ? displayTimezone : 'default';
  }
  return getDayTimezone(occurrence, displayTimezone, allDay);
}

/**
 * The date of an instant in the timezone the recurrence rule of the occurrence is expressed in.
 */
export function getRulePlainDate(
  occurrence: SchedulerRenderableEventOccurrence,
  timestamp: number,
  allDay: boolean,
  displayTimezone: string,
): BaseTemporal.PlainDate {
  return toPlainDate(timestamp, getRuleTimezone(occurrence, allDay, displayTimezone));
}

/**
 * Which bounds the save resends: the ones the user edited, plus the other one when the display
 * timezone moved since the form was seeded (the range is validated as a pair in the current
 * display timezone, so an untouched bound's stored instant no longer matches).
 */
export function getResentRangeBounds(
  dirtyValues: Record<string, unknown>,
  allDay: boolean,
  displayTimezoneMoved: boolean,
): { startResent: boolean; endResent: boolean } {
  const { startEdited, endEdited } = getEditedRangeBounds(dirtyValues, allDay);
  return {
    startResent: startEdited || (endEdited && displayTimezoneMoved),
    endResent: endEdited || (startEdited && displayTimezoneMoved),
  };
}

/**
 * The timestamp of a bound of the range the event ends up with: the submitted one when the save
 * resends it, the occurrence's own otherwise (also while an edited date does not parse). The
 * recurrence rule is built on these bounds.
 */
export function getRecurrenceRuleBound(
  occurrence: SchedulerRenderableEventOccurrence,
  values: Pick<EventDialogFormValues, RangeFormKey>,
  resent: boolean,
  displayTimezone: string,
  bound: 'start' | 'end',
): number {
  if (!resent || findInvalidRangeField(values, displayTimezone) != null) {
    return occurrence[bound].epochMilliseconds;
  }
  return computeRange(values, displayTimezone)[bound];
}

/**
 * The canonical IANA identifier of a timezone; `default` resolves to the system timezone.
 */
function getCanonicalTimezoneId(timezone: string): string {
  const id = getTimezoneId(timezone);
  try {
    return new Intl.DateTimeFormat(undefined, { timeZone: id }).resolvedOptions().timeZone;
  } catch {
    return id;
  }
}

/**
 * The localized generic name of a timezone (e.g. "Pacific Time"), or its identifier when the
 * runtime has no name for it and prints an offset instead.
 */
function getTimezoneDisplayName(locale: string, timezoneId: string): string {
  try {
    const name = new Intl.DateTimeFormat(locale, {
      timeZone: timezoneId,
      timeZoneName: 'longGeneric',
    })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value;
    // An offset ("GMT+00:00", "UTC−05:00", "غرينتش+٠٠:٠٠") is the only name carrying digits.
    return name == null || /\p{Nd}/u.test(name) ? timezoneId : name;
  } catch {
    return timezoneId;
  }
}

/**
 * The name of the event's timezone when it is not the display one, so the days and weekdays
 * of its recurrence rule can be labeled; `null` when both timezones are the same.
 */
export function getRecurrenceTimezoneName(
  locale: string,
  eventTimezone: string,
  displayTimezone: string,
): string | null {
  const eventTimezoneId = getCanonicalTimezoneId(eventTimezone);
  return eventTimezoneId === getCanonicalTimezoneId(displayTimezone)
    ? null
    : getTimezoneDisplayName(locale, eventTimezoneId);
}

export function getEndsSelectionFromRRule(rrule?: {
  count?: number | null;
  until?: BaseTemporal.PlainDate | BaseTemporal.PlainDateTime | null;
}): EndsSelection {
  if (!rrule) {
    return 'never';
  }
  // A `null` until ends on a date that isn't set yet.
  if (rrule.until !== undefined) {
    return 'until';
  }
  if (rrule.count && rrule.count > 0) {
    return 'after';
  }
  return 'never';
}

type HasProp<T, K extends PropertyKey> =
  T extends Partial<Record<K, unknown>>
    ? T & { [P in K]-?: Exclude<T[P & keyof T], undefined> }
    : never;

export function hasProp<T extends object, K extends PropertyKey>(
  obj: T,
  prop: K,
): obj is HasProp<T, K> {
  return prop in obj;
}
