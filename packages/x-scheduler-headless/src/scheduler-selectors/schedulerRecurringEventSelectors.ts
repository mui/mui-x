import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import {
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventWeekDayCode,
  SchedulerProcessedDate,
  TemporalSupportedObject,
} from '../models';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import {
  computeMonthlyOrdinal,
  getWeekDayCode,
  serializeRRule,
} from '../internals/utils/recurring-events';
import { schedulerOtherSelectors } from './schedulerOtherSelectors';

export const schedulerRecurringEventSelectors = {
  /**
   * Builds the presets the user can choose from when creating or editing a recurring event.
   */
  presets: createSelectorMemoized(
    (state: State) => state.adapter,
    (
      adapter,
      date: SchedulerProcessedDate,
    ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> => {
      return {
        DAILY: {
          freq: 'DAILY',
          interval: 1,
        },
        WEEKLY: {
          freq: 'WEEKLY',
          interval: 1,
          byDay: [getWeekDayCode(adapter, date.value)],
        },
        MONTHLY: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [adapter.getDate(date.value)],
        },
        YEARLY: {
          freq: 'YEARLY',
          interval: 1,
        },
      };
    },
  ),
  /**
   * Determines which preset (if any) the given rule corresponds to.
   * If the rule does not correspond to any preset, 'custom' is returned.
   * If no rule is provided, null is returned.
   */
  defaultPresetKey: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.plan,
    (
      adapter,
      plan,
      rule: SchedulerProcessedEventRecurrenceRule | undefined,
      occurrenceStart: SchedulerProcessedDate,
    ): RecurringEventPresetKey | 'custom' | null => {
      if (plan !== 'premium' || !rule) {
        return null;
      }

      const interval = rule.interval ?? 1;
      const neverEnds = !rule.count && !rule.until;
      const hasSelectors = !!(
        rule.byDay?.length ||
        rule.byMonthDay?.length ||
        rule.byMonth?.length
      );

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
    },
  ),
  /**
   * Returns true if both recurrence rules are equivalent.
   */
  isSameRRule: createSelector(
    (state: State) => state.adapter,
    (
      adapter,
      rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
      rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
    ): boolean => {
      if (!rruleA && !rruleB) {
        return true;
      } // Both undefined -> same
      if (!rruleA || !rruleB) {
        return false;
      } // One missing -> different
      return serializeRRule(adapter, rruleA) === serializeRRule(adapter, rruleB);
    },
  ),
  /**
   * Returns the 7 week days with code and date, starting at startOfWeek(visibleDate).
   */
  weeklyDays: createSelectorMemoized(
    (state: State) => state.adapter,
    schedulerOtherSelectors.visibleDate,
    (
      adapter,
      visibleDate,
    ): { code: RecurringEventWeekDayCode; date: TemporalSupportedObject }[] => {
      const start = adapter.startOfWeek(visibleDate);
      return Array.from({ length: 7 }, (_, i) => {
        const date = adapter.addDays(start, i);
        return { code: getWeekDayCode(adapter, date), date };
      });
    },
  ),

  /**
   * Returns month reference for the given occurrence: dayOfMonth, weekday code and ordinal.
   */
  monthlyReference: createSelectorMemoized(
    (state: State) => state.adapter,
    (
      adapter,
      date: SchedulerProcessedDate,
    ): {
      dayOfMonth: number;
      code: RecurringEventWeekDayCode;
      ord: number;
      date: TemporalSupportedObject;
    } => {
      return {
        dayOfMonth: adapter.getDate(date.value),
        code: getWeekDayCode(adapter, date.value),
        ord: computeMonthlyOrdinal(adapter, date.value),
        date: date.value,
      };
    },
  ),
};
