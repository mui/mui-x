import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const ptBRDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Cor do evento',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Data e hora',
  resourceColorSectionLabel: 'Recurso e cor',
  allDayLabel: 'O dia todo',
  closeButtonAriaLabel: 'Fechar',
  closeButtonLabel: 'Fechar',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Excluir evento',
  // deleteConfirmationTitle: 'Delete this event?',
  // deleteConfirmationMessage: 'This action is irreversible. Are you sure you want to proceed?',
  cancel: 'Cancelar',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Descrição',
  endDateLabel: 'Data de término',
  endTimeLabel: 'Hora de término',
  eventTitleAriaLabel: 'Título do evento',
  generalTabLabel: 'Geral',
  labelNoResource: 'Sem recurso',
  labelInvalidResource: 'Recurso inválido',
  recurrenceLabel: 'Recorrência',
  recurrenceNoRepeat: 'Não repetir',
  recurrenceCustomRepeat: 'Regra de repetição personalizada',
  recurrenceDailyPresetLabel: 'Repete diariamente',
  recurrenceDailyFrequencyLabel: 'dias',
  recurrenceEndsLabel: 'Termina',
  recurrenceEndsAfterLabel: 'Após',
  recurrenceEndsNeverLabel: 'Nunca',
  recurrenceEndsUntilLabel: 'Até',
  recurrenceEndsTimesLabel: 'vezes',
  recurrenceEveryLabel: 'A cada',
  recurrenceRepeatLabel: 'Repetir',
  recurrenceTabLabel: 'Recorrência',
  // recurrenceTimezoneLabel: timezone => `Timezone: ${timezone}`,
  // recurrenceLabelTimezoneSuffix: timezone => `(${timezone})`,
  recurrenceMainSelectCustomLabel: 'Recorrência',
  recurrenceWeeklyFrequencyLabel: 'semanas',
  recurrenceWeeklyPresetLabel: ({ weekdayName }) => `Repete semanalmente (${weekdayName})`,
  recurrenceMonthlyFrequencyLabel: 'meses',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Dia ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: ({ weekdayName }) => `${weekdayName} da última semana do mês`,
  recurrenceMonthlyLastWeekLabel: ({ weekdayName }) => `${weekdayName} da última semana`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Repete mensalmente no dia ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: ({ ord, weekdayName }) => `${ord}ª ${weekdayName} do mês`,
  recurrenceMonthlyWeekNumberLabel: ({ ord, weekdayName }) => `${ord}ª ${weekdayName}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Em',
  recurrenceYearlyFrequencyLabel: 'anos',
  recurrenceYearlyPresetLabel: (date) => `Repete anualmente em ${date}`,
  noResourceAriaLabel: 'Sem recurso',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Recurso',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Salvar',
  startDateAfterEndDateError: 'A data de término não pode ser anterior à data de início.',
  startDateLabel: 'Data de início',
  startTimeAfterEndTimeError: 'A hora de término deve ser posterior à hora de início.',
  startTimeLabel: 'Hora de início',

  // RecurringScopeDialog
  all: 'Todos os eventos',
  confirm: 'Confirmar',
  onlyThis: 'Apenas este evento',
  radioGroupAriaLabel: 'Escopo de edição de eventos recorrentes',
  thisAndFollowing: 'Este evento e seguintes',
  title: 'Aplicar esta alteração a:',

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

const ptBREvent: SchedulerEventTranslations = {
  // Event accessible name
  // eventAriaLabelTimeRange: (start, end) => `${start} to ${end}`,
  // eventAriaLabelDateRange: (start, end) => `From ${start} to ${end}`,
  // eventAriaLabelAllDay: 'All day',
  // eventAriaLabelRecurring: 'Recurring',
  resourceAriaLabel: (resourceName) => `Recurso: ${resourceName}`,
  // eventAriaLabel: ({
  //   title,
  //   when,
  //   date,
  //   resource,
  //   recurring
  // }) => [title, when, date, resource, recurring].filter(Boolean).join(', '),
};

const ptBRCalendar: SchedulerCalendarTranslations = {
  // ResourcesTree
  resourcesLabel: 'Recursos',

  // ViewSwitcher
  agenda: 'Agenda',
  day: 'Dia',
  month: 'Mês',
  other: 'Outro',
  today: 'Hoje',
  week: 'Semana',
  time: 'Hora',
  days: 'Dias',
  months: 'Meses',
  weeks: 'Semanas',
  years: 'Anos',
  // viewSwitcherAriaLabel: 'Views',

  // DateNavigator
  closeSidePanel: 'Fechar painel lateral',
  openSidePanel: 'Abrir painel lateral',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12 horas (1:00PM)',
  hour24h: '24 horas (13:00)',
  preferencesMenu: 'Configurações',
  showWeekends: 'Mostrar fins de semana',
  showEmptyDaysInAgenda: 'Mostrar dias vazios',
  showWeekNumber: 'Mostrar número da semana',
  timeFormat: 'Formato da hora',
  viewSpecificOptions: (view) => `Opções da visualização ${view}`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'O dia todo',
  // dayGridLabel: 'All-day and multi-day events',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} mais…`,
  nextTimeSpan: (timeSpan) => `Próximo(a) ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterior`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semana ${weekNumber}`,

  // AgendaView
  // agendaViewEmptyStateLabel: 'No upcoming events',

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Termina em ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendário',
  miniCalendarGoToPreviousMonth: 'Mostrar mês anterior no calendário',
  miniCalendarGoToNextMonth: 'Mostrar próximo mês no calendário',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

const ptBRTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',

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

export const ptBR: SchedulerLocalization = getSchedulerLocalization({
  dialog: ptBRDialog,
  event: ptBREvent,
  calendar: ptBRCalendar,
  timeline: ptBRTimeline,
});
