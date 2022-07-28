import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const views = {
  hours: 'las horas',
  minutes: 'los minutos',
  seconds: 'los segundos',
};

// This object is not Partial<PickersLocaleText> because it is the default values

const esESPickers: PickersLocaleText<any> = {
  // Calendar navigation
  previousMonth: 'Último mes',
  nextMonth: 'Próximo mes',

  // View navigation
  openPreviousView: 'abrir la última vista',
  openNextView: 'abrir la siguiente vista',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'la vista del año está abierta, cambie a la vista de calendario'
      : 'la vista de calendario está abierta, cambie a la vista del año',

  // DateRange placeholders
  start: 'Empezar',
  end: 'Terminar',

  // Action bar
  cancelButtonLabel: 'Cancelar',
  clearButtonLabel: 'Limpia',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hoy',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Seleccione ${views[view]}. ${
      time === null
        ? 'Sin tiempo seleccionado'
        : `El tiempo seleccionado es ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} horas`,
  minutesClockNumberText: (minutes) => `${minutes} minutos`,
  secondsClockNumberText: (seconds) => `${seconds} segundos`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Elige la fecha, la fecha elegida es ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Elige la fecha',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Elige la hora, la hora elegido es ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Elige la hora',

  // Table labels
  timeTableLabel: 'elige la fecha',
  dateTableLabel: 'elige la hora',
};

export const esES = getPickersLocalization(esESPickers);
