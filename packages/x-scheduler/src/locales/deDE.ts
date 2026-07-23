import type {
  EventEditingLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type { SchedulerLocalization } from '../utils/getSchedulerLocalization';

const deDEDialog: Partial<EventEditingLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Ereignisfarbe',
  dateTimeSectionLabel: 'Datum und Uhrzeit',
  resourceColorSectionLabel: 'Ressource und Farbe',
  allDayLabel: 'Ganztägig',
  closeButtonAriaLabel: 'Schließen',
  closeButtonLabel: 'Schließen',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Ereignis löschen',
  descriptionLabel: 'Beschreibung',
  endDateLabel: 'Enddatum',
  endTimeLabel: 'Endzeit',
  eventTitleAriaLabel: 'Ereignistitel',
  // eventTitlePlaceholder: 'Add title',
  generalTabLabel: 'Allgemein',
  labelNoResource: 'Keine Ressource',
  labelInvalidResource: 'Ungültige Ressource',
  recurrenceLabel: 'Wiederholung',
  recurrenceNoRepeat: 'Nicht wiederholen',
  recurrenceCustomRepeat: 'Benutzerdefinierte Wiederholungsregel',
  recurrenceDailyPresetLabel: 'Wird täglich wiederholt',
  recurrenceDailyFrequencyLabel: 'Tage',
  recurrenceEndsLabel: 'Endet',
  recurrenceEndsAfterLabel: 'Nach',
  recurrenceEndsNeverLabel: 'Nie',
  recurrenceEndsUntilLabel: 'Bis',
  recurrenceEndsTimesLabel: 'Mal',
  recurrenceEveryLabel: 'Jede',
  recurrenceRepeatLabel: 'Wiederholen',
  recurrenceTabLabel: 'Wiederholung',
  recurrenceMainSelectCustomLabel: 'Wiederholung',
  recurrenceWeeklyFrequencyLabel: 'Wochen',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Wird wöchentlich am ${weekdayName} wiederholt`,
  recurrenceMonthlyFrequencyLabel: 'Monate',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Tag ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} der letzten Woche des Monats`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} letzte Woche`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Wird monatlich am Tag ${dayNumber} wiederholt`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} Woche ${ord} des Monats`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} Woche ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Am',
  recurrenceYearlyFrequencyLabel: 'Jahre',
  recurrenceYearlyPresetLabel: (date) => `Wird jährlich am ${date} wiederholt`,
  noResourceAriaLabel: 'Keine Ressource',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Ressource',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Speichern',
  startDateAfterEndDateError: 'Startdatum/-zeit muss vor dem Enddatum/-zeit liegen.',
  startDateLabel: 'Startdatum',
  startTimeLabel: 'Startzeit',

  // RecurringScopeDialog
  all: 'Alle Ereignisse',
  cancel: 'Abbrechen',
  confirm: 'Bestätigen',
  onlyThis: 'Nur dieses Ereignis',
  radioGroupAriaLabel: 'Bearbeitungsbereich für wiederkehrende Ereignisse',
  thisAndFollowing: 'Dieses und folgende Ereignisse',
  title: 'Diese Änderung anwenden auf:',
};

const deDECalendar: Partial<Omit<EventCalendarLocaleText, keyof EventEditingLocaleText>> = {
  // ResourcesTree
  resourcesLabel: 'Ressourcen',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Tag',
  month: 'Monat',
  other: 'Andere',
  today: 'Heute',
  week: 'Woche',
  time: 'Zeit',
  days: 'Tage',
  months: 'Monate',
  weeks: 'Wochen',
  years: 'Jahre',

  // DateNavigator
  closeSidePanel: 'Seitenpanel schließen',
  openSidePanel: 'Seitenpanel öffnen',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12-Stunden (1:00PM)',
  hour24h: '24-Stunden (13:00)',
  preferencesMenu: 'Einstellungen',
  showWeekends: 'Wochenenden anzeigen',
  showEmptyDaysInAgenda: 'Leere Tage anzeigen',
  showWeekNumber: 'Kalenderwoche anzeigen',
  timeFormat: 'Zeitformat',
  viewSpecificOptions: (view) => `Optionen der ${view}-Ansicht`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'Ganztägig',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} weitere..`,
  nextTimeSpan: (timeSpan) => `Nächste(r) ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `Vorherige(r) ${timeSpan}`,
  resourceAriaLabel: (resourceName) => `Ressource: ${resourceName}`,
  weekAbbreviation: 'W',
  weekNumberAriaLabel: (weekNumber) => `Woche ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Endet am ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Kalender',
  miniCalendarGoToPreviousMonth: 'Vorherigen Monat im Kalender anzeigen',
  miniCalendarGoToNextMonth: 'Nächsten Monat im Kalender anzeigen',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressourcentitel',
};

const deDETimeline: Partial<Omit<EventTimelineLocaleText, keyof EventEditingLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressourcentitel',
};

export const deDE: SchedulerLocalization = getSchedulerLocalization({
  dialog: deDEDialog,
  calendar: deDECalendar,
  timeline: deDETimeline,
});
