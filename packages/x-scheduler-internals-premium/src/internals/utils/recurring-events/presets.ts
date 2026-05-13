import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/base-ui-copy';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  RecurringEventPresetKey,
  RecurringEventWeekDayCode,
  SchedulerProcessedDate,
  SchedulerProcessedEventRecurrenceRule,
} from '@mui/x-scheduler-internals/models';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';
import { getWeekDayCode } from './internal-utils';

/**
 * Builds the four recurrence presets (DAILY / WEEKLY / MONTHLY / YEARLY) the
 * user can choose from when editing an event. The WEEKLY and MONTHLY presets
 * are anchored to the event's occurrence date (weekday for WEEKLY, day of the
 * month for MONTHLY).
 */
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

/**
 * Maps a rule back to the preset key it was generated from, or returns
 * `'custom'` when the rule does not match any preset. `null` is returned for
 * missing rules.
 */
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
      return interval === 1 && neverEnds && !hasSelectors ? 'DAILY' : 'custom';
    }
    case 'WEEKLY': {
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
      return interval === 1 && neverEnds && !hasSelectors ? 'YEARLY' : 'custom';
    }
    default:
      return 'custom';
  }
}

/**
 * Returns the seven weekdays of the week containing `visibleDate`, each with
 * its weekday code and date. Used by the recurrence tab to render the weekday
 * selectors for WEEKLY rrules.
 */
export function getWeeklyDays(
  adapter: Adapter,
  visibleDate: TemporalSupportedObject,
): { code: RecurringEventWeekDayCode; date: TemporalSupportedObject }[] {
  const start = adapter.startOfWeek(visibleDate);
  return Array.from({ length: 7 }, (_, i) => {
    const date = adapter.addDays(start, i);
    return { code: getWeekDayCode(adapter, date), date };
  });
}

/**
 * Returns the monthly reference data (day of month, weekday code, ordinal
 * within the month) for a given date. Used by the recurrence tab to render
 * the "12th of the month" vs "2nd Tuesday of the month" options.
 */
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
