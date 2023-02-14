import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const nbNOPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Neste måned',

  // View navigation
  openPreviousView: 'åpne forrige visning',
  openNextView: 'åpne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvisning er åpen, bytt til kalendervisning'
      : 'kalendervisning er åpen, bytt til årsvisning',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Start',
  end: 'Slutt',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Fjern',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',

  // Toolbar titles
  // datePickerDefaultToolbarTitle: 'Select date',
  // dateTimePickerDefaultToolbarTitle: 'Select date & time',
  // timePickerDefaultToolbarTitle: 'Select time',
  // dateRangePickerDefaultToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Velg ${view}. ${
      time === null ? 'Ingen tid valgt' : `Valgt tid er ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velg dato, valgt dato er ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Velg dato',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velg tid, valgt tid er ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Velg tid',

  // Table labels
  timeTableLabel: 'velg tid',
  dateTableLabel: 'velg dato',
};

export const nbNO = getPickersLocalization(nbNOPickers);
