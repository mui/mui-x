import type { RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule } from '../models';
import type { BaseTemporal } from '../internals/utils/base-temporal';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';

const selectRecurringEventsPlugin = (state: State) => state.recurringEventsPlugin;

/** Selectors that delegate to the recurring-events plugin. */
export const schedulerRecurringEventSelectors = {
  presets: (
    state: State,
    plainDate: BaseTemporal.PlainDate,
  ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule> | null =>
    selectRecurringEventsPlugin(state)?.computePresets(plainDate) ?? null,
  defaultPresetKey: (
    state: State,
    rule: SchedulerProcessedEventRecurrenceRule | undefined,
    occurrenceStartPlainDate: BaseTemporal.PlainDate,
  ): RecurringEventPresetKey | 'custom' | null =>
    selectRecurringEventsPlugin(state)?.getDefaultPresetKey(rule, occurrenceStartPlainDate) ?? null,
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
