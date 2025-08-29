import { CalendarView } from '../../primitives/models';

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

  // SettingsMenu
  hideWeekends: string;
  settingsMenu: string;

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
  recurrenceLabel: string;
  recurrenceNoRepeat: string;
  recurrenceDailyPresetLabel: string;
  recurrenceWeeklyPresetLabel: (weekday: string) => string;
  recurrenceMonthlyPresetLabel: (dayNumber: number) => string;
  recurrenceYearlyPresetLabel: (date: string) => string;
  saveChanges: string;
  startDateAfterEndDateError: string;
  startDateLabel: string;
  startTimeLabel: string;
}
