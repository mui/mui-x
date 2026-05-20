import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import {
  RecurringEventPresetKey,
  SchedulerProcessedEventRecurrenceRule,
  SchedulerProcessedDate,
} from '../models';
import { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

const selectRecurringEventsPlugin = (state: State) => state.recurringEventsPlugin;

/** Memoized selectors that delegate to the recurring-events plugin. */
export const schedulerRecurringEventSelectors = {
  presets: createSelectorMemoized(
    (state: State) => state.adapter,
    selectRecurringEventsPlugin,
    (
      adapter,
      recurringEventsPlugin,
      date: SchedulerProcessedDate,
    ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> | null =>
      recurringEventsPlugin?.computePresets(adapter, date) ?? null,
  ),
  defaultPresetKey: createSelectorMemoized(
    (state: State) => state.adapter,
    selectRecurringEventsPlugin,
    (
      adapter,
      recurringEventsPlugin,
      rule: SchedulerProcessedEventRecurrenceRule | undefined,
      occurrenceStart: SchedulerProcessedDate,
    ): RecurringEventPresetKey | 'custom' | null =>
      recurringEventsPlugin?.getDefaultPresetKey(adapter, rule, occurrenceStart) ?? null,
  ),
  isSameRRule: createSelector(
    (state: State) => state.adapter,
    selectRecurringEventsPlugin,
    (
      adapter,
      recurringEventsPlugin,
      rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
      rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
    ): boolean => {
      if (!rruleA && !rruleB) {
        return true;
      }
      if (!rruleA || !rruleB) {
        return false;
      }
      return recurringEventsPlugin?.isSameRRule(adapter, rruleA, rruleB) ?? false;
    },
  ),
};
