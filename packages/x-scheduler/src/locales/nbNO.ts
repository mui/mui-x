import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const nbNODialog: Partial<EventDialogLocaleText> = {
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
  // recurrenceMainSelectCustomLabel: 'Recurrence',
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
  // saveChanges: 'Save',
  // startDateAfterEndDateError: 'Start date/time must be before end date/time.',
  // startDateLabel: 'Start date',
  // startTimeLabel: 'Start time',
  // RecurringScopeDialog
  // all: 'All events',
  // cancel: 'Cancel',
  // confirm: 'Confirm',
  // onlyThis: 'Only this event',
  // radioGroupAriaLabel: 'Editing recurring events scope',
  // thisAndFollowing: 'This and following events',
  // title: 'Apply this change to:',
};

const nbNOCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesTree
  resourcesLabel: 'Ressurser',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Dag',
  month: 'Måned',
  other: 'Annet',
  today: 'I dag',
  week: 'Uke',
  time: 'Tid',
  days: 'Dager',
  months: 'Måneder',
  weeks: 'Uker',
  years: 'År',

  // DateNavigator
  closeSidePanel: 'Lukk sidepanel',
  openSidePanel: 'Åpne sidepanel',

  // Preferences menu
  amPm12h: '12-timer (1:00PM)',
  hour24h: '24-timer (13:00)',
  preferencesMenu: 'Innstillinger',
  showWeekends: 'Vis helger',
  showEmptyDaysInAgenda: 'Vis tomme dager',
  showWeekNumber: 'Vis ukenummer',
  timeFormat: 'Tidsformat',
  viewSpecificOptions: (view) => `${view} visningsalternativer`,

  // WeekView
  allDay: 'Hele dagen',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} til..`,
  nextTimeSpan: (timeSpan) => `Neste ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `Forrige ${timeSpan}`,
  resourceAriaLabel: (resourceName) => `Ressurs: ${resourceName}`,
  weekAbbreviation: 'U',
  weekNumberAriaLabel: (weekNumber) => `Uke ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Slutter ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Kalender',
  miniCalendarGoToPreviousMonth: 'Vis forrige måned i kalender',
  miniCalendarGoToNextMonth: 'Vis neste måned i kalender',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressurstittel',
};

const nbNOTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressurstittel',
};

export const nbNO: SchedulerLocalization = getSchedulerLocalization({
  dialog: nbNODialog,
  calendar: nbNOCalendar,
  timeline: nbNOTimeline,
});
