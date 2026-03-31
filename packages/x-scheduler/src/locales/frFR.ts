import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const frFRDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  // colorPickerLabel: 'Event color',
  // dateTimeSectionLabel: 'Date & time',
  // resourceColorSectionLabel: 'Resource & color',
  // allDayLabel: 'All Day',
  // closeButtonAriaLabel: 'Close',
  // closeButtonLabel: 'Close',
  // deleteEvent: 'Delete event',
  // descriptionLabel: 'Description',
  // endDateLabel: 'End date',
  // endTimeLabel: 'End time',
  // eventTitleAriaLabel: 'Event title',
  // generalTabLabel: 'General',
  // labelNoResource: 'No resource',
  // labelInvalidResource: 'Invalid resource',
  // recurrenceLabel: 'Recurrence',
  // recurrenceNoRepeat: "Don't repeat",
  // recurrenceCustomRepeat: 'Custom repeat rule',
  // recurrenceDailyPresetLabel: 'Repeats daily',
  // recurrenceDailyFrequencyLabel: 'days',
  // recurrenceEndsLabel: 'Ends',
  // recurrenceEndsAfterLabel: 'After',
  // recurrenceEndsNeverLabel: 'Never',
  // recurrenceEndsUntilLabel: 'Until',
  // recurrenceEndsTimesLabel: 'times',
  // recurrenceEveryLabel: 'Every',
  // recurrenceRepeatLabel: 'Repeat',
  // recurrenceTabLabel: 'Recurrence',
  // recurrenceMainSelectCustomLabel: 'Select your recurrence pattern',
  // recurrenceWeeklyFrequencyLabel: 'weeks',
  // recurrenceWeeklyPresetLabel: weekday => `Repeats weekly on ${weekday}`,
  // recurrenceMonthlyFrequencyLabel: 'months',
  // recurrenceMonthlyDayOfMonthLabel: dayNumber => `Day ${dayNumber}`,
  // recurrenceMonthlyLastWeekAriaLabel: weekDay => `${weekDay} of the last week of the month`,
  // recurrenceMonthlyLastWeekLabel: weekDay => `${weekDay} last week`,
  // recurrenceMonthlyPresetLabel: dayNumber => `Repeats monthly on day ${dayNumber}`,
  // recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} week ${ord} of the month`,
  // recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} week ${ord}`,
  // recurrenceWeeklyMonthlySpecificInputsLabel: 'On',
  // recurrenceYearlyFrequencyLabel: 'years',
  // recurrenceYearlyPresetLabel: date => `Repeats annually on ${date}`,
  // noResourceAriaLabel: 'No specific resource',
  // resourceLabel: 'Resource',
  // saveChanges: 'Save changes',
  // startDateAfterEndDateError: 'Start date/time must be before end date/time.',
  // startDateLabel: 'Start date',
  // startTimeLabel: 'Start time',
  // ScopeDialog
  // all: 'All events in the series',
  // cancel: 'Cancel',
  // confirm: 'Confirm',
  // onlyThis: 'Only this event',
  // radioGroupAriaLabel: 'Editing recurring events scope',
  // thisAndFollowing: 'This and following events',
  // title: 'Apply this change to:',
};

const frFRCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesLegend
  // hideEventsLabel: resourceName => `Hide events for ${resourceName}`,
  // resourcesLabel: 'Resources',
  // resourcesLegendSectionLabel: 'Resource legend',
  // showEventsLabel: resourceName => `Show events for ${resourceName}`,

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Jour',
  month: 'Mois',
  other: 'Autre',
  today: "Aujourd'hui",
  week: 'Semaine',
  // time: 'Time',
  // days: 'Days',
  // months: 'Months',
  // weeks: 'Weeks',
  // years: 'Years',

  // DateNavigator
  // closeSidePanel: 'Close side panel',
  // openSidePanel: 'Open side panel',

  // Preferences menu
  // amPm12h: '12-hour (1:00PM)',
  // hour24h: '24-hour (13:00)',
  // preferencesMenu: 'Settings',
  // showWeekends: 'Show weekends',
  // showEmptyDaysInAgenda: 'Show empty days',
  // showWeekNumber: 'Show week number',
  // timeFormat: 'Time format',
  // viewSpecificOptions: view => `${view} view options`,

  // WeekView
  allDay: 'Toute la journée',

  // MonthView
  // hiddenEvents: hiddenEventsCount => `${hiddenEventsCount} more..`,
  // nextTimeSpan: timeSpan => `Next ${timeSpan}`,
  // previousTimeSpan: timeSpan => `Previous ${timeSpan}`,
  // resourceAriaLabel: resourceName => `Resource: ${resourceName}`,
  // weekAbbreviation: 'W',
  // weekNumberAriaLabel: weekNumber => `Week ${weekNumber}`,

  // EventItem
  // eventItemMultiDayLabel: endDate => `Ends ${endDate}`,

  // MiniCalendar
  // miniCalendarLabel: 'Calendar',
  // miniCalendarGoToPreviousMonth: 'Show previous month in calendar',
  // miniCalendarGoToNextMonth: 'Show next month in calendar',

  // Timeline title sub grid
  // timelineResourceTitleHeader: 'Resource title',
};

const frFRTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titre de la ressource',
};

export const frFR: SchedulerLocalization = getSchedulerLocalization({
  dialog: frFRDialog,
  calendar: frFRCalendar,
  timeline: frFRTimeline,
});
