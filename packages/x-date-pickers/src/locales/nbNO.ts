import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'timer',
  minutes: 'minutter',
  seconds: 'sekunder',
  meridiem: 'meridiem',
};

const nbNOPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Neste måned',

  // View navigation
  openPreviousView: 'Åpne forrige visning',
  openNextView: 'Åpne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvisning er åpen, bytt til kalendervisning'
      : 'kalendervisning er åpen, bytt til årsvisning',

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
  datePickerToolbarTitle: 'Velg dato',
  dateTimePickerToolbarTitle: 'Velg dato & klokkeslett',
  timePickerToolbarTitle: 'Velg klokkeslett',
  dateRangePickerToolbarTitle: 'Velg datoperiode',

  // Clock labels
  clockLabelText: (view, time, utils, formattedTime) =>
    `Velg ${timeViews[view]}. ${!formattedTime && (time === null || !utils.isValid(time)) ? 'Ingen tid valgt' : `Valgt tid er ${formattedTime ?? utils.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Digital clock labels
  selectViewText: (view) => `Velg ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Ukenummer',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Uke ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils, formattedDate) =>
    formattedDate || (value !== null && utils.isValid(value))
      ? `Velg dato, valgt dato er ${formattedDate ?? utils.format(value, 'fullDate')}`
      : 'Velg dato',
  openTimePickerDialogue: (value, utils, formattedTime) =>
    formattedTime || (value !== null && utils.isValid(value))
      ? `Velg tid, valgt tid er ${formattedTime ?? utils.format(value, 'fullTime')}`
      : 'Velg tid',
  fieldClearLabel: 'Slett',

  // Table labels
  timeTableLabel: 'velg tid',
  dateTableLabel: 'velg dato',

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
  month: 'Måned',
  day: 'Dag',
  weekDay: 'Ukedag',
  hours: 'Timer',
  minutes: 'Minutter',
  seconds: 'Sekunder',
  meridiem: 'Meridiem',

  // Common
  empty: 'Tøm',
};

export const nbNO = getPickersLocalization(nbNOPickers);
