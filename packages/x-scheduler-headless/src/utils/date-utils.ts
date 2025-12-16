import {
  SchedulerEventUpdatedProperties,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';

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
  const originalTz = adapter.getTimezone(originalEvent.modelInBuiltInFormat!.start);

  const convertToOriginalTz = (date: TemporalSupportedObject): TemporalSupportedObject =>
    adapter.setTimezone(date, originalTz);

  const result: SchedulerEventUpdatedProperties = { ...changes };

  if (result.start) {
    result.start = convertToOriginalTz(result.start);
  }
  if (result.end) {
    result.end = convertToOriginalTz(result.end);
  }

  if (result.exDates && result.exDates.length > 0) {
    result.exDates = result.exDates.map((date) => convertToOriginalTz(date));
  }

  if (result.rrule && typeof result.rrule === 'object' && result.rrule.until) {
    const resultRrule = {
      ...result.rrule,
      until: convertToOriginalTz(result.rrule.until),
    };
    result.rrule = resultRrule;
  }

  return result;
}
