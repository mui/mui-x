import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';

export function isOccurrenceAllDayOrMultipleDay(
  occurrence: SchedulerRenderableEventOccurrence,
  adapter: Adapter,
) {
  if (occurrence.allDay) {
    return true;
  }

  return !adapter.isSameDay(
    occurrence.displayTimezone.start.value,
    occurrence.displayTimezone.end.value,
  );
}

/** Timed occurrences shorter than a day stay in the time grid, even when they cross midnight. */
export function isOccurrenceInAllDayRow(
  occurrence: SchedulerRenderableEventOccurrence,
  adapter: Adapter,
) {
  if (occurrence.allDay) {
    return true;
  }

  return !adapter.isBefore(
    occurrence.displayTimezone.end.value,
    adapter.addDays(occurrence.displayTimezone.start.value, 1),
  );
}
