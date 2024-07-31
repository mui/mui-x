import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'timar',
  minutes: 'minuttar',
  seconds: 'sekundar',
  meridiem: 'meridiem',
};

const nnNOPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Forrige månad',
  nextMonth: 'Neste månad',

  // View navigation
  openPreviousView: 'Opne forrige visning',
  openNextView: 'Opne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvisning er open, byt til kalendervisning'
      : 'kalendervisning er open, byt til årsvisning',

  // DateRange labels
  start: 'Start',
  end: 'Slutt',
  startDate: 'Startdato',
  startTime: 'Starttid',
  endDate: 'Sluttdato',
  endTime: 'Slutttid',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Fjern',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',

  // Toolbar titles
  datePickerToolbarTitle: 'Vel dato',
  dateTimePickerToolbarTitle: 'Vel dato & klokkeslett',
  timePickerToolbarTitle: 'Vel klokkeslett',
  dateRangePickerToolbarTitle: 'Vel datoperiode',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Vel ${timeViews[view]}. ${time === null ? 'Ingen tid vald' : `Vald tid er ${adapter.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} timar`,
  minutesClockNumberText: (minutes) => `${minutes} minuttar`,
  secondsClockNumberText: (seconds) => `${seconds} sekundar`,

  // Digital clock labels
  selectViewText: (view) => `Vel ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Vekenummer',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Veke ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Vel dato, vald dato er ${utils.format(value, 'fullDate')}`
      : 'Vel dato',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Vel tid, vald tid er ${utils.format(value, 'fullTime')}`
      : 'Vel tid',
  fieldClearLabel: 'Fjern verdi',

  // Table labels
  timeTableLabel: 'vel tid',
  dateTableLabel: 'vel dato',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Å'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'tt',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'År',
  month: 'Månad',
  day: 'Dag',
  weekDay: 'Vekedag',
  hours: 'Timar',
  minutes: 'Minuttar',
  seconds: 'Sekundar',
  meridiem: 'Meridiem',

  // Common
  empty: 'Tom',
};

export const nnNO = getPickersLocalization(nnNOPickers);
