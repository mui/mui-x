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
   * The edited start the rule was picked against.
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
  const displayTz = originalEvent.displayTimezone.timezone;
  const dataTz = originalEvent.dataTimezone.timezone;

  // The day shift depends on the time of day, so project from the start the rule is stored with.
  const storedStartDisplay = adapter.setTimezone(originalEvent.dataTimezone.start.value, displayTz);
  const dtStartDisplay = ruleStart ? adapter.setTimezone(ruleStart, displayTz) : storedStartDisplay;

  // A MONTHLY BYMONTHDAY on the start's own day follows the start into the data timezone;
  // any other value, and the ordinal BYDAY form, are kept as-is since projecting them
  // would result in unstable or misleading rules.
  if (displayRRule.freq === 'MONTHLY') {
    // A selection read back from the stored rule and left as is keeps the stored value:
    // the display value alone cannot tell a projected day from a custom one that happens
    // to be the display start's own day. That only holds while the start lands on the same
    // data-timezone day as before; an edit that moves it across the day boundary gives the
    // read value a new meaning, so it is projected again.
    const storedRule = originalEvent.dataTimezone.rrule;
    const readRule = originalEvent.displayTimezone.rrule;
    const shiftsDay = (start: TemporalSupportedObject) =>
      adapter.getDate(start) !== adapter.getDate(adapter.setTimezone(start, dataTz));
    if (
      storedRule?.freq === 'MONTHLY' &&
      readRule?.freq === 'MONTHLY' &&
      isSameMonthDaySelection(displayRRule.byMonthDay, readRule.byMonthDay) &&
      shiftsDay(dtStartDisplay) === shiftsDay(storedStartDisplay)
    ) {
      return displayRRule.byMonthDay == null
        ? displayRRule
        : { ...displayRRule, byMonthDay: storedRule.byMonthDay };
    }

    const startDisplayDay = adapter.getDate(dtStartDisplay);
    if (displayRRule.byMonthDay?.includes(startDisplayDay)) {
      const startDataDay = adapter.getDate(adapter.setTimezone(dtStartDisplay, dataTz));
      return {
        ...displayRRule,
        byMonthDay: displayRRule.byMonthDay.map((day) =>
          day === startDisplayDay ? startDataDay : day,
        ),
      };
    }
    return displayRRule;
  }

  // Only WEEKLY BYDAY values are projected back from display to data timezone.
  if (displayRRule.freq !== 'WEEKLY' || !displayRRule.byDay?.length) {
    return displayRRule;
  }

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

function isSameMonthDaySelection(a: number[] | undefined, b: number[] | undefined): boolean {
  if (a == null || b == null) {
    return a == null && b == null;
  }
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.length === sortedB.length && sortedA.every((day, index) => day === sortedB[index]);
}
