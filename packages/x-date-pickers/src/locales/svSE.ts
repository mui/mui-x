import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const svSEPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Föregående månad',
  nextMonth: 'Nästa månad',

  // View navigation
  openPreviousView: 'öppna föregående vy',
  openNextView: 'öppna nästa vy',
  // calendarViewSwitchingButtonAriaLabel: (view: DateView) => view === 'year' ? 'year view is open, switch to calendar view' : 'calendar view is open, switch to year view',

  // DateRange placeholders
  start: 'Start',
  end: 'Slut',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Rensa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Idag',

  // Toolbar titles
  // datePickerToolbarTitle: 'Select date',
  // dateTimePickerToolbarTitle: 'Select date & time',
  // timePickerToolbarTitle: 'Select time',
  // dateRangePickerToolbarTitle: 'Select date range',

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

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const svSE = getPickersLocalization(svSEPickers);
