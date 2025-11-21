import { SchedulerEventOccurrence } from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';

/**
 * Sorts event occurrences by their start date (earliest first).
 * If two occurrences have the same start date, the one with the later end date comes first.
 */
export function sortEventOccurrences(
  occurrences: SchedulerEventOccurrence[],
  adapter: Adapter,
): SchedulerEventOccurrence[] {
  return occurrences
    .map((occurrence) => {
      return {
        occurrence,
        // TODO: Avoid JS Date conversion
        start: occurrence.allDay
          ? adapter.toJsDate(adapter.startOfDay(occurrence.start.value)).getTime()
          : occurrence.start.timestamp,
        end: occurrence.allDay
          ? adapter.toJsDate(adapter.endOfDay(occurrence.end.value)).getTime()
          : occurrence.end.timestamp,
      };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .map((item) => item.occurrence);
}
