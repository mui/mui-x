import { SchedulerEventOccurrence } from '../models';
import { Adapter } from '../use-adapter/useAdapter.types';

/**
 * Sorts event occurrences by their start date (earliest first).
 * If two occurrences have the same start date, the one with the later end date comes first.
 */
export function sortEventOccurrences(
  occurrences: readonly SchedulerEventOccurrence[],
  adapter: Adapter,
): SchedulerEventOccurrence[] {
  return occurrences
    .map((occurrence) => {
      return {
        occurrence,
        start: occurrence.allDay
          ? adapter.getTime(adapter.startOfDay(occurrence.displayTimezone.start.value))
          : occurrence.displayTimezone.start.timestamp,
        end: occurrence.allDay
          ? adapter.getTime(adapter.endOfDay(occurrence.displayTimezone.end.value))
          : occurrence.displayTimezone.end.timestamp,
      };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .map((item) => item.occurrence);
}
