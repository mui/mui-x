import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const svSEPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Föregående månad',
  nextMonth: 'Nästa månad',

  // View navigation
  openPreviousView: 'öppna föregående vy',
  openNextView: 'öppna nästa vy',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'årsvyn är öppen, byt till kalendervy'
      : 'kalendervyn är öppen, byt till årsvy',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

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

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Välj datum, valt datum är ${utils.format(value, 'fullDate')}`
      : 'Välj datum',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Välj tid, vald tid är ${utils.format(value, 'fullTime')}`
      : 'Välj tid',

  // Table labels
  timeTableLabel: 'välj tid',
  dateTableLabel: 'välj datum',
};

export const svSE = getPickersLocalization(svSEPickers);
