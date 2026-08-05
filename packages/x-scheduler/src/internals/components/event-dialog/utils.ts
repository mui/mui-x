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
import type { EventDialogLocaleText, SchedulerWeekday } from '../../../models';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';

/**
 * Form values handled by the built-in submit logic.
 */
export interface EventDialogBuiltInFormValues {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  resourceId: SchedulerResourceId | null;
  allDay: boolean;
  color: SchedulerEventColor | null;
  recurrenceSelection: RecurringEventPresetKey | null | 'custom';
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
  resourceId: true,
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
): null | { field: 'startDate' | 'startTime' } {
  const startDay = adapter.startOfDay(start);
  const endDay = adapter.startOfDay(end);
  // endDay <= startDay → date error
  if (adapter.isAfter(startDay, endDay)) {
    return { field: 'startDate' };
  }

  if (adapter.isEqual(startDay, endDay)) {
    if (!allDay && !adapter.isAfter(end, start)) {
      // end <= start → hour error
      return { field: 'startTime' };
    }
  }
  return null;
}

export function getRecurrenceLabel(
  adapter: Adapter,
  start: SchedulerProcessedDate,
  recurrenceKey: RecurringEventPresetKey | 'custom' | null,
  localeText: EventDialogLocaleText,
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
