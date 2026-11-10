import type {
  SchedulerEvent,
  SchedulerEventColor,
  SchedulerResourceId,
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
  SchedulerRenderableEventOccurrence,
  TemporalTimezone,
} from '@mui/x-scheduler-internals/models';
import {
  BaseTemporal,
  createAdapterDate,
  createEndOfPlainDate,
  formatMonthAndDayOfMonth,
  formatWeekday,
  getOccurrenceDataTimezone,
  MS_PER_DAY,
  toEpochMs,
  toPlainDate,
  toWallClockIsoString,
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
   */
  rruleDraft: SchedulerProcessedEventRecurrenceRule;
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
export function getEditedRangeBounds(
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

// The documented `yyyy-MM-dd` / `HH:mm` formats. `BaseTemporal.PlainDate.from()` rejects the dates
// that don't exist, like 2025-06-31, but also reads calendar annotations, which the fields don't use.
const DATE_VALUE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_VALUE_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Reads a `yyyy-MM-dd` field, or returns `null` when it isn't an existing date.
 */
function readDateField(raw: string): BaseTemporal.PlainDate | null {
  if (!DATE_VALUE_REGEX.test(raw)) {
    return null;
  }
  try {
    return BaseTemporal.PlainDate.from(raw);
  } catch {
    return null;
  }
}

/**
 * Reads a `HH:mm` field as milliseconds since midnight, or returns `null` when it isn't a time.
 */
function readTimeField(raw: string): number | null {
  const match = TIME_VALUE_REGEX.exec(raw);
  return match == null ? null : (Number(match[1]) * 60 + Number(match[2])) * 60_000;
}

/**
 * Reads a `yyyy-MM-dd` field and a time of day as an instant in `timezone`, or returns `NaN` when
 * the field isn't an existing date, the time is `null` or the timezone is unknown.
 */
function readDateFieldMs(rawDate: string, msInDay: number | null, timezone: TemporalTimezone) {
  const plainDate = readDateField(rawDate);
  return plainDate == null || msInDay == null ? NaN : toEpochMs(plainDate, msInDay, timezone);
}

/**
 * Formats an instant for the `yyyy-MM-dd` and `HH:mm` fields, on the wall clock of `timezone`.
 */
export function formatDateAndTimeFields(
  epochMs: number,
  timezone: TemporalTimezone,
): { date: string; time: string } {
  const isoString = toWallClockIsoString(epochMs, timezone);
  return { date: isoString.slice(0, 10), time: isoString.slice(11, 16) };
}

/**
 * The instants of the range the fields describe, read in the display timezone. An all-day range
 * goes from the first instant of its first day to the last instant of its last day. A time field
 * that a DST transition skips moves forward by the length of the gap, and one it repeats resolves
 * to its first instant, whatever the timezone of the system. An empty field reads as now, and a
 * field that doesn't parse as `NaN`.
 */
export function computeRange(
  next: Pick<EventDialogFormValues, RangeFormKey>,
  displayTimezone: TemporalTimezone,
): { start: number; end: number; surfaceType: 'day-grid' | 'time-grid' } {
  const now = Date.now();

  if (next.allDay) {
    return {
      start: next.startDate === '' ? now : readDateFieldMs(next.startDate, 0, displayTimezone),
      // The last instant before the next day starts: when a DST transition repeats the last hour
      // of the day, it's the later 23:59:59.999.
      end:
        next.endDate === '' ? now : readDateFieldMs(next.endDate, MS_PER_DAY, displayTimezone) - 1,
      surfaceType: 'day-grid',
    };
  }

  return {
    start:
      next.startDate === '' || next.startTime === ''
        ? now
        : readDateFieldMs(next.startDate, readTimeField(next.startTime), displayTimezone),
    end:
      next.endDate === '' || next.endTime === ''
        ? now
        : readDateFieldMs(next.endDate, readTimeField(next.endTime), displayTimezone),
    surfaceType: 'time-grid',
  };
}

/**
 * Checks the order of the bounds of a range: the end day can't be before the start day, and on the
 * same day, the end of a timed range must be after its start. The days are read in
 * `displayTimezone`, the one the fields are read in. `start` and `end` must be finite: check the
 * fields with `findInvalidRangeField()` first.
 */
export function validateRange(
  start: number,
  end: number,
  allDay: boolean,
  displayTimezone: TemporalTimezone,
): null | { field: 'endDate' | 'endTime' } {
  const dayOrder = BaseTemporal.PlainDate.compare(
    toPlainDate(start, displayTimezone),
    toPlainDate(end, displayTimezone),
  );
  // endDay < startDay → date error
  if (dayOrder > 0) {
    return { field: 'endDate' };
  }
  // end <= start → hour error
  if (dayOrder === 0 && !allDay && end <= start) {
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
  displayTimezone: TemporalTimezone,
): 'startDate' | 'startTime' | 'endDate' | 'endTime' | null {
  // A date in an unknown timezone gives no instant, so it doesn't parse either.
  const parsesAsDate = (raw: string) => Number.isFinite(readDateFieldMs(raw, 0, displayTimezone));
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
 * The timezone the occurrence's event is stored in, the one its recurrence rule is expressed in.
 * A creation draft has no event yet: it is created in the `default` timezone.
 */
export function getEventTimezone(occurrence: SchedulerRenderableEventOccurrence): TemporalTimezone {
  return getOccurrenceDataTimezone(occurrence)?.timezone ?? 'default';
}

/**
 * The timestamp of a bound of the occurrence's event. All-day display bounds are aligned on the
 * days of the display timezone, so the bound stored in the event's timezone comes first.
 */
export function getEventBoundTimestamp(
  occurrence: SchedulerRenderableEventOccurrence,
  bound: 'start' | 'end',
): number {
  return (getOccurrenceDataTimezone(occurrence)?.[bound] ?? occurrence.displayTimezone[bound])
    .timestamp;
}

/**
 * The date of an instant in the event's timezone, the one its recurrence rule is expressed in.
 */
export function getEventTimezonePlainDate(
  occurrence: SchedulerRenderableEventOccurrence,
  timestamp: number,
): BaseTemporal.PlainDate {
  return toPlainDate(timestamp, getEventTimezone(occurrence));
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
 * recurrence rule is built on these bounds, read in the event's timezone.
 */
export function getRecurrenceRuleBound(
  occurrence: SchedulerRenderableEventOccurrence,
  values: Pick<EventDialogFormValues, RangeFormKey>,
  resent: boolean,
  displayTimezone: TemporalTimezone,
  bound: 'start' | 'end',
): number {
  if (!resent || findInvalidRangeField(values, displayTimezone) != null) {
    return getEventBoundTimestamp(occurrence, bound);
  }
  return computeRange(values, displayTimezone)[bound];
}

/**
 * The `until` of a recurrence rule whose last day is the date of a `yyyy-MM-dd` field: the last
 * instant of that day in the event's timezone. A field that isn't a date gives an invalid date,
 * which keeps the rule ending on a date and fails the validation of the Recurrence tab.
 */
export function getRecurrenceUntil(
  rawDate: string,
  eventTimezone: TemporalTimezone,
): TemporalSupportedObject {
  const plainDate = readDateField(rawDate);
  return plainDate == null
    ? createAdapterDate(NaN)
    : createEndOfPlainDate(plainDate, eventTimezone);
}

/**
 * The canonical IANA identifier of a timezone; `default` and `system` resolve to the system
 * timezone, as the adapter does.
 */
function getTimezoneId(timezone: TemporalTimezone): string {
  const id =
    timezone === 'default' || timezone === 'system'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : timezone;
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
  eventTimezone: TemporalTimezone,
  displayTimezone: TemporalTimezone,
): string | null {
  const eventTimezoneId = getTimezoneId(eventTimezone);
  return eventTimezoneId === getTimezoneId(displayTimezone)
    ? null
    : getTimezoneDisplayName(locale, eventTimezoneId);
}

export function getEndsSelectionFromRRule(rrule?: {
  count?: number | null;
  until?: TemporalSupportedObject | null;
}): EndsSelection {
  if (!rrule) {
    return 'never';
  }
  if (rrule.until) {
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
