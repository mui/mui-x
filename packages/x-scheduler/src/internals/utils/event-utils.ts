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
export function isOccurrenceMultiDay(
  occurrence: SchedulerRenderableEventOccurrence,
  displayTimezone: string,
) {
  return (
    getDayNumber(occurrence.start.plainDateTime.toPlainDate()) !==
    getOccurrenceLastDayNumber(occurrence, displayTimezone)
  );
}

export function isOccurrenceAllDayOrMultipleDay(
  occurrence: SchedulerRenderableEventOccurrence,
  displayTimezone: string,
) {
  return !!occurrence.allDay || isOccurrenceMultiDay(occurrence, displayTimezone);
}

/** Whether the occurrence is rendered in the day grid of the day and week views. */
export function isOccurrenceInDayGrid(
  occurrence: SchedulerRenderableEventOccurrence,
  timeGridEvents: EventCalendarTimeGridEvents,
  displayTimezone: string,
) {
  switch (timeGridEvents) {
    case 'same-day-only':
      return isOccurrenceAllDayOrMultipleDay(occurrence, displayTimezone);
    // Invalid values fall back to the default.
    case 'shorter-than-one-day':
    default: {
      // All-day, or lasts at least a day on the wall clock of the display timezone.
      const { start, end } = occurrence;
      return (
        !!occurrence.allDay ||
        end.timestamp >= addDaysOnWallClock(start.timestamp, 1, displayTimezone)
      );
    }
  }
}
