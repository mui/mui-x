import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'les hores',
  minutes: 'els minuts',
  seconds: 'els segons',
  meridiem: 'meridiem',
};

const caESPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Últim mes',
  nextMonth: 'Pròxim mes',

  // View navigation
  openPreviousView: "obrir l'última vista",
  openNextView: 'obrir la següent vista',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? "la vista de l'any està oberta, canvie a la vista de calendari"
      : "la vista de calendari està oberta, canvie a la vista de l'any",

  // DateRange placeholders
  start: 'Començar',
  end: 'Terminar',

  // Action bar
  cancelButtonLabel: 'Cancel·lar',
  clearButtonLabel: 'Netejar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hui',

  // Toolbar titles
  datePickerToolbarTitle: 'Seleccionar data',
  dateTimePickerToolbarTitle: 'Seleccionar data i hora',
  timePickerToolbarTitle: 'Seleccionar hora',
  dateRangePickerToolbarTitle: 'Seleccionar rang de dates',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Seleccione ${views[view]}. ${
      time === null
        ? 'Sense temps seleccionat'
        : `El temps seleccionat és ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} hores`,
  minutesClockNumberText: (minutes) => `${minutes} minuts`,
  secondsClockNumberText: (seconds) => `${seconds} segons`,

  // Digital clock labels
  selectViewText: (view) => `Seleccionar ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Número de setmana',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Setmana ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Tria la data, la data triada és ${utils.format(value, 'fullDate')}`
      : 'Tria la data',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Tria l'hora, l'hora triada és ${utils.format(value, 'fullTime')}`
      : "Tria l'hora",
  // fieldClearLabel: 'Clear value',

  // Table labels
  timeTableLabel: 'tria la data',
  dateTableLabel: "tria l'hora",

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const caES = getPickersLocalization(caESPickers);
