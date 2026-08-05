import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  RecurringEventPresetKey,
  RecurringEventWeekDayCode,
  SchedulerProcessedDate,
  SchedulerProcessedEventRecurrenceRule,
  WeekStartsOn,
} from '@mui/x-scheduler-internals/models';
import { getStartOfWeek } from '@mui/x-scheduler-internals/internals';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';
import { getWeekDayCode } from './internal-utils';

export function computePresets(
  adapter: Adapter,
  date: SchedulerProcessedDate,
): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> {
  return {
    DAILY: { freq: 'DAILY', interval: 1 },
    WEEKLY: { freq: 'WEEKLY', interval: 1, byDay: [getWeekDayCode(adapter, date.value)] },
    MONTHLY: { freq: 'MONTHLY', interval: 1, byMonthDay: [adapter.getDate(date.value)] },
    YEARLY: { freq: 'YEARLY', interval: 1 },
  };
}

export function getDefaultPresetKey(
  adapter: Adapter,
  rule: SchedulerProcessedEventRecurrenceRule | undefined,
  occurrenceStart: SchedulerProcessedDate,
): RecurringEventPresetKey | 'custom' | null {
  if (!rule) {
    return null;
  }

  const interval = rule.interval ?? 1;
  const neverEnds = !rule.count && !rule.until;
  const hasSelectors = !!(rule.byDay?.length || rule.byMonthDay?.length || rule.byMonth?.length);

  switch (rule.freq) {
    case 'DAILY': {
      // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
      return interval === 1 && neverEnds && !hasSelectors ? 'DAILY' : 'custom';
    }
    case 'WEEKLY': {
      // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
      const occurrenceStartWeekDayCode = getWeekDayCode(adapter, occurrenceStart.value);
      const byDay = rule.byDay ?? [];
      const matchesDefaultByDay =
        byDay.length === 0 || (byDay.length === 1 && byDay[0] === occurrenceStartWeekDayCode);
      const isPresetWeekly =
        interval === 1 &&
        neverEnds &&
        matchesDefaultByDay &&
        !(rule.byMonthDay?.length || rule.byMonth?.length);
      return isPresetWeekly ? 'WEEKLY' : 'custom';
    }
    case 'MONTHLY': {
      // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
      const day = adapter.getDate(occurrenceStart.value);
      const byMonthDay = rule.byMonthDay ?? [];
      const matchesDefaultByMonthDay =
        byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
      const isPresetMonthly =
        interval === 1 &&
        neverEnds &&
        matchesDefaultByMonthDay &&
        !(rule.byDay?.length || rule.byMonth?.length);
      return isPresetMonthly ? 'MONTHLY' : 'custom';
    }
    case 'YEARLY': {
      // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
      return interval === 1 && neverEnds && !hasSelectors ? 'YEARLY' : 'custom';
    }
    default:
      return 'custom';
  }
}

export function getWeeklyDays(
  adapter: Adapter,
  visibleDate: TemporalSupportedObject,
  weekStartsOn?: WeekStartsOn,
): { code: RecurringEventWeekDayCode; date: TemporalSupportedObject }[] {
  const start = getStartOfWeek(adapter, visibleDate, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => {
    const date = adapter.addDays(start, i);
    return { code: getWeekDayCode(adapter, date), date };
  });
}

export function getMonthlyReference(
  adapter: Adapter,
  date: SchedulerProcessedDate,
): {
  dayOfMonth: number;
  code: RecurringEventWeekDayCode;
  ord: number;
  date: TemporalSupportedObject;
} {
  return {
    dayOfMonth: adapter.getDate(date.value),
    code: getWeekDayCode(adapter, date.value),
    ord: computeMonthlyOrdinal(adapter, date.value),
    date: date.value,
  };
}
