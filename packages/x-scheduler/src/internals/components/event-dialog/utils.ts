import {
  SchedulerEventColor,
  SchedulerResourceId,
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  TemporalSupportedObject,
  SchedulerProcessedDate,
  TemporalTimezone,
} from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { EventDialogLocaleText } from '../../../models';
import { formatDayOfMonthAndMonthFullLetter } from '../../utils/date-utils';

export interface ControlledValue {
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

export type EndsSelection = 'never' | 'after' | 'until';

export function computeRange(
  adapter: Adapter,
  next: ControlledValue,
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
  recurrenceKey: string | null,
  localeText: EventDialogLocaleText,
): string {
  if (!recurrenceKey) {
    return localeText.recurrenceNoRepeat;
  }

  switch (recurrenceKey) {
    case 'daily':
      return localeText.recurrenceDailyPresetLabel;
    case 'weekly': {
      const weekday = adapter.format(start.value, 'weekday');
      return localeText.recurrenceWeeklyPresetLabel(weekday);
    }
    case 'monthly': {
      const date = adapter.getDate(start.value);
      return localeText.recurrenceMonthlyPresetLabel(date);
    }
    case 'yearly': {
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
