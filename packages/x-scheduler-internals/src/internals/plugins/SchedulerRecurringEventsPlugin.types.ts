import type { TemporalSupportedObject, TemporalTimezone } from '../../base-ui-copy/types';
import type {
  RecurringEventPresetKey,
  RecurringEventUpdateScope,
  RecurringEventWeekDayCode,
  SchedulerEventCreationProperties,
  SchedulerEventOccurrence,
  SchedulerEventRecurrenceRule,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedDate,
  SchedulerProcessedEvent,
  SchedulerProcessedEventRecurrenceRule,
} from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { UpdateEventsParameters } from '../utils/SchedulerStore/SchedulerStore.types';

/** Contract implemented by the premium recurring-events plugin. */
export interface SchedulerRecurringEventsPluginInterface {
  parseRRule(
    adapter: Adapter,
    input: string | SchedulerEventRecurrenceRule,
    timezone: TemporalTimezone,
  ): SchedulerProcessedEventRecurrenceRule;

  serializeRRule(adapter: Adapter, rule: SchedulerProcessedEventRecurrenceRule): string;

  projectRRuleToTimezone(
    adapter: Adapter,
    rrule: SchedulerProcessedEventRecurrenceRule,
    targetTimezone: TemporalTimezone,
    seriesStartDataTimezone: TemporalSupportedObject,
  ): SchedulerProcessedEventRecurrenceRule;

  getOccurrencesForVisibleDays(
    event: SchedulerProcessedEvent,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
    adapter: Adapter,
    displayTimezone: TemporalTimezone,
  ): SchedulerEventOccurrence[];

  updateRecurringEvent(
    adapter: Adapter,
    originalEvent: SchedulerProcessedEvent,
    occurrenceStart: TemporalSupportedObject,
    changes: SchedulerEventUpdatedProperties,
    scope: RecurringEventUpdateScope,
  ): UpdateEventsParameters;

  createEventFromRecurringEvent(
    originalEvent: SchedulerProcessedEvent,
    changes: Partial<SchedulerEventCreationProperties>,
  ): SchedulerEventCreationProperties;

  applyDataTimezoneToEventUpdate(params: {
    adapter: Adapter;
    originalEvent: SchedulerProcessedEvent;
    changes: SchedulerEventUpdatedProperties;
  }): SchedulerEventUpdatedProperties;

  /**
   * Builds the recurrence presets (Daily / Weekly / Monthly / Yearly)
   * the user can choose from when editing an event.
   */
  computePresets(
    adapter: Adapter,
    date: SchedulerProcessedDate,
  ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule>;

  /**
   * Determines which preset (if any) the given rule corresponds to.
   * Returns 'custom' if the rule does not match any preset, or `null` if no rule is provided.
   */
  getDefaultPresetKey(
    adapter: Adapter,
    rule: SchedulerProcessedEventRecurrenceRule | undefined,
    occurrenceStart: SchedulerProcessedDate,
  ): RecurringEventPresetKey | 'custom' | null;

  /**
   * Returns `true` if both recurrence rules serialize to the same RRULE string.
   */
  isSameRRule(
    adapter: Adapter,
    rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
    rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
  ): boolean;

  /**
   * Returns the 7 week days with their code and date,
   * starting at the start of the week containing the given visible date.
   */
  getWeeklyDays(
    adapter: Adapter,
    visibleDate: TemporalSupportedObject,
  ): { code: RecurringEventWeekDayCode; date: TemporalSupportedObject }[];

  /**
   * Returns month reference for the given occurrence: dayOfMonth, weekday code and ordinal.
   */
  getMonthlyReference(
    adapter: Adapter,
    date: SchedulerProcessedDate,
  ): {
    dayOfMonth: number;
    code: RecurringEventWeekDayCode;
    ord: number;
    date: TemporalSupportedObject;
  };
}
