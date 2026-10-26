import type {
  EventCalendarTimeGridEvents,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import { addDaysOnWallClock } from '@mui/x-scheduler-internals/internals';

/**
 * Whether the occurrence starts and ends on different days of the display timezone.
 */
export function isOccurrenceMultiDay(occurrence: SchedulerRenderableEventOccurrence) {
  // The keys of the processed dates only depend on their day in the display timezone.
  return occurrence.displayTimezone.start.key !== occurrence.displayTimezone.end.key;
}

export function isOccurrenceAllDayOrMultipleDay(occurrence: SchedulerRenderableEventOccurrence) {
  return !!occurrence.allDay || isOccurrenceMultiDay(occurrence);
}

/** Whether the occurrence is rendered in the day grid of the day and week views. */
export function isOccurrenceInDayGrid(
  occurrence: SchedulerRenderableEventOccurrence,
  timeGridEvents: EventCalendarTimeGridEvents,
) {
  switch (timeGridEvents) {
    case 'same-day-only':
      return isOccurrenceAllDayOrMultipleDay(occurrence);
    // Invalid values fall back to the default.
    case 'shorter-than-one-day':
    default: {
      // Lasts at least a day on the wall clock of the display timezone.
      const { start, end, timezone } = occurrence.displayTimezone;
      return (
        !!occurrence.allDay || end.timestamp >= addDaysOnWallClock(start.timestamp, 1, timezone)
      );
    }
  }
}
