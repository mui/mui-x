import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'horas',
  minutes: 'minutos',
  seconds: 'segundos',
  meridiem: 'meridiano',
};

const ptPTPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',

  // View navigation
  openPreviousView: 'Abrir seleção anterior',
  openNextView: 'Abrir próxima seleção',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'A seleção do ano está aberta, altere para a seleção do calendário'
      : 'A seleção do calendários está aberta, altere para a seleção do ano',

  // DateRange labels
  start: 'Início',
  end: 'Fim',
  startDate: 'Data de início',
  startTime: 'Hora de início',
  endDate: 'Data de fim',
  endTime: 'Hora de fim',

  // Action bar
  cancelButtonLabel: 'Cancelar',
  clearButtonLabel: 'Limpar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hoje',

  // Toolbar titles
  datePickerToolbarTitle: 'Selecione a data',
  dateTimePickerToolbarTitle: 'Selecione a data e a hora',
  timePickerToolbarTitle: 'Selecione a hora',
  dateRangePickerToolbarTitle: 'Selecione o intervalo de datas',

  // Clock labels
  clockLabelText: (view, time, utils, formattedTime) =>
    `Selecione ${timeViews[view]}. ${!formattedTime && (time === null || !utils.isValid(time)) ? 'Hora não selecionada' : `Selecionado a hora ${formattedTime ?? utils.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} horas`,
  minutesClockNumberText: (minutes) => `${minutes} minutos`,
  secondsClockNumberText: (seconds) => `${seconds} segundos`,

  // Digital clock labels
  selectViewText: (view) => `Selecione ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Número da semana',
  calendarWeekNumberHeaderText: 'N.º',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Semana ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils, formattedDate) =>
    formattedDate || (value !== null && utils.isValid(value))
      ? `Escolha uma data, a data selecionada é ${formattedDate ?? utils.format(value, 'fullDate')}`
      : 'Escolha uma data',
  openTimePickerDialogue: (value, utils, formattedTime) =>
    formattedTime || (value !== null && utils.isValid(value))
      ? `Escolha uma hora, a hora selecionada é ${formattedTime ?? utils.format(value, 'fullTime')}`
      : 'Escolha uma hora',
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
  meridiem: 'Meridiano',

  // Common
  empty: 'Vazio',
};

export const ptPT = getPickersLocalization(ptPTPickers);
