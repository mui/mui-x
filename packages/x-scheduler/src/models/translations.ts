import { CalendarView } from '@mui/x-scheduler-headless/models';

export interface EventDialogLocaleText {
  // EventDialog
  colorPickerLabel: string;
  dateTimeSectionLabel: string;
  resourceColorSectionLabel: string;
  allDayLabel: string;
  closeButtonAriaLabel: string;
  closeButtonLabel: string;
  deleteEvent: string;
  descriptionLabel: string;
  editDisabledNotice: string;
  endDateLabel: string;
  endTimeLabel: string;
  eventTitleAriaLabel: string;
  generalTabLabel: string;
  labelNoResource: string;
  labelInvalidResource: string;
  recurrenceLabel: string;
  recurrenceNoRepeat: string;
  recurrenceCustomRepeat: string;
  recurrenceDailyPresetLabel: string;
  recurrenceDailyFrequencyLabel: string;
  recurrenceEndsLabel: string;
  recurrenceEndsAfterLabel: string;
  recurrenceEndsNeverLabel: string;
  recurrenceEndsUntilLabel: string;
  recurrenceEndsTimesLabel: string;
  recurrenceEveryLabel: string;
  recurrenceRepeatLabel: string;
  recurrenceTabLabel: string;
  recurrenceMainSelectCustomLabel: string;
  recurrenceWeeklyFrequencyLabel: string;
  recurrenceWeeklyPresetLabel: (weekday: string) => string;
  recurrenceMonthlyDayOfMonthLabel: (dayNumber: number) => string;
  recurrenceMonthlyFrequencyLabel: string;
  recurrenceMonthlyLastWeekAriaLabel: (weekDay: string) => string;
  recurrenceMonthlyLastWeekLabel: (weekDay: string) => string;
  recurrenceMonthlyPresetLabel: (dayNumber: number) => string;
  recurrenceMonthlyWeekNumberAriaLabel: (ord: number, weekDay: string) => string;
  recurrenceMonthlyWeekNumberLabel: (ord: number, weekDay: string) => string;
  recurrenceWeeklyMonthlySpecificInputsLabel: string;
  recurrenceYearlyFrequencyLabel: string;
  recurrenceYearlyPresetLabel: (date: string) => string;
  noResourceAriaLabel: string;
  resourceLabel: string;
  saveChanges: string;
  startDateAfterEndDateError: string;
  startDateLabel: string;
  startTimeLabel: string;

  // ScopeDialog
  all: string;
  cancel: string;
  confirm: string;
  onlyThis: string;
  radioGroupAriaLabel: string;
  thisAndFollowing: string;
  title: string;

  // General
  loading: string;
}

export interface EventCalendarLocaleText extends EventDialogLocaleText {
  // ResourcesLegend
  hideEventsLabel: (resourceName: string) => string;
  resourcesLabel: string;
  resourcesLegendSectionLabel: string;
  showEventsLabel: (resourceName: string) => string;

  // ViewSwitcher
  agenda: string;
  day: string;
  month: string;
  other: string;
  today: string;
  week: string;
  time: string;
  days: string;
  months: string;
  weeks: string;
  years: string;

  // DateNavigator
  closeSidePanel: string;
  openSidePanel: string;

  // PreferencesMenu
  amPm12h: string;
  hour24h: string;
  preferencesMenu: string;
  showEmptyDaysInAgenda: string;
  showWeekends: string;
  showWeekNumber: string;
  timeFormat: string;
  viewSpecificOptions: (view: CalendarView) => string;

  // WeekView
  allDay: string;

  // MonthView
  hiddenEvents: (hiddenEventsCount: number) => string;
  nextTimeSpan: (view: CalendarView) => string;
  previousTimeSpan: (view: CalendarView) => string;
  resourceAriaLabel: (resourceName: string) => string;
  weekAbbreviation: string;
  weekNumberAriaLabel: (weekNumber: number) => string;

  // EventItem
  eventItemMultiDayLabel: (endDate: string) => string;

  // MiniCalendar
  miniCalendarLabel: string;
  miniCalendarGoToPreviousMonth: string;
  miniCalendarGoToNextMonth: string;

  // Timeline title sub grid
  timelineResourceTitleHeader: string;
}

export interface EventTimelineLocaleText extends EventDialogLocaleText {
  // Timeline title sub grid
  timelineResourceTitleHeader: string;
}
