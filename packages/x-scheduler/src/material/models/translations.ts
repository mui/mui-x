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
  closeButtonAriaLabel: string;
  deleteEvent: string;
  descriptionLabel: string;
  endDateLabel: string;
  endTimeLabel: string;
  eventTitleAriaLabel: string;
  saveChanges: string;
  startDateAfterEndDateError: string;
  startDateLabel: string;
  startTimeLabel: string;
}
