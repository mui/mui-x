import { createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  SchedulerEvent,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
  CalendarProcessedDate,
} from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { getWeekDayCode } from '../utils/recurring-event-utils';

export const schedulerRecurringEventSelectors = {
  /**
   * Builds the presets the user can choose from when creating or editing a recurring event.
   */
  presets: createSelectorMemoized(
    (state: State) => state.adapter,
    (
      adapter,
      date: CalendarProcessedDate,
    ): Record<RecurringEventPresetKey, RecurringEventRecurrenceRule> => {
      return {
        daily: {
          freq: 'DAILY',
          interval: 1,
        },
        weekly: {
          freq: 'WEEKLY',
          interval: 1,
          byDay: [getWeekDayCode(adapter, date.value)],
        },
        monthly: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [adapter.getDate(date.value)],
        },
        yearly: {
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
    (
      adapter,
      rule: SchedulerEvent['rrule'] | undefined,
      occurrenceStart: CalendarProcessedDate,
    ): RecurringEventPresetKey | 'custom' | null => {
      if (!rule) {
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
          return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
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

          return isPresetWeekly ? 'weekly' : 'custom';
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

          return isPresetMonthly ? 'monthly' : 'custom';
        }

        case 'YEARLY': {
          // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
          return interval === 1 && neverEnds && !hasSelectors ? 'yearly' : 'custom';
        }

        default:
          return 'custom';
      }
    },
  ),
};
