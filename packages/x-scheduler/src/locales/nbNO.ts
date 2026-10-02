import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const nbNODialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Hendelsesfarge',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Dato og tid',
  resourceColorSectionLabel: 'Ressurs og farge',
  allDayLabel: 'Hele dagen',
  closeButtonAriaLabel: 'Lukk',
  closeButtonLabel: 'Lukk',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Slett hendelse',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Beskrivelse',
  endDateLabel: 'Sluttdato',
  endTimeLabel: 'Sluttidspunkt',
  eventTitleAriaLabel: 'Hendelsestittel',
  generalTabLabel: 'Generelt',
  labelNoResource: 'Ingen ressurs',
  labelInvalidResource: 'Ugyldig ressurs',
  recurrenceLabel: 'Gjentakelse',
  recurrenceNoRepeat: 'Ingen gjentakelse',
  recurrenceCustomRepeat: 'Egendefinert gjentakelsesregel',
  recurrenceDailyPresetLabel: 'Gjentas daglig',
  recurrenceDailyFrequencyLabel: 'dager',
  recurrenceEndsLabel: 'Slutter',
  recurrenceEndsAfterLabel: 'Etter',
  recurrenceEndsNeverLabel: 'Aldri',
  recurrenceEndsUntilLabel: 'Til',
  recurrenceEndsTimesLabel: 'ganger',
  recurrenceEveryLabel: 'Hver',
  recurrenceRepeatLabel: 'Gjenta',
  recurrenceTabLabel: 'Gjentakelse',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Gjentakelse',
  recurrenceWeeklyFrequencyLabel: 'uker',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Gjentas ukentlig på ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'måneder',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Dag ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) => `${weekdayName} i siste uke av måneden`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} siste uke`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Gjentas månedlig på dag ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `${weekdayName} uke ${ord} av måneden`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName} uke ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'På',
  recurrenceYearlyFrequencyLabel: 'år',
  recurrenceYearlyPresetLabel: (date) => `Gjentas årlig den ${date}`,
  noResourceAriaLabel: 'Ingen spesifikk ressurs',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Ressurs',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Lagre',
  startDateAfterEndDateError: 'Sluttdato kan ikke være før startdato.',
  startDateLabel: 'Startdato',
  startTimeAfterEndTimeError: 'Sluttidspunkt må være etter starttidspunkt.',
  startTimeLabel: 'Starttidspunkt',

  // RecurringScopeDialog
  all: 'Alle hendelser',
  cancel: 'Avbryt',
  confirm: 'Bekreft',
  onlyThis: 'Bare denne hendelsen',
  radioGroupAriaLabel: 'Rediger omfang for gjentakende hendelser',
  thisAndFollowing: 'Denne og etterfølgende hendelser',
  title: 'Bruk denne endringen på:',
};

const nbNOEvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Ressurs: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const nbNOCalendar: SchedulerCalendarTranslations = {
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

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12-timer (1:00PM)',
  hour24h: '24-timer (13:00)',
  preferencesMenu: 'Innstillinger',
  showWeekends: 'Vis helger',
  showEmptyDaysInAgenda: 'Vis tomme dager',
  showWeekNumber: 'Vis ukenummer',
  timeFormat: 'Tidsformat',
  viewSpecificOptions: (view) => `${view} visningsalternativer`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'Hele dagen',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} til..`,
  nextTimeSpan: (timeSpan) => `Neste ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `Forrige ${timeSpan}`,
  weekAbbreviation: 'U',
  weekNumberAriaLabel: (weekNumber) => `Uke ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Slutter ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Kalender',
  miniCalendarGoToPreviousMonth: 'Vis forrige måned i kalender',
  miniCalendarGoToNextMonth: 'Vis neste måned i kalender',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressurstittel',
};

const nbNOTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressurstittel',
};

export const nbNO: SchedulerLocalization = getSchedulerLocalization({
  dialog: nbNODialog,
  event: nbNOEvent,
  calendar: nbNOCalendar,
  timeline: nbNOTimeline,
});
