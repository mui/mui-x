import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const deDEDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Ereignisfarbe',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Datum und Uhrzeit',
  resourceColorSectionLabel: 'Ressource und Farbe',
  allDayLabel: 'Ganztägig',
  closeButtonAriaLabel: 'Schließen',
  closeButtonLabel: 'Schließen',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Ereignis löschen',
  // deleteConfirmationTitle: 'Delete this event?',
  // deleteConfirmationMessage: 'This action is irreversible. Are you sure you want to proceed?',
  cancel: 'Abbrechen',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
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
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Wiederholung',
  recurrenceWeeklyFrequencyLabel: 'Wochen',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Wird wöchentlich am ${weekdayName} wiederholt`,
  recurrenceMonthlyFrequencyLabel: 'Monate',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Tag ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) =>
    `${weekdayName} der letzten Woche des Monats`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} letzte Woche`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Wird monatlich am Tag ${dayNumber} wiederholt`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `${weekdayName} Woche ${ord} des Monats`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName} Woche ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Am',
  recurrenceYearlyFrequencyLabel: 'Jahre',
  recurrenceYearlyPresetLabel: (date) => `Wird jährlich am ${date} wiederholt`,
  noResourceAriaLabel: 'Keine Ressource',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Ressource',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Speichern',
  startDateAfterEndDateError: 'Das Enddatum darf nicht vor dem Startdatum liegen.',
  startDateLabel: 'Startdatum',
  startTimeAfterEndTimeError: 'Die Endzeit muss nach der Startzeit liegen.',
  startTimeLabel: 'Startzeit',

  // RecurringScopeDialog
  all: 'Alle Ereignisse',
  confirm: 'Bestätigen',
  onlyThis: 'Nur dieses Ereignis',
  radioGroupAriaLabel: 'Bearbeitungsbereich für wiederkehrende Ereignisse',
  thisAndFollowing: 'Dieses und folgende Ereignisse',
  title: 'Diese Änderung anwenden auf:',

  // Errors
  // somethingWentWrongError: 'Something went wrong. Try again.',
  // eventNotLoadedError: 'This event is still being saved, so the change was not applied. Try again once it is saved.',
  // eventChangedWhileConfirmingError: 'This event changed while the delete confirmation was open, so the deletion was not applied. Try deleting it again.',
  // datesNotWritableError: "This date can't be changed, so the change was not applied.",
  // eventNotCreatableError: "This can't be saved as a new event, so the change was not applied.",
  // readOnlyEventMovedError: title => `This change would move the read-only event "${title}", so it was not applied.`,
  // unwritableEventMovedError: title => `This change would move the event "${title}", whose dates can't be edited, so it was not applied.`,
  // dependencyCascadeBlockedError: 'This dependency would move a read-only event, so it was not created.',
  // dependencyDatesNotWritableError: "This dependency would move an event whose dates can't be changed, so it was not created.",
  // dependencyCycleError: 'This dependency would create a cycle between events.',
  // dependencyDuplicateError: 'A dependency of this type already exists between these two events.',
  // dependencyRecurringEventError: 'Dependencies cannot involve recurring events.',
  // dependencyReadOnlyError: 'Dependencies cannot be changed while the scheduler is read-only.',
  // dependencyUnknownEventError: 'This dependency cannot be created because one of its events no longer exists.',
};

const deDEEvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Ressource: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const deDECalendar: SchedulerCalendarTranslations = {
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
  // viewSwitcherAriaLabel: 'Views',

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
  // dayGridLabel: 'All-day and multi-day events',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} weitere..`,
  nextTimeSpan: (timeSpan) => `Nächste(r) ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `Vorherige(r) ${timeSpan}`,
  weekAbbreviation: 'W',
  weekNumberAriaLabel: (weekNumber) => `Woche ${weekNumber}`,

  // AgendaView
  // agendaViewEmptyStateLabel: 'No upcoming events',

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

const deDETimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Ressourcentitel',

  // Dependency dialog
  // dependencyEditTitle: 'Edit dependency',
  // dependencyDetailsTitle: 'Dependency details',
  // dependencySourceLabel: 'From',
  // dependencyTargetLabel: 'To',
  // dependencyTypeLabel: 'Type',
  // dependencyLagLabel: 'Lag',
  // dependencyLagUnitAriaLabel: 'Lag unit',
  // dependencyNoLag: 'None',
  // dependencyInvalidLagError: 'Enter a whole number, 0 or more.',
  // dependencyAllDayLagIgnored: 'An all-day event can only wait whole days, so this lag adds no wait.',
  // dependencyAllDayLagRounded: lag => `An all-day event can only wait whole days: ${lag}.`,
  // dependencyUpdateCascadeBlockedError: 'This change would move a read-only event, so it was not applied.',
  // dependencyUpdateDatesNotWritableError: "This change would move an event whose dates can't be changed, so it was not applied.",
  // dependencyUpdateNotFoundError: 'This dependency no longer exists.',
  // dependencyTypeFinishToStart: 'Finish to start',
  // dependencyTypeStartToStart: 'Start to start',
  // dependencyTypeFinishToFinish: 'Finish to finish',
  // dependencyTypeStartToFinish: 'Start to finish',
  // dependencyLagUnitMinutes: 'minutes',
  // dependencyLagUnitHours: 'hours',
  // dependencyLagUnitDays: 'days',
  // dependencyLagUnitWeeks: 'weeks',
  // dependencyLag: (amount, unit) => `${amount} ${unit}${amount === 1 ? '' : 's'}`,

  // Dependency context menu and dialog actions
  // dependencyActionsAriaLabel: 'Dependency actions',
  // editDependency: 'Edit dependency',
  // showDependencyDetails: 'Show details',
  // deleteDependency: 'Delete',

  // Accessible description of an event that waits on dependencies
  // dependencyFinishToStartDescription: ({
  //   title,
  //   lag
  // }) => `Cannot start until ${lag === null ? '' : `${lag} after `}${title} finishes.`,
  // dependencyStartToStartDescription: ({
  //   title,
  //   lag
  // }) => `Cannot start until ${lag === null ? '' : `${lag} after `}${title} starts.`,
  // dependencyFinishToFinishDescription: ({
  //   title,
  //   lag
  // }) => `Cannot finish until ${lag === null ? '' : `${lag} after `}${title} finishes.`,
  // dependencyStartToFinishDescription: ({
  //   title,
  //   lag
  // }) => `Cannot finish until ${lag === null ? '' : `${lag} after `}${title} starts.`,
};

export const deDE: SchedulerLocalization = getSchedulerLocalization({
  dialog: deDEDialog,
  event: deDEEvent,
  calendar: deDECalendar,
  timeline: deDETimeline,
});
