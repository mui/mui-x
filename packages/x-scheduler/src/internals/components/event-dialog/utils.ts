import type {
  SchedulerEvent,
  SchedulerEventColor,
  SchedulerResourceId,
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
  SchedulerProcessedDate,
  SchedulerRenderableEventOccurrence,
  TemporalTimezone,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import { processDate } from '@mui/x-scheduler-internals/process-date';
import { isEventOccurrence } from '@mui/x-scheduler-internals/internals';
import type { EventEditingLocaleText, SchedulerWeekday } from '../../../models';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';

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

export const getWeekdayToken = (adapter: Adapter, value: TemporalSupportedObject) => {
  return WEEKDAYS[adapter.toJsDate(value).getDay()];
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

export function computeRange(
  adapter: Adapter,
  next: Pick<EventDialogFormValues, RangeFormKey>,
  displayTimezone: TemporalTimezone,
) {
  if (next.allDay) {
    return {
      start:
        next.startDate === ''
          ? adapter.now(displayTimezone)
          : adapter.startOfDay(adapter.date(next.startDate, displayTimezone)),
      end:
        next.endDate === ''
          ? adapter.now(displayTimezone)
          : adapter.endOfDay(adapter.date(next.endDate, displayTimezone)),
      surfaceType: 'day-grid' as const,
    };
  }

  return {
    start:
      next.startDate === '' || next.startTime === ''
        ? adapter.now(displayTimezone)
        : adapter.date(`${next.startDate}T${next.startTime}`, displayTimezone),
    end:
      next.endDate === '' || next.endTime === ''
        ? adapter.now(displayTimezone)
        : adapter.date(`${next.endDate}T${next.endTime}`, displayTimezone),
    surfaceType: 'time-grid' as const,
  };
}

export function validateRange(
  adapter: Adapter,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  allDay: boolean,
): null | { field: 'endDate' | 'endTime' } {
  const startDay = adapter.startOfDay(start);
  const endDay = adapter.startOfDay(end);
  // endDay < startDay → date error
  if (adapter.isAfter(startDay, endDay)) {
    return { field: 'endDate' };
  }

  if (adapter.isEqual(startDay, endDay)) {
    if (!allDay && !adapter.isAfter(end, start)) {
      // end <= start → hour error
      return { field: 'endTime' };
    }
  }
  return null;
}

// Structural checks on the documented `yyyy-MM-dd` / `HH:mm` formats: date parsing
// can roll overflowing components over (2025-06-31 → July 1) instead of rejecting them.
const DATE_VALUE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_VALUE_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isWellFormedDate(raw: string): boolean {
  const match = DATE_VALUE_REGEX.exec(raw);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

/**
 * Returns the first date/time field whose value cannot produce a valid date
 * (empty and malformed included), or `null` when they all parse.
 */
export function findInvalidRangeField(
  adapter: Adapter,
  values: Pick<EventDialogFormValues, RangeFormKey>,
  displayTimezone: TemporalTimezone,
): 'startDate' | 'startTime' | 'endDate' | 'endTime' | null {
  const parsesAsDate = (raw: string) =>
    isWellFormedDate(raw) && adapter.isValid(adapter.date(raw, displayTimezone));
  const parsesAsDateTime = (rawDate: string, rawTime: string) =>
    TIME_VALUE_REGEX.test(rawTime) &&
    adapter.isValid(adapter.date(`${rawDate}T${rawTime}`, displayTimezone));

  if (!parsesAsDate(values.startDate)) {
    return 'startDate';
  }
  if (!values.allDay && !parsesAsDateTime(values.startDate, values.startTime)) {
    return 'startTime';
  }
  if (!parsesAsDate(values.endDate)) {
    return 'endDate';
  }
  if (!values.allDay && !parsesAsDateTime(values.endDate, values.endTime)) {
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
  adapter: Adapter,
  start: SchedulerProcessedDate,
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
      const weekday = getWeekdayToken(adapter, start.value);
      const weekdayName = adapter.format(start.value, 'weekday');
      return localeText.recurrenceWeeklyPresetLabel({ weekday, weekdayName });
    }
    case 'MONTHLY': {
      const date = adapter.getDate(start.value);
      return localeText.recurrenceMonthlyPresetLabel(date);
    }
    case 'YEARLY': {
      const normalDate = formatDayOfMonthAndMonthFullLetter(start.value, adapter);
      return localeText.recurrenceYearlyPresetLabel(normalDate);
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
  return isEventOccurrence(occurrence) ? occurrence.dataTimezone.timezone : 'default';
}

/**
 * The occurrence's start in the event's timezone, the day and weekday its recurrence rule
 * is picked against.
 */
export function getEventTimezoneStart(
  adapter: Adapter,
  occurrence: SchedulerRenderableEventOccurrence,
): SchedulerProcessedDate {
  if (isEventOccurrence(occurrence)) {
    return occurrence.dataTimezone.start;
  }
  return processDate(
    adapter.setTimezone(occurrence.displayTimezone.start.value, 'default'),
    adapter,
  );
}

/**
 * The start a recurrence rule picked in the dialog is built on, in the event's timezone: the
 * submitted start when the form moves it (or re-reads it in a display timezone that changed
 * since the form was seeded), the occurrence's own otherwise. While an edited date does not
 * parse, the occurrence's start stands in.
 */
export function getRecurrenceRuleStart(
  adapter: Adapter,
  occurrence: SchedulerRenderableEventOccurrence,
  values: Pick<EventDialogFormValues, RangeFormKey>,
  dirtyValues: Record<string, unknown>,
  displayTimezone: TemporalTimezone,
): SchedulerProcessedDate {
  const { startEdited } = getEditedRangeBounds(dirtyValues, values.allDay);
  const displayTimezoneMoved = displayTimezone !== occurrence.displayTimezone.timezone;
  if (
    (!startEdited && !displayTimezoneMoved) ||
    findInvalidRangeField(adapter, values, displayTimezone) != null
  ) {
    return getEventTimezoneStart(adapter, occurrence);
  }
  const { start } = computeRange(adapter, values, displayTimezone);
  return processDate(adapter.setTimezone(start, getEventTimezone(occurrence)), adapter);
}

/**
 * The IANA identifier of a timezone; the adapter aliases resolve to the system timezone.
 */
function getTimezoneId(timezone: TemporalTimezone): string {
  return timezone === 'default' || timezone === 'system'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : timezone;
}

/**
 * The localized generic name of a timezone (e.g. "Pacific Time"), or its identifier when the
 * runtime has no name for it and would print an offset instead.
 */
function getTimezoneDisplayName(adapter: Adapter, timezoneId: string): string {
  try {
    const name = new Intl.DateTimeFormat(adapter.getCurrentLocaleCode(), {
      timeZone: timezoneId,
      timeZoneName: 'longGeneric',
    })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value;
    return name == null || /^GMT([+-]|$)/.test(name) ? timezoneId : name;
  } catch {
    return timezoneId;
  }
}

/**
 * The name of the event's timezone when it is not the display one, so the days and weekdays
 * of its recurrence rule can be labeled; `null` when both timezones are the same.
 */
export function getRecurrenceTimezoneName(
  adapter: Adapter,
  eventTimezone: TemporalTimezone,
  displayTimezone: TemporalTimezone,
): string | null {
  const eventTimezoneId = getTimezoneId(eventTimezone);
  return eventTimezoneId === getTimezoneId(displayTimezone)
    ? null
    : getTimezoneDisplayName(adapter, eventTimezoneId);
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
