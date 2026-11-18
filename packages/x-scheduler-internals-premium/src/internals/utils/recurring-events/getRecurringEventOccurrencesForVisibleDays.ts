import type {
  SchedulerEventOccurrence,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import {
  getAllDayDayCount,
  getDayNumber,
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
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: number,
  end: number,
  displayTimezone: string,
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
    return series.getOccurrenceDays(scanFirstDay, scanLastDay).map((day) => {
      const localStartMs = getDayNumber(day) * MS_PER_DAY;
      return {
        ...occurrenceProperties,
        key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
        start: toZonedDateTime(localToEpochMs(localStartMs, displayTimezone), displayTimezone),
        end: toZonedDateTime(
          localToEpochMs(localStartMs + dayCount * MS_PER_DAY, displayTimezone),
          displayTimezone,
        ),
      };
    });
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
  return series.getOccurrenceDays(scanFirstDay, scanLastDay).map((day) => {
    const startMs = localToEpochMs(getDayNumber(day) * MS_PER_DAY + startMsInDay, dataTimezone);
    return {
      ...occurrenceProperties,
      key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
      start: toZonedDateTime(startMs, displayTimezone),
      end: toZonedDateTime(startMs + durationMs, displayTimezone),
    };
  });
}
