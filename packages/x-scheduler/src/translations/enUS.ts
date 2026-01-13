import { SchedulerTranslations } from '../models/translations';

export const enUS: SchedulerTranslations = {
  // ResourcesLegend
  hideEventsLabel: (resourceName) => `Hide events for ${resourceName}`,
  resourcesLegendSectionLabel: 'Resource legend',
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
  showEmptyDaysInAgenda: 'Show empty days',
  showWeekNumber: 'Show week number',
  timeFormat: 'Time format',
  viewSpecificOptions: (view) => `${view} view options`,

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

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Ends ${endDate}`,

  // EventPopover
  allDayLabel: 'All Day',
  closeButtonAriaLabel: 'Close modal',
  closeButtonLabel: 'Close',
  deleteEvent: 'Delete event',
  descriptionLabel: 'Description',
  editDisabledNotice: 'Editing is currently unavailable for recurrent events',
  endDateLabel: 'End date',
  endTimeLabel: 'End time',
  eventTitleAriaLabel: 'Event title',
  generalTabLabel: 'General',
  labelNoResource: 'No resource',
  labelInvalidResource: 'Invalid resource',
  recurrenceLabel: 'Recurrence',
  recurrenceNoRepeat: "Don't repeat",
  recurrenceCustomRepeat: 'Custom repeat rule',
  recurrenceDailyPresetLabel: 'Repeats daily',
  recurrenceDailyFrequencyLabel: 'days',
  recurrenceEndsLabel: 'Ends',
  recurrenceEndsAfterLabel: 'After',
  recurrenceEndsNeverLabel: 'Never',
  recurrenceEndsUntilLabel: 'Until',
  recurrenceEndsTimesLabel: 'times',
  recurrenceEveryLabel: 'Every',
  recurrenceRepeatLabel: 'Repeat',
  recurrenceTabLabel: 'Recurrence',
  recurrenceMainSelectCustomLabel: 'Select your recurrence pattern',
  recurrenceWeeklyFrequencyLabel: 'weeks',
  recurrenceWeeklyPresetLabel: (weekday) => `Repeats weekly on ${weekday}`,
  recurrenceMonthlyFrequencyLabel: 'months',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Day ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} of the last week of the month`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} last week`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Repeats monthly on day ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} week ${ord} of the month`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} week ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'On',
  recurrenceYearlyFrequencyLabel: 'years',
  recurrenceYearlyPresetLabel: (date) => `Repeats annually on ${date}`,
  resourceLabel: 'Resource',
  saveChanges: 'Save changes',
  startDateAfterEndDateError: 'Start date/time must be before end date/time.',
  startDateLabel: 'Start date',
  startTimeLabel: 'Start time',

  // ScopeDialog
  all: 'All events in the series',
  cancel: 'Cancel',
  confirm: 'Confirm',
  onlyThis: 'Only this event',
  radioGroupAriaLabel: 'Editing recurring events scope',
  thisAndFollowing: 'This and following events',
  title: 'Apply this change to:',
};
