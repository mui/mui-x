import { Adapter } from '../../../use-adapter';
import {
  RecurringEventRecurrenceRule,
  RecurringEventWeekDayCode,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '../../../models';
import { getWeekDayCode, NOT_LOCALIZED_WEEK_DAYS_INDEXES } from './internal-utils';

export function applyDataTimezoneToEventUpdate({
  adapter,
  originalEvent,
  changes,
}: {
  adapter: Adapter;
  originalEvent: SchedulerProcessedEvent;
  changes: SchedulerEventUpdatedProperties;
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
    result.rrule = projectRRuleFromDisplayToData(
      adapter,
      {
        ...result.rrule,
        until: result.rrule.until ? toDataTz(result.rrule.until) : undefined,
      },
      originalEvent,
    );
  }

  return result;
}

export function projectRRuleFromDisplayToData(
  adapter: Adapter,
  displayRRule: RecurringEventRecurrenceRule,
  originalEvent: SchedulerProcessedEvent,
): RecurringEventRecurrenceRule {
  // Only WEEKLY BYDAY values are projected back from display to data timezone.
  // MONTHLY ordinals are intentionally preserved as-is, since projecting them
  // would result in unstable or misleading rules.
  if (displayRRule.freq !== 'WEEKLY' || !displayRRule.byDay?.length) {
    return displayRRule;
  }

  const displayTz = originalEvent.displayTimezone.timezone;
  const dataTz = originalEvent.dataTimezone.timezone;

  const dtStartDisplay = adapter.setTimezone(originalEvent.dataTimezone.start.value, displayTz);

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
