import type {
  SchedulerEventOccurrence,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import {
  getAllDayDayCount,
  getDayNumber,
  getLastInstant,
  getPlainDateKey,
  getRecurringOccurrenceKeyFromDateKey,
  getMsInDay,
  localToEpochMs,
  MS_PER_DAY,
  toLocalDayNumber,
  toPlainDate,
  toZonedDateTime,
} from '@mui/x-scheduler-internals/internals';
import { RecurringSeries } from './RecurringSeries';

/**
 * Expands a recurring event into concrete occurrences within a visible range, from the timestamp
 * `start` to the timestamp `end`, both included.
 *
 * The series of a timed event finds the days of the occurrences in the event timezone, and each
 * day is translated back to dates. The series of an all-day event runs on the displayed days.
 * The occurrences that don't overlap the range are left out before their dates are built, and so
 * are the ones that don't overlap `visibleRanges` when it's given.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: number,
  end: number,
  displayTimezone: string,
  visibleRanges?: readonly { start: number; end: number }[],
): SchedulerEventOccurrence[] {
  const series = RecurringSeries.fromEvent(event, displayTimezone);
  // `exDates` is cleared rather than left out with a rest destructuring, which is about 8 times
  // slower.
  const occurrenceProperties = { ...event, exDates: undefined };

  if (event.allDay) {
    // Each occurrence covers the days of the event from its day.
    const dayCount = getAllDayDayCount(event);
    // Adjust scan range to catch multi-day events starting before visible range
    const scanFirstDay = toPlainDate(start, displayTimezone).add({ days: 1 - dayCount });
    const scanLastDay = toPlainDate(end, displayTimezone);
    const occurrences: SchedulerEventOccurrence[] = [];
    for (const day of series.getOccurrenceDays(scanFirstDay, scanLastDay)) {
      const localStartMs = getDayNumber(day) * MS_PER_DAY;
      const startMs = localToEpochMs(localStartMs, displayTimezone);
      const endMs = localToEpochMs(localStartMs + dayCount * MS_PER_DAY, displayTimezone);
      // The end of an all-day occurrence is exclusive.
      const lastInstantMs = getLastInstant(endMs, true);
      if (visibleRanges && !overlapsOneOf(visibleRanges, startMs, lastInstantMs)) {
        continue;
      }

      occurrences.push({
        ...occurrenceProperties,
        key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
        start: toZonedDateTime(startMs, displayTimezone),
        end: toZonedDateTime(endMs, displayTimezone),
      });
    }
    return occurrences;
  }

  // The occurrences of a timed event are computed in its timezone to avoid DST issues; the display
  // timezone only presents them.
  const dataTimezone = series.timezone;
  const durationMs = event.end.epochMilliseconds - event.start.epochMilliseconds;

  // Adjust scan range to catch multi-day events starting before visible range
  const durationInDays =
    toLocalDayNumber(event.end.epochMilliseconds, dataTimezone) -
    getDayNumber(series.start.toPlainDate()) +
    1;
  const scanFirstDay = toPlainDate(start, dataTimezone).add({ days: 1 - durationInDays });
  const scanLastDay = toPlainDate(end, dataTimezone);

  // Every occurrence starts at the wall-clock time of DTSTART.
  const startMsInDay = getMsInDay(series.start);
  const occurrences: SchedulerEventOccurrence[] = [];
  for (const day of series.getOccurrenceDays(scanFirstDay, scanLastDay)) {
    const startMs = localToEpochMs(getDayNumber(day) * MS_PER_DAY + startMsInDay, dataTimezone);
    const endMs = startMs + durationMs;

    // The scan covers whole days of the data timezone and starts early for the occurrences that
    // last several days, so some of its occurrences fall outside the range.
    if (startMs > end || endMs < start) {
      continue;
    }
    if (visibleRanges && !overlapsOneOf(visibleRanges, startMs, endMs)) {
      continue;
    }

    occurrences.push({
      ...occurrenceProperties,
      key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
      start: toZonedDateTime(startMs, displayTimezone),
      end: toZonedDateTime(endMs, displayTimezone),
    });
  }
  return occurrences;
}

/**
 * Whether the instants from `first` to `last` overlap one of the sorted, disjoint `ranges`.
 */
function overlapsOneOf(
  ranges: readonly { start: number; end: number }[],
  first: number,
  last: number,
): boolean {
  // The first range that ends at or after `first`.
  let low = 0;
  let high = ranges.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (ranges[middle].end < first) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return low < ranges.length && ranges[low].start <= last;
}
