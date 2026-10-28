import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const plPLDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Kolor wydarzenia',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Data i godzina',
  resourceColorSectionLabel: 'Zasób i kolor',
  allDayLabel: 'Cały dzień',
  closeButtonAriaLabel: 'Zamknij',
  closeButtonLabel: 'Zamknij',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Usuń wydarzenie',
  // deleteConfirmationTitle: 'Delete this event?',
  // deleteConfirmationMessage: 'This action is irreversible. Are you sure you want to proceed?',
  cancel: 'Anuluj',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Opis',
  endDateLabel: 'Data zakończenia',
  endTimeLabel: 'Godzina zakończenia',
  eventTitleAriaLabel: 'Tytuł wydarzenia',
  generalTabLabel: 'Ogólne',
  labelNoResource: 'Brak zasobu',
  labelInvalidResource: 'Nieprawidłowy zasób',
  recurrenceLabel: 'Powtarzanie',
  recurrenceNoRepeat: 'Nie powtarzaj',
  recurrenceCustomRepeat: 'Niestandardowa reguła powtarzania',
  recurrenceDailyPresetLabel: 'Powtarza się codziennie',
  recurrenceDailyFrequencyLabel: 'dni',
  recurrenceEndsLabel: 'Koniec',
  recurrenceEndsAfterLabel: 'Po',
  recurrenceEndsNeverLabel: 'Nigdy',
  recurrenceEndsUntilLabel: 'Do',
  recurrenceEndsTimesLabel: 'razy',
  recurrenceEveryLabel: 'Co',
  recurrenceRepeatLabel: 'Powtarzaj',
  recurrenceTabLabel: 'Powtarzanie',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Powtarzanie',
  recurrenceWeeklyFrequencyLabel: 'tygodnie',
  recurrenceWeeklyPresetLabel: ({ weekday }) => {
    const map = {
      monday: 'w poniedziałek',
      tuesday: 'we wtorek',
      wednesday: 'w środę',
      thursday: 'w czwartek',
      friday: 'w piątek',
      saturday: 'w sobotę',
      sunday: 'w niedzielę',
    };
    return `Powtarza się co tydzień ${map[weekday]}`;
  },
  recurrenceMonthlyFrequencyLabel: 'miesiące',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Dzień ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) =>
    `${weekdayName} w ostatnim tygodniu miesiąca`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName}, ostatni tydzień`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Powtarza się co miesiąc w dniu ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) =>
    `${weekdayName}, tydzień ${ord} miesiąca`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${weekdayName}, tydzień ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'W',
  recurrenceYearlyFrequencyLabel: 'lata',
  recurrenceYearlyPresetLabel: (date) => `Powtarza się co roku w ${date}`,
  noResourceAriaLabel: 'Brak określonego zasobu',
  selectColorAriaLabel: (color) => `Wybierz ${color} jako kolor wydarzenia`,
  resourceLabel: 'Zasób',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  requiredResourceError: 'Należy wybrać zasób.',
  saveChanges: 'Zapisz',
  startDateAfterEndDateError: 'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.',
  startDateLabel: 'Data rozpoczęcia',
  startTimeAfterEndTimeError: 'Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.',
  startTimeLabel: 'Godzina rozpoczęcia',

  // RecurringScopeDialog
  all: 'Wszystkie wydarzenia',
  confirm: 'Potwierdź',
  onlyThis: 'Tylko to wydarzenie',
  radioGroupAriaLabel: 'Zakres edycji wydarzeń cyklicznych',
  thisAndFollowing: 'To i kolejne wydarzenia',
  title: 'Zastosuj tę zmianę do:',

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

const plPLEvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Zasób: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const plPLCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Zasoby',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Dzień',
  month: 'Miesiąc',
  other: 'Inne',
  today: 'Dzisiaj',
  week: 'Tydzień',
  time: 'Czas',
  days: 'Dni',
  months: 'Miesiące',
  weeks: 'Tygodnie',
  years: 'Lata',

  // DateNavigator
  closeSidePanel: 'Zamknij panel boczny',
  openSidePanel: 'Otwórz panel boczny',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12-godzinny (1:00PM)',
  hour24h: '24-godzinny (13:00)',
  preferencesMenu: 'Ustawienia',
  showWeekends: 'Pokaż weekendy',
  showEmptyDaysInAgenda: 'Pokaż puste dni',
  showWeekNumber: 'Pokaż numer tygodnia',
  timeFormat: 'Format czasu',
  viewSpecificOptions: (view) => `Opcje widoku ${view}`,
  startWeekOn: 'Początek tygodnia',
  weekdaySunday: 'Niedziela',
  weekdayMonday: 'Poniedziałek',
  weekdaySaturday: 'Sobota',

  // WeekView
  allDay: 'Cały dzień',
  // dayGridLabel: 'All-day and multi-day events',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} więcej..`,
  nextTimeSpan: (timeSpan) => `Następny ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `Poprzedni ${timeSpan}`,
  weekAbbreviation: 'T',
  weekNumberAriaLabel: (weekNumber) => `Tydzień ${weekNumber}`,

  // AgendaView
  // agendaViewEmptyStateLabel: 'No upcoming events',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Kończy się ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Kalendarz',
  miniCalendarGoToPreviousMonth: 'Pokaż poprzedni miesiąc w kalendarzu',
  miniCalendarGoToNextMonth: 'Pokaż następny miesiąc w kalendarzu',

  // Main calendar region
  calendarContentAriaLabel: 'Zawartość kalendarza',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Tytuł zasobu',
};

const plPLTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Tytuł zasobu',

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

export const plPL: SchedulerLocalization = getSchedulerLocalization({
  dialog: plPLDialog,
  event: plPLEvent,
  calendar: plPLCalendar,
  timeline: plPLTimeline,
});
