import { SchedulerTranslations } from '../models/translations';

export const enUS: SchedulerTranslations = {
  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Day',
  month: 'Month',
  other: 'Other',
  today: 'Today',
  week: 'Week',

  // WeekView
  allDay: 'All day',

  // MonthView
  noResourceAriaLabel: 'No specific resource',
  resourceAriaLabel: (resourceName) => `Resource: ${resourceName}`,
  weekAbbreviation: 'W',
  weekNumberAriaLabel: (weekNumber) => `Week ${weekNumber}`,

  // EventPopover
  closeButtonAriaLabel: 'Close modal',
  deleteEvent: 'Delete event',
  descriptionLabel: 'Description',
  endDateLabel: 'End date',
  endTimeLabel: 'End time',
  eventTitleAriaLabel: 'Event title',
  saveChanges: 'Save changes',
  startDateAfterEndDateError: 'Start date/time must be before end date/time.',
  startDateLabel: 'Start date',
  startTimeLabel: 'Start time',
};
