import { Adapter } from '../../../../primitives/utils/adapter/types';
import {
  CalendarEvent,
  RecurrenceFrequency,
  RecurrenceRule,
  SchedulerValidDate,
} from '../../../../primitives/models';

function sameSet(a: number[] = [], b: number[] = []) {
  if (a.length !== b.length) {
    return false;
  }
  const set = new Set(a);
  return b.every((x) => set.has(x));
}

export function detectRecurrenceKeyFromRule(
  adapter: Adapter,
  rule: CalendarEvent['recurrenceRule'] | undefined,
  start: SchedulerValidDate,
): RecurrenceFrequency | 'custom' | null {
  if (!rule) {
    return null;
  }

  switch (rule.frequency) {
    case 'daily':
      return rule.interval === 1 && rule.end?.type === 'never' ? 'daily' : 'custom';

    case 'weekly': {
      if (!Array.isArray(rule.daysOfWeek) || rule.daysOfWeek.length === 0) {
        throw new Error(
          [
            'Invalid weekly recurrence rule.',
            'The "daysOfWeek" array is required for frequency "weekly".',
            `Got: ${JSON.stringify(rule.daysOfWeek)}`,
          ].join('\n'),
        );
      }

      const isPresetWeekly =
        rule.interval === 1 &&
        rule.end?.type === 'never' &&
        sameSet([adapter.getDayOfWeek(start)], rule.daysOfWeek);

      return isPresetWeekly ? 'weekly' : 'custom';
    }

    case 'monthly': {
      const sameOnDate =
        rule.monthly?.mode === 'onDate' && rule.monthly.day === adapter.getDate(start);
      return rule.interval === 1 && rule.end?.type === 'never' && sameOnDate ? 'monthly' : 'custom';
    }

    case 'yearly':
      return rule.interval === 1 && rule.end?.type === 'never' ? 'yearly' : 'custom';

    default:
      throw new Error(
        [
          'Invalid recurrence frequency.',
          'Expected: "daily" | "weekly" | "monthly" | "yearly".',
          `Got: ${JSON.stringify(rule.frequency)}`,
        ].join('\n'),
      );
  }
}

export function buildRecurrencePresets(
  adapter: Adapter,
  start: SchedulerValidDate,
): Record<RecurrenceFrequency, RecurrenceRule> {
  return {
    daily: {
      frequency: 'daily',
      interval: 1,
      end: { type: 'never' },
    },
    weekly: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [adapter.getDayOfWeek(start)],
      end: { type: 'never' },
    },
    monthly: {
      frequency: 'monthly',
      interval: 1,
      monthly: {
        mode: 'onDate',
        day: adapter.getDate(start),
      },
      end: { type: 'never' },
    },
    yearly: {
      frequency: 'yearly',
      interval: 1,
      end: { type: 'never' },
    },
  };
}
