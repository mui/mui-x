import { SchedulerTranslations } from '../models/translations';

export const enUS: SchedulerTranslations = {
  // ResourceLegend
  hideEventsLabel: (resourceName) => `Hide events for ${resourceName}`,
  resourceLegendSectionLabel: 'Resource legend',
  showEventsLabel: (resourceName) => `Show events for ${resourceName}`,

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Day',
  month: 'Month',
  other: 'Other',
  today: 'Today',
  week: 'Week',

  // SettingsMenu
  hideWeekends: 'Hide weekends',
  settingsMenu: 'Settings',

  // WeekView
  allDay: 'All day',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} more..`,
  nextTimeSpan: (timeSpan) => `Next ${timeSpan}`,
  noResourceAriaLabel: 'No specific resource',
  previousTimeSpan: (timeSpan) => `Previous ${timeSpan}`,
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
