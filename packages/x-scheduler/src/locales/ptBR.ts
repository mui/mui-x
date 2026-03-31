import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const ptBRDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Cor do evento',
  dateTimeSectionLabel: 'Data e hora',
  resourceColorSectionLabel: 'Recurso e cor',
  allDayLabel: 'O dia todo',
  closeButtonAriaLabel: 'Fechar',
  closeButtonLabel: 'Fechar',
  deleteEvent: 'Excluir evento',
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
  recurrenceMainSelectCustomLabel: 'Selecione a regra de recorrência',
  recurrenceWeeklyFrequencyLabel: 'semanas',
  recurrenceWeeklyPresetLabel: (weekday) => `Repete semanalmente na ${weekday}`,
  recurrenceMonthlyFrequencyLabel: 'meses',
  recurrenceMonthlyDayOfMonthLabel: (dayNumber) => `Dia ${dayNumber}`,
  recurrenceMonthlyLastWeekAriaLabel: (weekDay) => `${weekDay} da última semana do mês`,
  recurrenceMonthlyLastWeekLabel: (weekDay) => `${weekDay} última semana`,
  recurrenceMonthlyPresetLabel: (dayNumber) => `Repete mensalmente no dia ${dayNumber}`,
  recurrenceMonthlyWeekNumberAriaLabel: (ord, weekDay) => `${weekDay} semana ${ord} do mês`,
  recurrenceMonthlyWeekNumberLabel: (ord, weekDay) => `${weekDay} semana ${ord}`,
  recurrenceWeeklyMonthlySpecificInputsLabel: 'Em',
  recurrenceYearlyFrequencyLabel: 'anos',
  recurrenceYearlyPresetLabel: (date) => `Repete anualmente em ${date}`,
  noResourceAriaLabel: 'Sem recurso específico',
  resourceLabel: 'Recurso',
  saveChanges: 'Salvar alterações',
  startDateAfterEndDateError: 'A data/hora de início deve ser anterior à data/hora de término.',
  startDateLabel: 'Data de início',
  startTimeLabel: 'Hora de início',

  // ScopeDialog
  all: 'Todos os eventos da série',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  onlyThis: 'Apenas este evento',
  radioGroupAriaLabel: 'Escopo de edição de eventos recorrentes',
  thisAndFollowing: 'Este e os eventos seguintes',
  title: 'Aplicar esta alteração a:',
};

const ptBRCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
  // ResourcesLegend
  hideEventsLabel: (resourceName) => `Ocultar eventos de ${resourceName}`,
  resourcesLabel: 'Recursos',
  resourcesLegendSectionLabel: 'Legenda de recursos',
  showEventsLabel: (resourceName) => `Mostrar eventos de ${resourceName}`,

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

  // Preferences menu
  amPm12h: '12 horas (1:00PM)',
  hour24h: '24 horas (13:00)',
  preferencesMenu: 'Configurações',
  showWeekends: 'Mostrar fins de semana',
  showEmptyDaysInAgenda: 'Mostrar dias vazios',
  showWeekNumber: 'Mostrar número da semana',
  timeFormat: 'Formato da hora',
  viewSpecificOptions: (view) => `Opções da visualização ${view}`,

  // WeekView
  allDay: 'O dia todo',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `Mais ${hiddenEventsCount}..`,
  nextTimeSpan: (timeSpan) => `Próximo(a) ${timeSpan}`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterior`,
  resourceAriaLabel: (resourceName) => `Recurso: ${resourceName}`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semana ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Termina em ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendário',
  miniCalendarGoToPreviousMonth: 'Mostrar mês anterior no calendário',
  miniCalendarGoToNextMonth: 'Mostrar próximo mês no calendário',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

const ptBRTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

export const ptBR: SchedulerLocalization = getSchedulerLocalization({
  dialog: ptBRDialog,
  calendar: ptBRCalendar,
  timeline: ptBRTimeline,
});
