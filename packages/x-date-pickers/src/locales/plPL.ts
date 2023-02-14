import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const plPLPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Poprzedni miesiąc',
  nextMonth: 'Następny miesiąc',

  // View navigation
  openPreviousView: 'otwórz poprzedni widok',
  openNextView: 'otwórz następny widok',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'otwarty jest widok roku, przełącz na widok kalendarza'
      : 'otwarty jest widok kalendarza, przełącz na widok roku',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Początek',
  end: 'Koniec',

  // Action bar
  cancelButtonLabel: 'Anuluj',
  clearButtonLabel: 'Wyczyść',
  okButtonLabel: 'Zatwierdź',
  todayButtonLabel: 'Dzisiaj',

  // Toolbar titles
  // datePickerDefaultToolbarTitle: 'Select date',
  // dateTimePickerDefaultToolbarTitle: 'Select date & time',
  // timePickerDefaultToolbarTitle: 'Select time',
  // dateRangePickerDefaultToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Nie wybrano czasu' : `Wybrany czas to ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} godzin`,
  minutesClockNumberText: (minutes) => `${minutes} minut`,
  secondsClockNumberText: (seconds) => `${seconds} sekund`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Wybierz datę, obecnie wybrana data to ${utils.format(utils.date(rawValue)!, 'fullDate')}`
      : 'Wybierz datę',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Wybierz czas, obecnie wybrany czas to ${utils.format(utils.date(rawValue)!, 'fullTime')}`
      : 'Wybierz czas',

  // Table labels
  timeTableLabel: 'wybierz czas',
  dateTableLabel: 'wybierz datę',
};

export const plPL = getPickersLocalization(plPLPickers);
