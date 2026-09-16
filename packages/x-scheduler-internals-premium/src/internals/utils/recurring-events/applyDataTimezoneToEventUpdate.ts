import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import type {
  SchedulerProcessedEventRecurrenceRule,
  RecurringEventWeekDayCode,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { getWeekDayCode, NOT_LOCALIZED_WEEK_DAYS_INDEXES } from './internal-utils';

export function applyDataTimezoneToEventUpdate({
  adapter,
  originalEvent,
  changes,
  ruleStart,
}: {
  adapter: Adapter;
  originalEvent: SchedulerProcessedEvent;
  changes: SchedulerEventUpdatedProperties;
  /**
   * The display-timezone start the rule's weekdays were picked against.
   * Defaults to the event's stored start.
   */
  ruleStart?: TemporalSupportedObject;
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
    // Keep the rule's shape: an absent `until` must not come back as an `undefined` key.
    const { until, ...rule } = result.rrule;
    const relabeledRule =
      'until' in result.rrule ? { ...rule, until: until && toDataTz(until) } : rule;
    result.rrule = projectRRuleFromDisplayToData(adapter, relabeledRule, originalEvent, ruleStart);
  }

  return result;
}

export function projectRRuleFromDisplayToData(
  adapter: Adapter,
  displayRRule: SchedulerProcessedEventRecurrenceRule,
  originalEvent: SchedulerProcessedEvent,
  ruleStart?: TemporalSupportedObject,
): SchedulerProcessedEventRecurrenceRule {
  // Only WEEKLY BYDAY values are projected back from display to data timezone.
  // MONTHLY ordinals are intentionally preserved as-is, since projecting them
  // would result in unstable or misleading rules.
  if (displayRRule.freq !== 'WEEKLY' || !displayRRule.byDay?.length) {
    return displayRRule;
  }

  const displayTz = originalEvent.displayTimezone.timezone;
  const dataTz = originalEvent.dataTimezone.timezone;

  // The weekday shift depends on the time of day, so project from the start the rule is stored with.
  const dtStartDisplay =
    ruleStart ?? adapter.setTimezone(originalEvent.dataTimezone.start.value, displayTz);

  const startDisplayCode = getWeekDayCode(adapter, dtStartDisplay);
  const startDisplayIndex = NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(startDisplayCode)!;

  const projectedByDay = displayRRule.byDay.map((displayCode) => {
    const targetIndex = NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(
      displayCode as RecurringEventWeekDayCode,
    )!;

    const delta = (((targetIndex - startDisplayIndex) % 7) + 7) % 7;

    const occurrenceDisplay = adapter.addDays(dtStartDisplay, delta);
    const occurrenceData = adapter.setTimezone(occurrenceDisplay, dataTz);

    return getWeekDayCode(adapter, occurrenceData);
  });

  return {
    ...displayRRule,
    byDay: Array.from(new Set(projectedByDay)),
  };
}
