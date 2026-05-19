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
  colorPickerLabel: 'Hendelsesfarge',
  dateTimeSectionLabel: 'Dato og tid',
  resourceColorSectionLabel: 'Ressurs og farge',
  allDayLabel: 'Hele dagen',
  closeButtonAriaLabel: 'Lukk',
  closeButtonLabel: 'Lukk',
  deleteEvent: 'Slett hendelse',
  descriptionLabel: 'Beskrivelse',
  endDateLabel: 'Sluttdato',
  endTimeLabel: 'Slutttidspunkt',
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
  recurrenceMainSelectCustomLabel: 'Gjentakelse',
  recurrenceWeeklyFrequencyLabel: 'uker',
  recurrenceWeeklyPresetLabel: (weekday) => `Gjentas ukentlig på ${weekday}`,
  recurrenceMonthlyFrequencyLabel: 'måneder',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Dag ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} i siste uke av måneden`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} siste uke`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Gjentas månedlig på dag ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} uke ${ord} av måneden`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} uke ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'På',
  recurrenceYearlyFrequencyLabel: 'år',
  recurrenceYearlyPresetLabel: (date) => `Gjentas årlig den ${date}`,
  noResourceAriaLabel: 'Ingen spesifikk ressurs',
  resourceLabel: 'Ressurs',
  saveChanges: 'Lagre',
  startDateAfterEndDateError: 'Startdato/-tid må være før sluttdato/-tid.',
  startDateLabel: 'Startdato',
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
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

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
