import type {
  EventCalendarTimeGridEvents,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-internals/models';
import {
  addDaysOnWallClock,
  getDayNumber,
  getOccurrenceLastDayNumber,
} from '@mui/x-scheduler-internals/internals';

/**
 * Whether the occurrence starts and ends on different days of the display timezone.
 */
export function isOccurrenceMultiDay(occurrence: SchedulerRenderableEventOccurrence) {
  return (
    getDayNumber(occurrence.start.value.toPlainDate()) !== getOccurrenceLastDayNumber(occurrence)
  );
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
      // All-day, or lasts at least a day on the wall clock of the display timezone.
      const { start, end } = occurrence;
      const timezone = occurrence.unstable_internalInfos.displayTimezone;
      return (
        !!occurrence.allDay || end.timestamp >= addDaysOnWallClock(start.timestamp, 1, timezone)
      );
    }
  }
}
