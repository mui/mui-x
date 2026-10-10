import type {
  EventCalendarTimeGridEvents,
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
  timeGridEvents: EventCalendarTimeGridEvents,
) {
  switch (timeGridEvents) {
    case 'same-day-only':
      return isOccurrenceAllDayOrMultipleDay(occurrence, adapter);
    // Invalid values fall back to the default, like the other `viewConfig` options.
    case 'shorter-than-one-day':
    default:
      return (
        !!occurrence.allDay ||
        !adapter.isBefore(
          occurrence.displayTimezone.end.value,
          adapter.addDays(occurrence.displayTimezone.start.value, 1),
        )
      );
  }
}
