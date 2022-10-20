import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const ptBRPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',

  // View navigation
  openPreviousView: 'Abrir próxima seleção',
  openNextView: 'Abrir seleção anterior',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'Seleção de ano está aberta, alternando para seleção de calendário'
      : 'Seleção de calendários está aberta, alternando para seleção de ano',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Início',
  end: 'Fim',

  // Action bar
  cancelButtonLabel: 'Cancelar',
  clearButtonLabel: 'Limpar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hoje',

  // Toolbar titles
  // datePickerToolbarTitle: 'Select date',
  // dateTimePickerToolbarTitle: 'Select date & time',
  // timePickerToolbarTitle: 'Select time',
  // dateRangePickerToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Selecione ${view}. ${
      time === null
        ? 'Hora não selecionada'
        : `Selecionado a hora ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} horas`,
  minutesClockNumberText: (minutes) => `${minutes} minutos`,
  secondsClockNumberText: (seconds) => `${seconds} segundos`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Escolha uma data, data selecionada ${utils.format(value, 'fullDate')}`
      : 'Escolha uma data',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Escolha uma hora, hora selecionada ${utils.format(value, 'fullTime')}`
      : 'Escolha uma hora',

  // Table labels
  timeTableLabel: 'escolha uma hora',
  dateTableLabel: 'escolha uma data',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const ptBR = getPickersLocalization(ptBRPickers);
