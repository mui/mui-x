import type {
  RecurringEventPresetKey,
  RecurringEventWeekDayCode,
  SchedulerProcessedEventRecurrenceRule,
  WeekStartsOn,
} from '@mui/x-scheduler-internals/models';
import { getPlainDateWeekStart } from '@mui/x-scheduler-internals/internals';
import type { PlainDate } from '@mui/x-scheduler-internals/internals';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';
import { getPlainDateWeekDayCode } from './internal-utils';

export function computePresets(
  plainDate: PlainDate,
): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> {
  return {
    DAILY: { freq: 'DAILY', interval: 1 },
    WEEKLY: { freq: 'WEEKLY', interval: 1, byDay: [getPlainDateWeekDayCode(plainDate)] },
    MONTHLY: { freq: 'MONTHLY', interval: 1, byMonthDay: [plainDate.day] },
    YEARLY: { freq: 'YEARLY', interval: 1 },
  };
}

export function getDefaultPresetKey(
  rule: SchedulerProcessedEventRecurrenceRule | undefined,
  occurrenceStartPlainDate: PlainDate,
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
      const occurrenceStartWeekDayCode = getPlainDateWeekDayCode(occurrenceStartPlainDate);
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
      const day = occurrenceStartPlainDate.day;
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

/**
 * Returns the 7 week days with their code and date, starting at the start of the week containing
 * `visiblePlainDate`.
 */
export function getWeeklyDays(
  visiblePlainDate: PlainDate,
  weekStartsOn: WeekStartsOn,
): { code: RecurringEventWeekDayCode; date: PlainDate }[] {
  const weekStartPlainDate = getPlainDateWeekStart(visiblePlainDate, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => {
    const plainDate = weekStartPlainDate.add({ days: i });
    return { code: getPlainDateWeekDayCode(plainDate), date: plainDate };
  });
}

/**
 * Returns the monthly reference of a date: its day of the month, its weekday code and the ordinal
 * of that weekday in the month.
 */
export function getMonthlyReference(plainDate: PlainDate): {
  dayOfMonth: number;
  code: RecurringEventWeekDayCode;
  ord: number;
} {
  return {
    dayOfMonth: plainDate.day,
    code: getPlainDateWeekDayCode(plainDate),
    ord: computeMonthlyOrdinal(plainDate),
  };
}
