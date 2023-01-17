import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const views = {
  hours: 'le ore',
  minutes: 'i minuti',
  seconds: 'i secondi',
};

const itITPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',

  // View navigation
  openPreviousView: 'apri la vista precedente',
  openNextView: 'apri la vista successiva',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? "la vista dell'anno è aperta, passare alla vista del calendario"
      : "la vista dell'calendario è aperta, passare alla vista dell'anno",
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
    isKeyboardInputOpen
      ? `la vista del campo di testo è aperta, passare alla vista ${viewType}`
      : `la vista aperta è: ${viewType}, vai alla vista del campo di testo`,

  // DateRange placeholders
  start: 'Inizio',
  end: 'Fine',

  // Action bar
  cancelButtonLabel: 'Cancellare',
  clearButtonLabel: 'Sgomberare',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Oggi',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Seleziona data',
  dateTimePickerDefaultToolbarTitle: 'Seleziona data e orario',
  timePickerDefaultToolbarTitle: 'Seleziona orario',
  dateRangePickerDefaultToolbarTitle: 'Seleziona intervallo di date',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Seleziona ${views[view]}. ${
      time === null
        ? 'Nessun orario selezionato'
        : `L'ora selezionata è ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} ore`,
  minutesClockNumberText: (minutes) => `${minutes} minuti`,
  secondsClockNumberText: (seconds) => `${seconds} secondi`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Scegli la data, la data selezionata è ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Scegli la data',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Scegli l'ora, l'ora selezionata è ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : "Scegli l'ora",

  // Table labels
  timeTableLabel: 'scegli un ora',
  dateTableLabel: 'scegli una data',
};

export const itIT = getPickersLocalization(itITPickers);
