import { Adapter } from './adapter/types';
import { ByDayCode, CalendarEvent, RRuleSpec, SchedulerValidDate } from '../models';

export const NUM_TO_BYDAY: Record<number, ByDayCode> = {
  1: 'MO',
  2: 'TU',
  3: 'WE',
  4: 'TH',
  5: 'FR',
  6: 'SA',
  7: 'SU',
};

export const BYDAY_TO_NUM: Record<ByDayCode, 1 | 2 | 3 | 4 | 5 | 6 | 7> = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 7,
};

// Validate WEEKLY BYDAY and return ByDayCode[] (or fallback)
export function weeklyByDayCodes(
  ruleByDay: RRuleSpec['byDay'],
  fallback: ByDayCode[],
): ByDayCode[] {
  if (!ruleByDay?.length) {
    return fallback;
  }
  if (!ruleByDay.every((v) => /^(MO|TU|WE|TH|FR|SA|SU)$/.test(v as string))) {
    throw new Error(
      'WEEKLY expects plain BYDAY codes (MO..SU), ordinals like 1MO or -1FR are not valid.',
    );
  }
  return ruleByDay as ByDayCode[];
}

export type RecurrencePresetKey = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function detectRecurrenceKeyFromRule(
  adapter: Adapter,
  rule: CalendarEvent['rrule'] | undefined,
  start: SchedulerValidDate,
): RecurrencePresetKey | 'custom' | null {
  if (!rule) {
    return null;
  }

  const interval = rule.interval ?? 1;
  const neverEnds = !rule.count && !rule.until;
  const hasSelectors = !!(rule.byDay?.length || rule.byMonthDay?.length || rule.byMonth?.length);

  switch (rule.freq) {
    case 'DAILY': {
      // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
      return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
    }

    case 'WEEKLY': {
      // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
      const startDowCode = NUM_TO_BYDAY[adapter.getDayOfWeek(start)];
      const byDay = rule.byDay ?? [];
      const matchesDefaultByDay =
        byDay.length === 0 || (byDay.length === 1 && byDay[0] === startDowCode);
      const isPresetWeekly =
        interval === 1 &&
        neverEnds &&
        matchesDefaultByDay &&
        !(rule.byMonthDay?.length || rule.byMonth?.length);

      return isPresetWeekly ? 'weekly' : 'custom';
    }

    case 'MONTHLY': {
      // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
      const day = adapter.getDate(start);
      const byMonthDay = rule.byMonthDay ?? [];
      const matchesDefaultByMonthDay =
        byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
      const isPresetMonthly =
        interval === 1 &&
        neverEnds &&
        matchesDefaultByMonthDay &&
        !(rule.byDay?.length || rule.byMonth?.length);

      return isPresetMonthly ? 'monthly' : 'custom';
    }

    case 'YEARLY': {
      // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
      return interval === 1 && neverEnds && !hasSelectors ? 'yearly' : 'custom';
    }

    default:
      return 'custom';
  }
}

export function buildRecurrencePresets(
  adapter: Adapter,
  start: SchedulerValidDate,
): Record<RecurrencePresetKey, RRuleSpec> {
  const startDowCode = NUM_TO_BYDAY[adapter.getDayOfWeek(start)];
  const startDayOfMonth = adapter.getDate(start);

  return {
    daily: {
      freq: 'DAILY',
      interval: 1,
    },
    weekly: {
      freq: 'WEEKLY',
      interval: 1,
      byDay: [startDowCode],
    },
    monthly: {
      freq: 'MONTHLY',
      interval: 1,
      byMonthDay: [startDayOfMonth],
    },
    yearly: {
      freq: 'YEARLY',
      interval: 1,
    },
  };
}
