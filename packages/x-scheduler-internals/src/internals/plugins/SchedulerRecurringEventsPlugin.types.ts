import type { TemporalSupportedObject, TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  RecurringEventPresetKey,
  RecurringEventScope,
  SchedulerEventOccurrence,
  SchedulerEventRecurrenceRule,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  SchedulerProcessedEventRecurrenceRule,
} from '../../models';
import type { Adapter } from '../../use-adapter/useAdapter.types';
import type { BaseTemporal } from '../utils/base-temporal';
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
   * Expands a recurring event into the occurrences that fall within the visible range, from the
   * timestamp `start` to the timestamp `end`, both included, honoring COUNT/UNTIL boundaries and
   * EXDATE exclusions.
   */
  getOccurrencesForVisibleDays(
    event: SchedulerProcessedEvent,
    start: number,
    end: number,
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
   * Builds the recurrence presets (Daily / Weekly / Monthly / Yearly)
   * the user can choose from when editing an event.
   * `plainDate` is the date of the event's start in its own timezone.
   */
  computePresets(
    plainDate: BaseTemporal.PlainDate,
  ): Record<RecurringEventPresetKey, SchedulerProcessedEventRecurrenceRule>;

  /**
   * Determines which preset (if any) the given rule corresponds to.
   * Returns 'custom' if the rule does not match any preset, or `null` if no rule is provided.
   * `occurrenceStartPlainDate` is the date of the occurrence's start in the event's timezone.
   */
  getDefaultPresetKey(
    rule: SchedulerProcessedEventRecurrenceRule | undefined,
    occurrenceStartPlainDate: BaseTemporal.PlainDate,
  ): RecurringEventPresetKey | 'custom' | null;

  /**
   * Returns `true` if both recurrence rules serialize to the same RRULE string.
   */
  isSameRRule(
    adapter: Adapter,
    rruleA: SchedulerProcessedEventRecurrenceRule | undefined,
    rruleB: SchedulerProcessedEventRecurrenceRule | undefined,
  ): boolean;
}
