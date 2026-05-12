import { SchedulerEventOccurrence } from '../models';

/**
 * Sorts event occurrences by their start date (earliest first).
 * If two occurrences have the same start date, the one with the later end date comes first.
 */
export function sortEventOccurrences(
  occurrences: readonly SchedulerEventOccurrence[],
): SchedulerEventOccurrence[] {
  return occurrences.toSorted(
    (a, b) =>
      a.displayTimezone.start.timestamp - b.displayTimezone.start.timestamp ||
      b.displayTimezone.end.timestamp - a.displayTimezone.end.timestamp,
  );
}
