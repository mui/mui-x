import type {
  SchedulerEventColor,
  SchedulerResourceId,
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
  SchedulerProcessedDate,
  TemporalTimezone,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
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

// The `-?` mapped type makes a key added to the interface but missing here a compile error.
const BUILT_IN_FORM_KEYS_LOOKUP: { [P in keyof EventDialogBuiltInFormValues]-?: true } = {
  title: true,
  description: true,
  startDate: true,
  startTime: true,
  endDate: true,
  endTime: true,
  resourceIds: true,
  allDay: true,
  color: true,
  recurrenceSelection: true,
  rruleDraft: true,
};

/**
 * Form keys handled by the built-in submit logic. Every other key in the values
 * bag is a custom field; the ones the user edited are spread onto the event as-is.
 */
export const BUILT_IN_FORM_KEYS: ReadonlySet<string> = new Set(
  Object.keys(BUILT_IN_FORM_KEYS_LOOKUP),
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

export function computeRange(
  adapter: Adapter,
  next: Pick<EventDialogFormValues, 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'allDay'>,
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

/**
 * Returns the first date/time field whose value cannot produce a valid date
 * (empty included), or `null` when they all parse.
 */
export function findInvalidRangeField(
  adapter: Adapter,
  values: Pick<EventDialogFormValues, 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'allDay'>,
  displayTimezone: TemporalTimezone,
): 'startDate' | 'startTime' | 'endDate' | 'endTime' | null {
  const parsesAsDate = (raw: string) =>
    raw !== '' && adapter.isValid(adapter.date(raw, displayTimezone));
  const parsesAsDateTime = (rawDate: string, rawTime: string) =>
    rawTime !== '' && adapter.isValid(adapter.date(`${rawDate}T${rawTime}`, displayTimezone));

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
