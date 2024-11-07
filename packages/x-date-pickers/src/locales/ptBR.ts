import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'horas',
  minutes: 'minutos',
  seconds: 'segundos',
  meridiem: 'meridiano',
};

const ptBRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',

  // View navigation
  openPreviousView: 'Abrir seleção anterior',
  openNextView: 'Abrir próxima seleção',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'Seleção de ano está aberta, alternando para seleção de calendário'
      : 'Seleção de calendários está aberta, alternando para seleção de ano',

  // DateRange labels
  start: 'Início',
  end: 'Fim',
  startDate: 'Data de início',
  startTime: 'Hora de início',
  endDate: 'Data de Término',
  endTime: 'Hora de Término',

  // Action bar
  cancelButtonLabel: 'Cancelar',
  clearButtonLabel: 'Limpar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hoje',

  // Toolbar titles
  datePickerToolbarTitle: 'Selecione a data',
  dateTimePickerToolbarTitle: 'Selecione data e hora',
  timePickerToolbarTitle: 'Selecione a hora',
  dateRangePickerToolbarTitle: 'Selecione o intervalo entre datas',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Selecione ${timeViews[view]}. ${!formattedTime ? 'Hora não selecionada' : `Selecionado a hora ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} horas`,
  minutesClockNumberText: (minutes) => `${minutes} minutos`,
  secondsClockNumberText: (seconds) => `${seconds} segundos`,

  // Digital clock labels
  selectViewText: (view) => `Selecione ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Número da semana',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Semana ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) => {
    return formattedDate
      ? `Escolha uma data, data selecionada ${formattedDate}`
      : 'Escolha uma data';
  },
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Escolha uma hora, hora selecionada ${formattedTime}` : 'Escolha uma hora',
  fieldClearLabel: 'Limpar valor',

  // Table labels
  timeTableLabel: 'escolha uma hora',
  dateTableLabel: 'escolha uma data',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'A'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'SSSS' : 'SS'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Ano',
  month: 'Mês',
  day: 'Dia',
  weekDay: 'Dia da Semana',
  hours: 'Horas',
  minutes: 'Minutos',
  seconds: 'Segundos',
  meridiem: 'Meio dia',

  // Common
  empty: 'Vazio',
};

export const ptBR = getPickersLocalization(ptBRPickers);
