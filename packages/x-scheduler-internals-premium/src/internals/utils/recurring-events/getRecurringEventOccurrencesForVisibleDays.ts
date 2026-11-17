import type {
  SchedulerEventOccurrence,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import {
  createProcessedDate,
  getDayNumber,
  getEndOfDayMs,
  getPlainDateKey,
  getRecurringOccurrenceKeyFromDateKey,
  getMsInDay,
  getStartOfDayMs,
  localToEpochMs,
  MS_PER_DAY,
  toLocalDayNumber,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { RecurringSeries } from './RecurringSeries';

/**
 * Expands a recurring event into concrete occurrences within a visible range, from the timestamp
 * `start` to the timestamp `end`, both included.
 *
 * The series finds the days of the occurrences in the data timezone, and each day is translated
 * back to dates. The occurrences that don't overlap the range are left out before their dates are
 * built, and so are the ones that don't overlap `visibleRanges` when it's given.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: number,
  end: number,
  displayTimezone: string,
  visibleRanges?: readonly { start: number; end: number }[],
): SchedulerEventOccurrence[] {
  // Important:
  // Occurrences are always computed in dataTimezone to avoid DST issues
  // DisplayTimezone is applied only for presentation purposes
  const series = RecurringSeries.fromEvent(event);
  const dataTimezone = series.timezone;
  const { dataStart, dataEnd } = event.unstable_internalInfos;
  const durationMs = dataEnd - dataStart;

  // Adjust scan range to catch multi-day events starting before visible range
  const durationInDays =
    toLocalDayNumber(dataEnd, dataTimezone) - getDayNumber(series.start.toPlainDate()) + 1;
  const scanFirstDay = toPlainDate(start, dataTimezone).add({ days: 1 - durationInDays });
  const scanLastDay = toPlainDate(end, dataTimezone);

  // Every occurrence starts at the wall-clock time of DTSTART.
  const startMsInDay = getMsInDay(series.start);
  // `exDates` is cleared rather than left out with a rest destructuring, which is about 8 times
  // slower.
  const occurrenceProperties = { ...event, exDates: undefined };
  const occurrences: SchedulerEventOccurrence[] = [];
  for (const day of series.getOccurrenceDays(scanFirstDay, scanLastDay)) {
    const startMs = localToEpochMs(getDayNumber(day) * MS_PER_DAY + startMsInDay, dataTimezone);
    const endMs = startMs + durationMs;

    // All-day occurrences span the whole day, like the base event in processEvent.
    const displayStartMs = event.allDay ? getStartOfDayMs(startMs, displayTimezone) : startMs;
    const lastInstantMs = event.allDay ? getEndOfDayMs(endMs, displayTimezone) : endMs;
    // The end of an all-day occurrence is exclusive.
    const displayEndMs = event.allDay ? lastInstantMs + 1 : endMs;

    // The scan covers whole days of the data timezone and starts early for the occurrences that
    // last several days, so some of its occurrences fall outside the range.
    if (displayStartMs > end || lastInstantMs < start) {
      continue;
    }
    if (visibleRanges && !overlapsOneOf(visibleRanges, displayStartMs, lastInstantMs)) {
      continue;
    }

    occurrences.push({
      ...occurrenceProperties,
      key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
      start: createProcessedDate(displayStartMs, displayTimezone),
      end: createProcessedDate(displayEndMs, displayTimezone),
      unstable_internalInfos: { displayTimezone, dataStart: startMs, dataEnd: endMs },
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
