import { SchedulerProcessedEvent, TemporalSupportedObject } from '../../models';
import { Adapter } from '../../use-adapter/useAdapter.types';

/**
 * Builds an adapter-agnostic format string that produces an ISO 8601 date-time
 * **without** the trailing `Z` (wall-time representation).
 * Produces e.g. `yyyy'-'MM'-'dd'T'HH':'mm':'ss` for date-fns.
 */
export function getWallTimeIsoFormat(adapter: Adapter): string {
  const f = adapter.formats;
  const esc = adapter.escapedCharacters;
  return [
    f.yearPadded,
    esc.start,
    '-',
    esc.end,
    f.monthPadded,
    esc.start,
    '-',
    esc.end,
    f.dayOfMonthPadded,
    esc.start,
    'T',
    esc.end,
    f.hours24hPadded,
    esc.start,
    ':',
    esc.end,
    f.minutesPadded,
    esc.start,
    ':',
    esc.end,
    f.secondsPadded,
  ].join('');
}

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
