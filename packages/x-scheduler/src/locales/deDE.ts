import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const deDEDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Ereignisfarbe',
  dateTimeSectionLabel: 'Datum und Uhrzeit',
  resourceColorSectionLabel: 'Ressource und Farbe',
  allDayLabel: 'Ganztägig',
  closeButtonAriaLabel: 'Schließen',
  closeButtonLabel: 'Schließen',
  deleteEvent: 'Ereignis löschen',
  descriptionLabel: 'Beschreibung',
  endDateLabel: 'Enddatum',
  endTimeLabel: 'Endzeit',
  eventTitleAriaLabel: 'Ereignistitel',
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
  recurrenceWeeklyPresetLabel: (weekday) => `Wird wöchentlich am ${weekday} wiederholt`,
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
  resourceLabel: 'Ressource',
  saveChanges: 'Speichern',
  startDateAfterEndDateError: 'Startdatum/-zeit muss vor dem Enddatum/-zeit liegen.',
  startDateLabel: 'Startdatum',
  startTimeLabel: 'Startzeit',

  // ScopeDialog
  all: 'Alle Ereignisse',
  cancel: 'Abbrechen',
  confirm: 'Bestätigen',
  onlyThis: 'Nur dieses Ereignis',
  radioGroupAriaLabel: 'Bearbeitungsbereich für wiederkehrende Ereignisse',
  thisAndFollowing: 'Dieses und folgende Ereignisse',
  title: 'Diese Änderung anwenden auf:',
};

const deDECalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesLegend
  hideEventsLabel: (resourceName) => `Ereignisse für ${resourceName} ausblenden`,
  resourcesLabel: 'Ressourcen',
  resourcesLegendSectionLabel: 'Ressourcenlegende',
  showEventsLabel: (resourceName) => `Ereignisse für ${resourceName} anzeigen`,

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

  // Preferences menu
  amPm12h: '12-Stunden (1:00PM)',
  hour24h: '24-Stunden (13:00)',
  preferencesMenu: 'Einstellungen',
  showWeekends: 'Wochenenden anzeigen',
  showEmptyDaysInAgenda: 'Leere Tage anzeigen',
  showWeekNumber: 'Kalenderwoche anzeigen',
  timeFormat: 'Zeitformat',
  viewSpecificOptions: (view) => `Optionen der ${view}-Ansicht`,

  // WeekView
  allDay: 'Ganztägig',

  // MonthView
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

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressourcentitel',
};

const deDETimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressourcentitel',
};

export const deDE: SchedulerLocalization = getSchedulerLocalization({
  dialog: deDEDialog,
  calendar: deDECalendar,
  timeline: deDETimeline,
});
