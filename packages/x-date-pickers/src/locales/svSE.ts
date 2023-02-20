import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const svSEPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Föregående månad',
  nextMonth: 'Nästa månad',

  // View navigation
  openPreviousView: 'öppna föregående vy',
  openNextView: 'öppna nästa vy',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvyn är öppen, byt till kalendervy'
      : 'kalendervyn är öppen, byt till årsvy',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Start',
  end: 'Slut',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Rensa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Idag',

  // Toolbar titles
  // datePickerDefaultToolbarTitle: 'Select date',
  // dateTimePickerDefaultToolbarTitle: 'Select date & time',
  // timePickerDefaultToolbarTitle: 'Select time',
  // dateRangePickerDefaultToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Ingen tid vald' : `Vald tid är ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} timmar`,
  minutesClockNumberText: (minutes) => `${minutes} minuter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Välj datum, valt datum är ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Välj datum',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Välj tid, vald tid är ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Välj tid',

  // Table labels
  timeTableLabel: 'välj tid',
  dateTableLabel: 'välj datum',
};

export const svSE = getPickersLocalization(svSEPickers);
