import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const nbNOPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Neste måned',

  // View navigation
  openPreviousView: 'åpne forrige visning',
  openNextView: 'åpne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'årsvisning er åpen, bytt til kalendervisning'
      : 'kalendervisning er åpen, bytt til årsvisning',
  // inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') => isKeyboardInputOpen ? `text input view is open, go to ${viewType} view` : `${viewType} view is open, go to text input view`,

  // DateRange placeholders
  start: 'Start',
  end: 'Slutt',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Fjern',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',

  // Toolbar titles
  // datePickerToolbarTitle: 'Select date',
  // dateTimePickerToolbarTitle: 'Select date & time',
  // timePickerToolbarTitle: 'Select time',
  // dateRangePickerToolbarTitle: 'Select date range',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Velg ${view}. ${
      time === null ? 'Ingen tid valgt' : `Valgt tid er ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Velg dato, valgt dato er ${utils.format(value, 'fullDate')}`
      : 'Velg dato',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Velg tid, valgt tid er ${utils.format(value, 'fullTime')}`
      : 'Velg tid',

  // Table labels
  timeTableLabel: 'velg tid',
  dateTableLabel: 'velg dato',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const nbNO = getPickersLocalization(nbNOPickers);
