import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  RecurringEventPresetKey,
  RecurringEventScope,
  RecurringEventWeekDayCode,
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
  /**
   * Parses a recurrence rule into a canonical `SchedulerProcessedEventRecurrenceRule`
   * expressed in the given timezone. String inputs are validated against RFC5545; object
   * inputs are trusted and normalized.
   */
  parseRRule(
    adapter: Adapter,
    input: string | SchedulerEventRecurrenceRule,
    timezone: TemporalTimezone,
  ): SchedulerProcessedEventRecurrenceRule;

  /**
   * Expands a recurring event into the occurrences that fall within the visible range,
   * honoring COUNT/UNTIL boundaries and EXDATE exclusions.
   */
  getOccurrencesForVisibleDays(
    event: SchedulerProcessedEvent,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
    adapter: Adapter,
    displayTimezone: TemporalTimezone,
  ): SchedulerEventOccurrence[];

  /**
   * Generates the update payload to apply when editing a recurring event, scoped to
   * a single occurrence, the occurrence and the following ones, or the entire series.
   */
  updateRecurringEvent(
    adapter: Adapter,
    originalEvent: SchedulerProcessedEvent,
    occurrenceStart: TemporalSupportedObject,
    changes: SchedulerEventUpdatedProperties,
    scope: RecurringEventScope,
  ): UpdateEventsParameters;

  /**
   * Generates the update payload to apply when deleting a recurring event, scoped to
   * a single occurrence, the occurrence and the following ones, or the entire series.
   */
  deleteRecurringEvent(
    adapter: Adapter,
    originalEvent: SchedulerProcessedEvent,
    occurrenceStart: TemporalSupportedObject,
    scope: RecurringEventScope,
  ): UpdateEventsParameters;

  /**
   * Relabels the display-timezone dates of an update (start/end/exDates) into the event's
   * data timezone before they are persisted. The rule is already expressed there.
   */
  applyDataTimezoneToEventUpdate(params: {
    adapter: Adapter;
    originalEvent: SchedulerProcessedEvent;
    changes: SchedulerEventUpdatedProperties;
  }): SchedulerEventUpdatedProperties;

  /**
   * Builds the recurrence presets (Daily / Weekly / Monthly / Yearly)
   * the user can choose from when editing an event.
   * `date` is the event's start in its own timezone.
   */
  computePresets(
    adapter: Adapter,
    date: SchedulerProcessedDate,
  ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule>;

  /**
   * Determines which preset (if any) the given rule corresponds to.
   * Returns 'custom' if the rule does not match any preset, or `null` if no rule is provided.
   * `occurrenceStart` is the occurrence's start in the event's timezone.
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
