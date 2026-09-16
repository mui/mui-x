import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  SchedulerProcessedEventRecurrenceRule,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { projectRRuleToTimezone } from './projectRRuleToTimezone';

export function applyDataTimezoneToEventUpdate({
  adapter,
  originalEvent,
  changes,
  occurrenceStart,
}: {
  adapter: Adapter;
  originalEvent: SchedulerProcessedEvent;
  changes: SchedulerEventUpdatedProperties;
  /**
   * The start of the edited occurrence, in the data timezone.
   * Defaults to the event's stored start.
   */
  occurrenceStart?: TemporalSupportedObject;
}): SchedulerEventUpdatedProperties {
  const dataTz = originalEvent.dataTimezone.timezone;

  const toDataTz = (date: TemporalSupportedObject) => adapter.setTimezone(date, dataTz);

  const result: SchedulerEventUpdatedProperties = { ...changes };

  if (result.start) {
    result.start = toDataTz(result.start);
  }

  if (result.end) {
    result.end = toDataTz(result.end);
  }

  if (result.exDates?.length) {
    result.exDates = result.exDates.map(toDataTz);
  }

  if (result.rrule && typeof result.rrule === 'object') {
    result.rrule = projectRRuleFromDisplayToData({
      adapter,
      displayRRule: result.rrule,
      originalEvent,
      occurrenceStart,
      editedStart: changes.start,
    });
  }

  return result;
}

export function projectRRuleFromDisplayToData({
  adapter,
  displayRRule,
  originalEvent,
  occurrenceStart,
  editedStart,
}: {
  adapter: Adapter;
  displayRRule: SchedulerProcessedEventRecurrenceRule;
  originalEvent: SchedulerProcessedEvent;
  /** The start of the edited occurrence, in the data timezone. Defaults to the stored start. */
  occurrenceStart?: TemporalSupportedObject;
  /** The submitted start, when the update moves it. */
  editedStart?: TemporalSupportedObject;
}): SchedulerProcessedEventRecurrenceRule {
  const displayTz = originalEvent.displayTimezone.timezone;
  const dataTz = originalEvent.dataTimezone.timezone;

  // The rule is picked against the edited occurrence as displayed and stored with the start it
  // ends up with, so the day shift between the two timezones is read from there.
  const occurrenceStartDisplay = adapter.setTimezone(
    occurrenceStart ?? originalEvent.dataTimezone.start.value,
    displayTz,
  );
  const ruleStartDisplay = editedStart
    ? adapter.setTimezone(editedStart, displayTz)
    : occurrenceStartDisplay;

  const projected = projectRRuleToTimezone(adapter, displayRRule, dataTz, ruleStartDisplay);

  // A value read back from the stored rule and left in the selection keeps its stored value:
  // the display value alone cannot tell a projected day from a custom one. That holds while
  // the start still crosses the day boundary the same way; otherwise the read values stand
  // for other days and the projection above is the one to trust.
  const storedRule = originalEvent.dataTimezone.rrule;
  const shiftsDay = (start: TemporalSupportedObject) =>
    adapter.getDate(start) !== adapter.getDate(adapter.setTimezone(start, dataTz));
  if (
    storedRule?.freq !== displayRRule.freq ||
    shiftsDay(ruleStartDisplay) !== shiftsDay(occurrenceStartDisplay)
  ) {
    return projected;
  }
  const storedStart = originalEvent.dataTimezone.start.value;
  if (displayRRule.byDay != null && storedRule.byDay != null) {
    return {
      ...projected,
      byDay: mergeReadSelection(
        displayRRule.byDay,
        storedRule.byDay,
        (value) =>
          projectRRuleToTimezone(adapter, { ...storedRule, byDay: [value] }, displayTz, storedStart)
            .byDay![0],
        (value) =>
          projectRRuleToTimezone(
            adapter,
            { ...displayRRule, byDay: [value] },
            dataTz,
            ruleStartDisplay,
          ).byDay![0],
      ),
    };
  }
  if (
    displayRRule.freq === 'MONTHLY' &&
    displayRRule.byMonthDay != null &&
    storedRule.byMonthDay != null
  ) {
    return {
      ...projected,
      byMonthDay: mergeReadSelection(
        displayRRule.byMonthDay,
        storedRule.byMonthDay,
        (value) =>
          projectRRuleToTimezone(
            adapter,
            { ...storedRule, byMonthDay: [value] },
            displayTz,
            storedStart,
          ).byMonthDay![0],
        (value) =>
          projectRRuleToTimezone(
            adapter,
            { ...displayRRule, byMonthDay: [value] },
            dataTz,
            ruleStartDisplay,
          ).byMonthDay![0],
      ),
    };
  }
  return projected;
}

/**
 * Maps a submitted selection back to the data timezone: a value the dialog read from the stored
 * rule returns its stored value, any other one is projected.
 */
function mergeReadSelection<T>(
  submitted: T[],
  stored: T[],
  readValueOf: (storedValue: T) => T,
  projectValue: (submittedValue: T) => T,
): T[] {
  const storedByReadValue = new Map<T, T>();
  for (const storedValue of stored) {
    const readValue = readValueOf(storedValue);
    if (!storedByReadValue.has(readValue)) {
      storedByReadValue.set(readValue, storedValue);
    }
  }
  return Array.from(
    new Set(submitted.map((value) => storedByReadValue.get(value) ?? projectValue(value))),
  );
}
