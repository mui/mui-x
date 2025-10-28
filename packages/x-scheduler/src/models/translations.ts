import { CalendarView } from '@mui/x-scheduler-headless/models';

export interface SchedulerTranslations {
  // ResourceLegend
  hideEventsLabel: (resourceName: string) => string;
  resourceLegendSectionLabel: string;
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
  noResourceAriaLabel: string;
  previousTimeSpan: (view: CalendarView) => string;
  resourceAriaLabel: (resourceName: string) => string;
  weekAbbreviation: string;
  weekNumberAriaLabel: (weekNumber: number) => string;

  // EventPopover
  allDayLabel: string;
  closeButtonAriaLabel: string;
  deleteEvent: string;
  descriptionLabel: string;
  editDisabledNotice: string;
  endDateLabel: string;
  endTimeLabel: string;
  eventTitleAriaLabel: string;
  labelNoResource: string;
  recurrenceLabel: string;
  recurrenceNoRepeat: string;
  recurrenceDailyPresetLabel: string;
  recurrenceWeeklyPresetLabel: (weekday: string) => string;
  recurrenceMonthlyPresetLabel: (dayNumber: number) => string;
  recurrenceYearlyPresetLabel: (date: string) => string;
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
}
