import { createSelectorMemoized } from '@base-ui/utils/store';
import type { RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule } from '../models';
import type { PlainDate } from '../internals/utils/base-temporal/PlainDate';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

const selectRecurringEventsPlugin = (state: State) => state.recurringEventsPlugin;

/** Memoized selectors that delegate to the recurring-events plugin. */
export const schedulerRecurringEventSelectors = {
  presets: createSelectorMemoized(
    selectRecurringEventsPlugin,
    (
      recurringEventsPlugin,
      plainDate: PlainDate,
    ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> | null =>
      recurringEventsPlugin?.computePresets(plainDate) ?? null,
  ),
  defaultPresetKey: createSelectorMemoized(
    selectRecurringEventsPlugin,
    (
      recurringEventsPlugin,
      rule: SchedulerProcessedEventRecurrenceRule | undefined,
      occurrenceStartPlainDate: PlainDate,
    ): RecurringEventPresetKey | 'custom' | null =>
      recurringEventsPlugin?.getDefaultPresetKey(rule, occurrenceStartPlainDate) ?? null,
  ),
  isSameRRule: (
    state: State,
    rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
    rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
  ): boolean => {
    if (!rruleA && !rruleB) {
      return true;
    }
    if (!rruleA || !rruleB) {
      return false;
    }
    return selectRecurringEventsPlugin(state)?.isSameRRule(state.adapter, rruleA, rruleB) ?? false;
  },
};
