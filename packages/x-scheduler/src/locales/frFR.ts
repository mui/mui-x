import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const frFRDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: "Couleur de l'événement",
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Date et heure',
  resourceColorSectionLabel: 'Ressource et couleur',
  allDayLabel: 'Toute la journée',
  closeButtonAriaLabel: 'Fermer',
  closeButtonLabel: 'Fermer',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: "Supprimer l'événement",
  // deleteConfirmationTitle: 'Delete this event?',
  // deleteConfirmationMessage: 'This action is irreversible. Are you sure you want to proceed?',
  cancel: 'Annuler',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Description',
  endDateLabel: 'Date de fin',
  endTimeLabel: 'Heure de fin',
  eventTitleAriaLabel: "Titre de l'événement",
  generalTabLabel: 'Général',
  labelNoResource: 'Aucune ressource',
  labelInvalidResource: 'Ressource invalide',
  recurrenceLabel: 'Récurrence',
  recurrenceNoRepeat: 'Ne pas répéter',
  recurrenceCustomRepeat: 'Récurrence personnalisée',
  recurrenceDailyPresetLabel: 'Se répète tous les jours',
  recurrenceDailyFrequencyLabel: 'jours',
  recurrenceEndsLabel: 'Se termine',
  recurrenceEndsAfterLabel: 'Après',
  recurrenceEndsNeverLabel: 'Jamais',
  recurrenceEndsUntilLabel: "Jusqu'à",
  recurrenceEndsTimesLabel: 'fois',
  recurrenceEveryLabel: 'Chaque',
  recurrenceRepeatLabel: 'Répéter',
  recurrenceTabLabel: 'Récurrence',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Récurrence',
  recurrenceWeeklyFrequencyLabel: 'semaines',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Se répète chaque semaine le ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'mois',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Jour ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) =>
    `${weekdayName} de la dernière semaine du mois`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} dernière semaine`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Se répète tous les mois le ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `${weekdayName} semaine ${ord} du mois`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName} semaine ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Le',
  recurrenceYearlyFrequencyLabel: 'années',
  recurrenceYearlyPresetLabel: (date) => `Se répète tous les ans le ${date}`,
  noResourceAriaLabel: 'Aucune ressource',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Ressource',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Enregistrer',
  startDateAfterEndDateError: 'La date de fin ne peut pas être antérieure à la date de début.',
  startDateLabel: 'Date de début',
  startTimeAfterEndTimeError: "L'heure de fin doit être postérieure à l'heure de début.",
  startTimeLabel: 'Heure de début',

  // RecurringScopeDialog
  all: 'Tous les évènements',
  confirm: 'Confirmer',
  onlyThis: 'Seulement cet événement',
  radioGroupAriaLabel: "Modifier l'événement récurrent",
  thisAndFollowing: 'Cet événement et les suivants',
  title: 'Appliquer ce changement à :',

  // Errors
  // somethingWentWrongError: 'Something went wrong. Try again.',
  // eventNotLoadedError: 'This event is still being saved, so the change was not applied. Try again once it is saved.',
  // eventChangedWhileConfirmingError: 'This event changed while the delete confirmation was open, so the deletion was not applied. Try deleting it again.',
  // datesNotWritableError: "This date can't be changed, so the change was not applied.",
  // eventNotCreatableError: "This can't be saved as a new event, so the change was not applied.",
  // readOnlyEventMovedError: title => `This change would move the read-only event "${title}", so it was not applied.`,
  // dependencyCascadeBlockedError: 'This dependency would move a read-only event, so it was not created.',
  // dependencyCycleError: 'This dependency would create a cycle between events.',
  // dependencyDuplicateError: 'A dependency of this type already exists between these two events.',
  // dependencyRecurringEventError: 'Dependencies cannot involve recurring events.',
  // dependencyReadOnlyError: 'Dependencies cannot be changed while the scheduler is read-only.',
  // dependencyUnknownEventError: 'This dependency cannot be created because one of its events no longer exists.',
};

const frFREvent: SchedulerEventTranslations = {
  // Event accessible name
  eventAriaLabelTimeRange: (start, end) => `de ${start} à ${end}`,
  eventAriaLabelDateRange: (start, end) => `Du ${start} au ${end}`,
  eventAriaLabelAllDay: 'Toute la journée',
  eventAriaLabelRecurring: 'Récurrent',
  resourceAriaLabel: (resourceName) => `Ressource : ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const frFRCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Ressources',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Jour',
  month: 'Mois',
  other: 'Autre',
  today: "Aujourd'hui",
  week: 'Semaine',
  time: 'Heure',
  days: 'Jours',
  months: 'Mois',
  weeks: 'Semaines',
  years: 'Années',

  // DateNavigator
  closeSidePanel: 'Fermer le panneau latéral',
  openSidePanel: 'Ouvrir le panneau latéral',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12 heures (1:00PM)',
  hour24h: '24 heures (13:00)',
  preferencesMenu: 'Paramètres',
  showWeekends: 'Afficher les week-ends',
  showEmptyDaysInAgenda: 'Afficher les jours vides',
  showWeekNumber: 'Afficher le numéro de semaine',
  timeFormat: "Format de l'heure",
  viewSpecificOptions: (view) => `Options de la vue ${view}`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'Toute la journée',
  // dayGridLabel: 'All-day and multi-day events',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} de plus..`,
  nextTimeSpan: (timeSpan) => `${timeSpan} suivant(e)`,
  previousTimeSpan: (timeSpan) => `${timeSpan} précédent(e)`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semaine ${weekNumber}`,

  // AgendaView
  // agendaViewEmptyStateLabel: 'No upcoming events',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Se termine le ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendrier',
  miniCalendarGoToPreviousMonth: 'Afficher le mois précédent dans le calendrier',
  miniCalendarGoToNextMonth: 'Afficher le mois suivant dans le calendrier',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titre de la ressource',
};

const frFRTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titre de la ressource',

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

export const frFR: SchedulerLocalization = getSchedulerLocalization({
  dialog: frFRDialog,
  event: frFREvent,
  calendar: frFRCalendar,
  timeline: frFRTimeline,
});
