import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const roRODialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Culoarea evenimentului',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Dată și oră',
  resourceColorSectionLabel: 'Resursă și culoare',
  allDayLabel: 'Toată ziua',
  closeButtonAriaLabel: 'Închide',
  closeButtonLabel: 'Închide',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Șterge evenimentul',
  // deleteConfirmationTitle: 'Delete this event?',
  // deleteConfirmationMessage: 'This action is irreversible. Are you sure you want to proceed?',
  cancel: 'Anulează',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Descriere',
  endDateLabel: 'Data de sfârșit',
  endTimeLabel: 'Ora de sfârșit',
  eventTitleAriaLabel: 'Titlul evenimentului',
  generalTabLabel: 'General',
  labelNoResource: 'Fără resursă',
  labelInvalidResource: 'Resursă invalidă',
  recurrenceLabel: 'Recurență',
  recurrenceNoRepeat: 'Nu se repetă',
  recurrenceCustomRepeat: 'Regulă de repetare personalizată',
  recurrenceDailyPresetLabel: 'Se repetă zilnic',
  recurrenceDailyFrequencyLabel: 'zile',
  recurrenceEndsLabel: 'Se termină',
  recurrenceEndsAfterLabel: 'După',
  recurrenceEndsNeverLabel: 'Niciodată',
  recurrenceEndsUntilLabel: 'Până la',
  recurrenceEndsTimesLabel: 'ori',
  recurrenceEveryLabel: 'La fiecare',
  recurrenceRepeatLabel: 'Repetă',
  recurrenceTabLabel: 'Recurență',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Recurență',
  recurrenceWeeklyFrequencyLabel: 'săptămâni',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Se repetă săptămânal în ${weekdayName}`,
  recurrenceMonthlyFrequencyLabel: 'luni',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Ziua ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) =>
    `${weekdayName} din ultima săptămână a lunii`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} ultima săptămână`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Se repetă lunar în ziua ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `${weekdayName} săptămâna ${ord} a lunii`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName} săptămâna ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'În',
  recurrenceYearlyFrequencyLabel: 'ani',
  recurrenceYearlyPresetLabel: (date) => `Se repetă anual pe ${date}`,
  noResourceAriaLabel: 'Fără resursă',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Resursă',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Salvează',
  startDateAfterEndDateError: 'Data de sfârșit nu poate fi înainte de data de început.',
  startDateLabel: 'Data de început',
  startTimeAfterEndTimeError: 'Ora de sfârșit trebuie să fie după ora de început.',
  startTimeLabel: 'Ora de început',

  // RecurringScopeDialog
  all: 'Toate evenimentele',
  confirm: 'Confirmă',
  onlyThis: 'Doar acest eveniment',
  radioGroupAriaLabel: 'Aria de aplicare a modificării evenimentelor recurente',
  thisAndFollowing: 'Acest eveniment și următoarele',
  title: 'Aplică această modificare la:',

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

const roROEvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Resursă: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const roROCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Resurse',

  // ViewSwitcher
  agenda: 'Agendă',
  day: 'Zi',
  month: 'Lună',
  other: 'Altele',
  today: 'Astăzi',
  week: 'Săptămână',
  time: 'Timp',
  days: 'Zile',
  months: 'Luni',
  weeks: 'Săptămâni',
  years: 'Ani',
  // viewSwitcherAriaLabel: 'Views',

  // DateNavigator
  closeSidePanel: 'Închide panoul lateral',
  openSidePanel: 'Deschide panoul lateral',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12 ore (1:00PM)',
  hour24h: '24 de ore (13:00)',
  preferencesMenu: 'Setări',
  showWeekends: 'Afișează weekendurile',
  showEmptyDaysInAgenda: 'Afișează zilele goale',
  showWeekNumber: 'Afișează numărul săptămânii',
  timeFormat: 'Formatul orei',
  viewSpecificOptions: (view) => `Opțiuni pentru vizualizarea ${view}`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'Toată ziua',
  // dayGridLabel: 'All-day and multi-day events',
  hiddenEvents: (hiddenEventsCount) => `Încă ${hiddenEventsCount}..`,
  nextTimeSpan: (timeSpan) => `${timeSpan} următoare`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterioară`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Săptămâna ${weekNumber}`,

  // AgendaView
  // agendaViewEmptyStateLabel: 'No upcoming events',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Se termină pe ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendar',
  miniCalendarGoToPreviousMonth: 'Afișează luna anterioară în calendar',
  miniCalendarGoToNextMonth: 'Afișează luna următoare în calendar',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titlul resursei',
};

const roROTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Titlul resursei',

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

export const roRO: SchedulerLocalization = getSchedulerLocalization({
  dialog: roRODialog,
  event: roROEvent,
  calendar: roROCalendar,
  timeline: roROTimeline,
});
