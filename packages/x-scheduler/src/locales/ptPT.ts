import type {
  EventDialogLocaleText,
  EventCalendarLocaleText,
  EventTimelineLocaleText,
} from '../models/translations';
import {
  getSchedulerLocalization,
  type SchedulerLocalization,
} from '../utils/getSchedulerLocalization';

const ptPTDialog: Partial<EventDialogLocaleText> = {
  // EventDialog
  colorPickerLabel: 'Cor do evento',
  // colorSectionLabel: 'Color',
  // colorRedLabel: 'Red',
  // colorPinkLabel: 'Pink',
  // colorPurpleLabel: 'Purple',
  // colorIndigoLabel: 'Indigo',
  // colorBlueLabel: 'Blue',
  // colorTealLabel: 'Teal',
  // colorGreenLabel: 'Green',
  // colorLimeLabel: 'Lime',
  // colorAmberLabel: 'Amber',
  // colorOrangeLabel: 'Orange',
  // colorGreyLabel: 'Grey',
  // labelNoColor: 'Default',
  dateTimeSectionLabel: 'Data e hora',
  resourceColorSectionLabel: 'Recurso e cor',
  // resourceSectionLabel: 'Resource',
  allDayLabel: 'Todo o dia',
  closeButtonAriaLabel: 'Fechar',
  closeButtonLabel: 'Fechar',
  deleteEvent: 'Eliminar evento',
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
  recurrenceMainSelectCustomLabel: 'Recorrência',
  recurrenceWeeklyFrequencyLabel: 'semanas',
  recurrenceWeeklyPresetLabel: (weekday) => `Repete semanalmente (${weekday})`,
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
  resourceLabel: 'Recurso',
  saveChanges: 'Guardar',
  startDateAfterEndDateError: 'A data/hora de início deve ser anterior à data/hora de fim.',
  startDateLabel: 'Data de início',
  startTimeLabel: 'Hora de início',

  // ScopeDialog
  all: 'Todos os eventos',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  onlyThis: 'Apenas este evento',
  radioGroupAriaLabel: 'Âmbito de edição de eventos recorrentes',
  thisAndFollowing: 'Este evento e seguintes',
  title: 'Aplicar esta alteração a:',
};

const ptPTCalendar: Partial<Omit<EventCalendarLocaleText, keyof EventDialogLocaleText>> = {
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
  preferencesMenu: 'Definições',
  showWeekends: 'Mostrar fins de semana',
  showEmptyDaysInAgenda: 'Mostrar dias vazios',
  showWeekNumber: 'Mostrar número da semana',
  timeFormat: 'Formato da hora',
  viewSpecificOptions: (view) => `Opções da vista ${view}`,

  // WeekView
  allDay: 'Todo o dia',

  // MonthView
  hiddenEvents: (hiddenEventsCount) => `${hiddenEventsCount} mais…`,
  nextTimeSpan: (timeSpan) => `${timeSpan} seguinte`,
  previousTimeSpan: (timeSpan) => `${timeSpan} anterior`,
  resourceAriaLabel: (resourceName) => `Recurso: ${resourceName}`,
  weekAbbreviation: 'S',
  weekNumberAriaLabel: (weekNumber) => `Semana ${weekNumber}`,

  // EventItem
  eventItemMultiDayLabel: (endDate) => `Termina a ${endDate}`,

  // MiniCalendar
  miniCalendarLabel: 'Calendário',
  miniCalendarGoToPreviousMonth: 'Mostrar mês anterior no calendário',
  miniCalendarGoToNextMonth: 'Mostrar próximo mês no calendário',

  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

const ptPTTimeline: Partial<Omit<EventTimelineLocaleText, keyof EventDialogLocaleText>> = {
  // Timeline title sub grid
  timelineResourceTitleHeader: 'Título do recurso',
};

export const ptPT: SchedulerLocalization = getSchedulerLocalization({
  dialog: ptPTDialog,
  calendar: ptPTCalendar,
  timeline: ptPTTimeline,
});
