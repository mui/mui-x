import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'timar',
  minutes: 'minuttar',
  seconds: 'sekundar',
  meridiem: 'meridiem',
};

const nnNOPickers: Partial<PickersLocaleText> = {
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
  nextStepButtonLabel: 'Neste',

  // Toolbar titles
  datePickerToolbarTitle: 'Vel dato',
  dateTimePickerToolbarTitle: 'Vel dato & klokkeslett',
  timePickerToolbarTitle: 'Vel klokkeslett',
  dateRangePickerToolbarTitle: 'Vel datoperiode',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Vel ${timeViews[view]}. ${!formattedTime ? 'Ingen tid vald' : `Vald tid er ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} timar`,
  minutesClockNumberText: (minutes) => `${minutes} minuttar`,
  secondsClockNumberText: (seconds) => `${seconds} sekundar`,

  // Digital clock labels
  selectViewText: (view) => `Vel ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Vekenummer',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Veke ${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Vel dato, vald dato er ${formattedDate}` : 'Vel dato',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Vel tid, vald tid er ${formattedTime}` : 'Vel tid',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Fjern verdi',

  // Table labels
  timeTableLabel: 'vel tid',
  dateTableLabel: 'vel dato',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Å'.repeat(params.digitAmount),
  fieldHoursPlaceholder: () => 'tt',

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
