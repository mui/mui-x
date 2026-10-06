import type {
  EventCalendarTimeGridViewConfig,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
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

/** Whether the occurrence is rendered in the day grid of the day and week views. */
export function isOccurrenceInDayGrid(
  occurrence: SchedulerRenderableEventOccurrence,
  adapter: Adapter,
  timeGridEvents: NonNullable<EventCalendarTimeGridViewConfig['timeGridEvents']>,
) {
  if (timeGridEvents === 'same-day-only') {
    return isOccurrenceAllDayOrMultipleDay(occurrence, adapter);
  }

  if (occurrence.allDay) {
    return true;
  }

  return !adapter.isBefore(
    occurrence.displayTimezone.end.value,
    adapter.addDays(occurrence.displayTimezone.start.value, 1),
  );
}
