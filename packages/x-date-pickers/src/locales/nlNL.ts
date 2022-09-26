import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const nlNLPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Vorige maand',
  nextMonth: 'Volgende maand',

  // View navigation
  openPreviousView: 'open vorige view',
  openNextView: 'open volgende view',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'jaarweergave is geopend, schakel over naar kalenderweergave'
      : 'kalenderweergave is geopend, switch naar jaarweergave',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Start',
  end: 'Einde',

  // Action bar
  cancelButtonLabel: 'Annuleren',
  clearButtonLabel: 'Resetten',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Vandaag',

  // Toolbar titles
  // datePickerDefaultToolbarTitle: 'Select date',
  // dateTimePickerDefaultToolbarTitle: 'Select date & time',
  // timePickerDefaultToolbarTitle: 'Select time',
  // dateRangePickerDefaultToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Selecteer ${view}. ${
      time === null
        ? 'Geen tijd geselecteerd'
        : `Geselecteerde tijd is ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} uren`,
  minutesClockNumberText: (minutes) => `${minutes} minuten`,
  secondsClockNumberText: (seconds) => `${seconds} seconden`,

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Kies datum, geselecteerde datum is ${utils.format(value, 'fullDate')}`
      : 'Kies datum',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Kies tijd, geselecteerde tijd is ${utils.format(value, 'fullTime')}`
      : 'Kies tijd',

  // Table labels
  timeTableLabel: 'kies tijd',
  dateTableLabel: 'kies datum',
};

export const nlNL = getPickersLocalization(nlNLPickers);
