import { SchedulerEventOccurrence } from '../models';

/**
 * Sorts event occurrences by their start date (earliest first).
 * If two occurrences have the same start date, the one with the later end date comes first.
 */
export function sortEventOccurrences(
  occurrences: readonly SchedulerEventOccurrence[],
): SchedulerEventOccurrence[] {
  return occurrences
    .map((occurrence) => {
      return {
        occurrence,
        start: occurrence.displayTimezone.start.timestamp,
        end: occurrence.displayTimezone.end.timestamp,
      };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .map((item) => item.occurrence);
}
