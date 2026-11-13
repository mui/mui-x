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
  getStartOfDayMs,
  toEpochMs,
  toLocalDayNumber,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { RecurringSeries } from './RecurringSeries';

/**
 * Expands a recurring event into concrete occurrences within a visible range, from the timestamp
 * `start` to the timestamp `end`, both included.
 *
 * The series finds the days of the occurrences in the data timezone, and each day is translated
 * back to dates.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: number,
  end: number,
  displayTimezone: string,
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
  const startTime = series.start.toPlainTime();
  const { exDates: unusedExDates, ...occurrenceProperties } = event;
  return series.getOccurrenceDays(scanFirstDay, scanLastDay).map((day) => {
    const startMs = toEpochMs(day.toPlainDateTime(startTime), dataTimezone);
    const endMs = startMs + durationMs;

    // All-day occurrences span the whole day, like the base event in processEvent.
    const displayStartMs = event.allDay ? getStartOfDayMs(startMs, displayTimezone) : startMs;
    const displayEndMs = event.allDay ? getEndOfDayMs(endMs, displayTimezone) + 1 : endMs;

    return {
      ...occurrenceProperties,
      key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
      start: createProcessedDate(displayStartMs, displayTimezone),
      end: createProcessedDate(displayEndMs, displayTimezone),
      unstable_internalInfos: { displayTimezone, dataStart: startMs, dataEnd: endMs },
    };
  });
}
