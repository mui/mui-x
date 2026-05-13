import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const frFRDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: "Couleur de l'événement",
  dateTimeSectionLabel: 'Date et heure',
  resourceColorSectionLabel: 'Ressource et couleur',
  allDayLabel: 'Toute la journée',
  closeButtonAriaLabel: 'Fermer',
  closeButtonLabel: 'Fermer',
  deleteEvent: "Supprimer l'événement",
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
  recurrenceMainSelectCustomLabel: 'Récurrence',
  recurrenceWeeklyFrequencyLabel: 'semaines',
  recurrenceWeeklyPresetLabel: (weekday) => `Se répète chaque semaine le ${weekday}`,
  recurrenceMonthlyFrequencyLabel: 'mois',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Jour ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} de la dernière semaine du mois`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} dernière semaine`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Se répète tous les mois le ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} semaine ${ord} du mois`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} semaine ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Le',
  recurrenceYearlyFrequencyLabel: 'années',
  recurrenceYearlyPresetLabel: (date) => `Se répète tous les ans le ${date}`,
  noResourceAriaLabel: 'Aucune ressource',
  resourceLabel: 'Ressource',
  saveChanges: 'Enregistrer',
  startDateAfterEndDateError: 'La date/heure de début doit être antérieure à la date/heure de fin.',
  startDateLabel: 'Date de début',
  startTimeLabel: 'Heure de début',

  // ScopeDialog
  all: 'Tous les évènements',
  cancel: 'Annuler',
  confirm: 'Confirmer',
  onlyThis: 'Seulement cet événement',
  radioGroupAriaLabel: "Modifier l'événement récurrent",
  thisAndFollowing: 'Cet événement et les suivants',
  title: 'Appliquer ce changement à :',
};

const frFRCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
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

  // Preferences menu
  amPm12h: '12 heures (1:00PM)',
  hour24h: '24 heures (13:00)',
  preferencesMenu: 'Paramètres',
  showWeekends: 'Afficher les week-ends',
  showEmptyDaysInAgenda: 'Afficher les jours vides',
  showWeekNumber: 'Afficher le numéro de semaine',
  timeFormat: "Format de l'heure",
  viewSpecificOptions: (view) => `Options de la vue ${view}`,

  // WeekView
  allDay: 'Toute la journée',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} de plus..`,
  nextTimeSpan: (timeSpan) => `${timeSpan} suivant(e)`,
  previousTimeSpan: (timeSpan) => `${timeSpan} précédent(e)`,
  resourceAriaLabel: (resourceName) => `Ressource : ${resourceName}`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semaine ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Se termine le ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendrier',
  miniCalendarGoToPreviousMonth: 'Afficher le mois précédent dans le calendrier',
  miniCalendarGoToNextMonth: 'Afficher le mois suivant dans le calendrier',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titre de la ressource',
};

const frFRTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titre de la ressource',
};

export const frFR: SchedulerLocalization = getSchedulerLocalization({
  dialog: frFRDialog,
  calendar: frFRCalendar,
  timeline: frFRTimeline,
});
