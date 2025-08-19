import { Adapter } from '../../../../primitives/utils/adapter/types';
import {
  ByDayCode,
  CalendarEvent,
  RRuleSpec,
  SchedulerValidDate,
} from '../../../../primitives/models';

export type RecurrencePresetKey = 'daily' | 'weekly' | 'monthly' | 'yearly';

function sameSet<T>(a: T[] = [], b: T[] = []) {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size !== sb.size) {
    return false;
  }
  for (const x of sa) {
    if (!sb.has(x)) {
      return false;
    }
  }
  return true;
}

const NUM_TO_BYDAY: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, ByDayCode> = {
  1: 'MO',
  2: 'TU',
  3: 'WE',
  4: 'TH',
  5: 'FR',
  6: 'SA',
  7: 'SU',
};

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
      const isPresetWeekly =
        interval === 1 &&
        neverEnds &&
        sameSet(byDay, [startDowCode]) &&
        !(rule.byMonthDay?.length || rule.byMonth?.length);

      return isPresetWeekly ? 'weekly' : 'custom';
    }

    case 'MONTHLY': {
      // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
      const day = adapter.getDate(start);
      const byMonthDay = rule.byMonthDay ?? [];
      const isPresetMonthly =
        interval === 1 &&
        neverEnds &&
        sameSet(byMonthDay, [day]) &&
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
