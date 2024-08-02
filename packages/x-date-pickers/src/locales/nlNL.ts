import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'uren',
  minutes: 'minuten',
  seconds: 'seconden',
  meridiem: 'meridium',
};

const nlNLPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Vorige maand',
  nextMonth: 'Volgende maand',

  // View navigation
  openPreviousView: 'Open vorige view',
  openNextView: 'Open volgende view',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'jaarweergave is geopend, schakel over naar kalenderweergave'
      : 'kalenderweergave is geopend, switch naar jaarweergave',

  // DateRange labels
  start: 'Start',
  end: 'Einde',
  startDate: 'Start datum',
  startTime: 'Start tijd',
  endDate: 'Eind datum',
  endTime: 'Eind tijd',

  // Action bar
  cancelButtonLabel: 'Annuleren',
  clearButtonLabel: 'Resetten',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Vandaag',

  // Toolbar titles
  datePickerToolbarTitle: 'Selecteer datum',
  dateTimePickerToolbarTitle: 'Selecteer datum & tijd',
  timePickerToolbarTitle: 'Selecteer tijd',
  dateRangePickerToolbarTitle: 'Selecteer datumbereik',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Selecteer ${timeViews[view]}. ${time === null ? 'Geen tijd geselecteerd' : `Geselecteerde tijd is ${adapter.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} uren`,
  minutesClockNumberText: (minutes) => `${minutes} minuten`,
  secondsClockNumberText: (seconds) => `${seconds} seconden`,

  // Digital clock labels
  selectViewText: (view) => `Selecteer ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Weeknummer',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Week ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Kies datum, geselecteerde datum is ${utils.format(value, 'fullDate')}`
      : 'Kies datum',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Kies tijd, geselecteerde tijd is ${utils.format(value, 'fullTime')}`
      : 'Kies tijd',
  fieldClearLabel: 'Wissen',

  // Table labels
  timeTableLabel: 'kies tijd',
  dateTableLabel: 'kies datum',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Jaar',
  month: 'Maand',
  day: 'Dag',
  weekDay: 'Weekdag',
  hours: 'Uren',
  minutes: 'Minuten',
  seconds: 'Seconden',
  meridiem: 'Middag',

  // Common
  empty: 'Legen',
};

export const nlNL = getPickersLocalization(nlNLPickers);
