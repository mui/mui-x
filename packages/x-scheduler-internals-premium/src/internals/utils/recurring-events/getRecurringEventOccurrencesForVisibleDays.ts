import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type {
  SchedulerEventOccurrence,
  SchedulerProcessedDate,
  SchedulerProcessedEvent,
} from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  createProcessedDate,
  getDayNumber,
  getEndOfDayMs,
  getPlainDateKey,
  getRecurringOccurrenceKeyFromDateKey,
  getStartOfDayMs,
  toEpochMs,
  toPlainDate,
} from '@mui/x-scheduler-internals/internals';
import { RecurringSeries } from './RecurringSeries';

/**
 * Expands a recurring event into concrete occurrences within a visible range, from the timestamp
 * `start` to the timestamp `end`, both included.
 *
 * The series finds the days of the occurrences in the data timezone, and each day is translated
 * back to adapter values.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: number,
  end: number,
  adapter: Adapter,
  displayTimezone: TemporalTimezone,
): SchedulerEventOccurrence[] {
  // Important:
  // Occurrences are always computed in dataTimezone to avoid DST issues
  // DisplayTimezone is applied only for presentation purposes
  const series = RecurringSeries.fromEvent(adapter, event);
  const dataTimezone = series.timezone;
  const durationMs = event.dataTimezone.end.timestamp - event.dataTimezone.start.timestamp;

  // Adjust scan range to catch multi-day events starting before visible range
  const durationInDays =
    getDayNumber(toPlainDate(event.dataTimezone.end.timestamp, dataTimezone)) -
    getDayNumber(series.startPlainDate) +
    1;
  const scanFirstDay = toPlainDate(start, dataTimezone).add({ days: 1 - durationInDays });
  const scanLastDay = toPlainDate(end, dataTimezone);

  // In the data timezone, a display date at the same instant is a copy of the data date.
  const processDisplayDate = (epochMs: number, dataDate: SchedulerProcessedDate) =>
    displayTimezone === dataTimezone && epochMs === dataDate.timestamp
      ? { ...dataDate }
      : createProcessedDate(adapter, epochMs, displayTimezone);

  return series.getOccurrenceDays(scanFirstDay, scanLastDay).map((day) => {
    const startMs = toEpochMs(day, series.startMsInDay, dataTimezone);
    const endMs = startMs + durationMs;

    // All-day occurrences span the whole day, like the base event in processEvent.
    const displayStartMs = event.allDay ? getStartOfDayMs(startMs, displayTimezone) : startMs;
    const displayEndMs = event.allDay ? getEndOfDayMs(endMs, displayTimezone) : endMs;

    const dataStart = createProcessedDate(adapter, startMs, dataTimezone);
    const dataEnd = createProcessedDate(adapter, endMs, dataTimezone);
    return {
      ...event,
      key: getRecurringOccurrenceKeyFromDateKey(event.id, getPlainDateKey(day)),
      dataTimezone: {
        ...event.dataTimezone,
        start: dataStart,
        end: dataEnd,
        timezone: dataTimezone,
      },
      displayTimezone: {
        ...event.displayTimezone,
        start: processDisplayDate(displayStartMs, dataStart),
        end: processDisplayDate(displayEndMs, dataEnd),
        timezone: event.displayTimezone.timezone,
      },
    };
  });
}
