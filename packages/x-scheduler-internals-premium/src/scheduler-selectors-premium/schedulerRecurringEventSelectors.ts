import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import {
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventWeekDayCode,
  SchedulerProcessedDate,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { SchedulerState as State } from '@mui/x-scheduler-internals/internals';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';

/**
 * Selectors that wrap the premium recurring-events plugin. The implementations
 * live on the plugin so the secret-sauce code never ships in the MIT bundle;
 * these selectors are just memoized adapters for consumers that prefer the
 * selector API over calling plugin methods directly.
 */
export const schedulerRecurringEventSelectors = {
  presets: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.recurringEvents,
    (
      adapter,
      recurringEvents,
      date: SchedulerProcessedDate,
    ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> | null =>
      recurringEvents?.computePresets(adapter, date) ?? null,
  ),
  defaultPresetKey: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.recurringEvents,
    (
      adapter,
      recurringEvents,
      rule: SchedulerProcessedEventRecurrenceRule | undefined,
      occurrenceStart: SchedulerProcessedDate,
    ): RecurringEventPresetKey | 'custom' | null =>
      recurringEvents?.getDefaultPresetKey(adapter, rule, occurrenceStart) ?? null,
  ),
  isSameRRule: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.recurringEvents,
    (
      adapter,
      recurringEvents,
      rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
      rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
    ): boolean => {
      if (!rruleA && !rruleB) {
        return true;
      }
      if (!rruleA || !rruleB) {
        return false;
      }
      return recurringEvents?.isSameRRule(adapter, rruleA, rruleB) ?? false;
    },
  ),
  weeklyDays: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.recurringEvents,
    schedulerOtherSelectors.visibleDate,
    (
      adapter,
      recurringEvents,
      visibleDate,
    ): { code: RecurringEventWeekDayCode; date: TemporalSupportedObject }[] =>
      recurringEvents?.getWeeklyDays(adapter, visibleDate) ?? [],
  ),
  monthlyReference: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.recurringEvents,
    (
      adapter,
      recurringEvents,
      date: SchedulerProcessedDate,
    ): {
      dayOfMonth: number;
      code: RecurringEventWeekDayCode;
      ord: number;
      date: TemporalSupportedObject;
    } | null => recurringEvents?.getMonthlyReference(adapter, date) ?? null,
  ),
};
