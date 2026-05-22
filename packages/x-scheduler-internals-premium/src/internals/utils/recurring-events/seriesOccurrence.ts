import { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '@mui/x-scheduler-internals/models';
import { getRecurringEventOccurrencesForVisibleDays } from './getRecurringEventOccurrencesForVisibleDays';

export function hasOccurrenceBefore(
  adapter: Adapter,
  event: SchedulerProcessedEvent,
  occurrenceStart: TemporalSupportedObject,
): boolean {
  const dayBefore = adapter.addDays(adapter.startOfDay(occurrenceStart), -1);
  return (
    getRecurringEventOccurrencesForVisibleDays(
      event,
      event.dataTimezone.start.value,
      adapter.endOfDay(dayBefore),
      adapter,
      event.dataTimezone.timezone,
    ).length > 0
  );
}

export function hasRemainingOccurrence(
  adapter: Adapter,
  event: SchedulerProcessedEvent,
  exDates: TemporalSupportedObject[],
): boolean {
  const rule = event.dataTimezone.rrule!;
  if (rule.count == null && rule.until == null) {
    return true;
  }

  const seriesStart = event.dataTimezone.start.value;
  const rangeEnd =
    rule.until ?? adapter.addYears(seriesStart, (rule.count ?? 1) * (rule.interval ?? 1));
  const eventWithExDates: SchedulerProcessedEvent = {
    ...event,
    dataTimezone: { ...event.dataTimezone, exDates },
  };

  return (
    getRecurringEventOccurrencesForVisibleDays(
      eventWithExDates,
      seriesStart,
      adapter.endOfDay(rangeEnd),
      adapter,
      event.dataTimezone.timezone,
    ).length > 0
  );
}
