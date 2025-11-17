import {
  SchedulerEventColor,
  SchedulerResourceId,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
  SchedulerValidDate,
  SchedulerProcessedDate,
} from '@mui/x-scheduler-headless/models';
import { Adapter } from '@mui/x-scheduler-headless/use-adapter';
import { SchedulerTranslations } from '../../../models';

export interface ControlledValue {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  resourceId: SchedulerResourceId | null;
  allDay: boolean;
  colorId: SchedulerEventColor | null;
  recurrenceSelection: RecurringEventPresetKey | null | 'custom';
  rruleDraft: RecurringEventRecurrenceRule;
}

export type EndsSelection = 'never' | 'after' | 'until';

export function computeRange(adapter: Adapter, next: ControlledValue) {
  if (next.allDay) {
    const newStart = adapter.startOfDay(adapter.date(next.startDate));
    const newEnd = adapter.endOfDay(adapter.date(next.endDate));
    return { start: newStart, end: newEnd, surfaceType: 'day-grid' as const };
  }
  // fallback values
  const startTime = next.startTime || '12:00';
  const endTime = next.endTime || '12:30';

  const newStart = adapter.date(`${next.startDate}T${startTime}`);
  const newEnd = adapter.date(`${next.endDate}T${endTime}`);

  return { start: newStart, end: newEnd, surfaceType: 'time-grid' as const };
}

export function validateRange(
  adapter: Adapter,
  start: SchedulerValidDate,
  end: SchedulerValidDate,
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
  translations: SchedulerTranslations,
): string {
  if (!recurrenceKey) {
    return translations.recurrenceNoRepeat;
  }

  switch (recurrenceKey) {
    case 'daily':
      return translations.recurrenceDailyPresetLabel;
    case 'weekly': {
      const weekday = adapter.format(start.value, 'weekday');
      return translations.recurrenceWeeklyPresetLabel(weekday);
    }
    case 'monthly': {
      const date = adapter.getDate(start.value);
      return translations.recurrenceMonthlyPresetLabel(date);
    }
    case 'yearly': {
      const normalDate = adapter.format(start.value, 'normalDate');
      return translations.recurrenceYearlyPresetLabel(normalDate);
    }
    case 'custom':
      return translations.recurrenceCustomRepeat;
    default:
      return translations.recurrenceNoRepeat;
  }
}

export function getEndsSelectionFromRRule(rrule?: {
  count?: number | null;
  until?: SchedulerValidDate | null;
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
