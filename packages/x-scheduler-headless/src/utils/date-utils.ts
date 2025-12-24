import {
  RecurringEventRecurrenceRule,
  RecurringEventWeekDayCode,
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';
import { getWeekDayCode, NOT_LOCALIZED_WEEK_DAYS_INDEXES } from './recurring-events/internal-utils';

export function mergeDateAndTime(
  adapter: Adapter,
  dateParam: TemporalSupportedObject,
  timeParam: TemporalSupportedObject,
): TemporalSupportedObject {
  let mergedDate = dateParam;
  mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
  mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
  mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
  mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));

  return mergedDate;
}

/**
 * Returns a string representation of the date.
 * It can be used as key in Maps or passed to the React `key` property when looping through days.
 * It only contains date information, two dates representing the same day but with different time will have the same key.
 */
export function getDateKey(day: TemporalSupportedObject, adapter: Adapter): string {
  return adapter.format(day, 'localizedNumericDate');
}

/**
 * Gets the end date of an event occurrence based on its start date.
 * For now, the occurrence always has the same duration as the original event, even when the DST applies between its start and the end.
 */
export function getOccurrenceEnd({
  event,
  occurrenceStart,
  adapter,
}: {
  event: SchedulerProcessedEvent;
  occurrenceStart: TemporalSupportedObject;
  adapter: Adapter;
}): TemporalSupportedObject {
  const durationMs = event.dataTimezone.end.timestamp - event.dataTimezone.start.timestamp;
  return adapter.addMilliseconds(occurrenceStart, durationMs);
}

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
  if (displayRRule.freq !== 'WEEKLY' || !displayRRule.byDay?.length) {
    return displayRRule;
  }

  const displayTz = originalEvent.displayTimezone.timezone;
  const dataTz = originalEvent.dataTimezone.timezone;

  const dtStartData = originalEvent.dataTimezone.start.value;
  const dtStartDisplay = adapter.setTimezone(dtStartData, displayTz);

  const startDisplayCode = getWeekDayCode(adapter, dtStartDisplay);
  const startDisplayIndex = NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(
    startDisplayCode as RecurringEventWeekDayCode,
  )!;

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
