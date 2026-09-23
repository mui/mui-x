import { getSchedulerLocalization } from '../utils/getSchedulerLocalization';
import type {
  SchedulerLocalization,
  SchedulerDialogTranslations,
  SchedulerEventTranslations,
  SchedulerCalendarTranslations,
  SchedulerTimelineTranslations,
} from '../utils/getSchedulerLocalization';

const ptPTDialog: SchedulerDialogTranslations = {
  // EventDialog
  colorPickerLabel: 'Cor do evento',
  // colorSectionLabel: 'Color',
  dateTimeSectionLabel: 'Data e hora',
  resourceColorSectionLabel: 'Recurso e cor',
  allDayLabel: 'Todo o dia',
  closeButtonAriaLabel: 'Fechar',
  closeButtonLabel: 'Fechar',
  // editEventButtonAriaLabel: 'Edit event',
  // deleteEventButtonAriaLabel: 'Delete event',
  // eventActionsToolbarAriaLabel: 'Event actions',
  deleteEvent: 'Eliminar evento',
  // editEvent: 'Edit event',
  // showEventDetails: 'Show details',
  // eventContextMenuAriaLabel: 'Event actions',
  descriptionLabel: 'Descrição',
  endDateLabel: 'Data de fim',
  endTimeLabel: 'Hora de fim',
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
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} da última semana do mês`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} da última semana`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Repete mensalmente no dia ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${ord}ª ${weekDay} do mês`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${ord}ª ${weekDay}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Em',
  recurrenceYearlyFrequencyLabel: 'anos',
  recurrenceYearlyPresetLabel: (date) => `Repete anualmente em ${date}`,
  noResourceAriaLabel: 'Sem recurso',
  // selectColorAriaLabel: color => `Select ${color} as event color`,
  resourceLabel: 'Recurso',
  // invalidDateError: 'Enter a valid date.',
  // invalidTimeError: 'Enter a valid time.',
  // requiredResourceError: 'A resource is required.',
  saveChanges: 'Guardar',
  startDateAfterEndDateError: 'A data de fim não pode ser anterior à data de início.',
  startDateLabel: 'Data de início',
  startTimeAfterEndTimeError: 'A hora de fim deve ser posterior à hora de início.',
  startTimeLabel: 'Hora de início',

  // RecurringScopeDialog
  all: 'Todos os eventos',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  onlyThis: 'Apenas este evento',
  radioGroupAriaLabel: 'Âmbito de edição de eventos recorrentes',
  thisAndFollowing: 'Este evento e seguintes',
  title: 'Aplicar esta alteração a:',
};

const ptPTEvent: SchedulerEventTranslations = {
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

const ptPTCalendar: SchedulerCalendarTranslations = {
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

  // DateNavigator
  closeSidePanel: 'Fechar painel lateral',
  openSidePanel: 'Abrir painel lateral',

  // SidePanelDrawer (small screens)
  // openMenu: 'Open menu',

  // Preferences menu
  amPm12h: '12 horas (1:00PM)',
  hour24h: '24 horas (13:00)',
  preferencesMenu: 'Definições',
  showWeekends: 'Mostrar fins de semana',
  showEmptyDaysInAgenda: 'Mostrar dias vazios',
  showWeekNumber: 'Mostrar número da semana',
  timeFormat: 'Formato da hora',
  viewSpecificOptions: (view) => `Opções da vista ${view}`,
  // startWeekOn: 'Start week on',
  // weekdaySunday: 'Sunday',
  // weekdayMonday: 'Monday',
  // weekdaySaturday: 'Saturday',

  // WeekView
  allDay: 'Todo o dia',
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} mais…`,
  nextTimeSpan: (timeSpan) => `${timeSpan} seguinte`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterior`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semana ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Termina a ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendário',
  miniCalendarGoToPreviousMonth: 'Mostrar mês anterior no calendário',
  miniCalendarGoToNextMonth: 'Mostrar próximo mês no calendário',

  // Main calendar region
  // calendarContentAriaLabel: 'Calendar content',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

const ptPTTimeline: SchedulerTimelineTranslations = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

export const ptPT: SchedulerLocalization = getSchedulerLocalization({
  dialog: ptPTDialog,
  event: ptPTEvent,
  calendar: ptPTCalendar,
  timeline: ptPTTimeline,
});
