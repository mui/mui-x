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
  time: 'Time',
  days: 'Days',
  months: 'Months',
  weeks: 'Weeks',
  years: 'Years',

  // DateNavigator
  closeSidePanel: 'Close side panel',
  openSidePanel: 'Open side panel',

  // Preferences menu
  amPm12h: '12-hour (1:00PM)',
  hour24h: '24-hour (13:00)',
  preferencesMenu: 'Settings',
  showWeekends: 'Show weekends',
  showWeekNumber: 'Show week number',
  timeFormat: 'Time format',

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
  allDayLabel: 'All Day',
  closeButtonAriaLabel: 'Close modal',
  deleteEvent: 'Delete event',
  descriptionLabel: 'Description',
  editDisabledNotice: 'Editing is currently unavailable for recurrent events',
  endDateLabel: 'End date',
  endTimeLabel: 'End time',
  eventTitleAriaLabel: 'Event title',
  labelNoResource: 'No resource',
  recurrenceLabel: 'Recurrence',
  recurrenceNoRepeat: "Don't repeat",
  recurrenceDailyPresetLabel: 'Repeats daily',
  recurrenceWeeklyPresetLabel: (weekday) => `Repeats weekly on ${weekday}`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Repeats monthly on day ${dayNumber}`,
  recurrenceYearlyPresetLabel: (date) => `Repeats annually on ${date}`,
  resourceLabel: 'Resource',
  saveChanges: 'Save changes',
  startDateAfterEndDateError: 'Start date/time must be before end date/time.',
  startDateLabel: 'Start date',
  startTimeLabel: 'Start time',
};
