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

  // DateRange placeholders
  start: 'Início',
  end: 'Fim',

  // Action bar
  cancelButtonLabel: 'Cancelar',
  clearButtonLabel: 'Limpar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hoje',

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
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Escolha uma data, data selecionada ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Escolha uma data',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Escolha uma hora, hora selecionada ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Escolha uma hora',

  // Table labels
  timeTableLabel: 'escolha uma hora',
  dateTableLabel: 'escolha uma data',
};

export const ptBR = getPickersLocalization(ptBRPickers);
