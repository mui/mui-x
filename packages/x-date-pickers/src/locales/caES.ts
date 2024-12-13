import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'Hores',
  minutes: 'Minuts',
  seconds: 'Segons',
  meridiem: 'Meridià',
};

const caESPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes següent',

  // View navigation
  openPreviousView: "Obrir l'última vista",
  openNextView: 'Obrir la següent vista',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'la vista anual està oberta, canvia a la vista de calendari'
      : 'la vista de calendari està oberta, canvia a la vista anual',

  // DateRange labels
  start: 'Començar',
  end: 'Terminar',
  startDate: 'Data inicial',
  startTime: 'Hora inicial',
  endDate: 'Data final',
  endTime: 'Hora final',

  // Action bar
  cancelButtonLabel: 'Cancel·lar',
  clearButtonLabel: 'Netejar',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Avuí',

  // Toolbar titles
  datePickerToolbarTitle: 'Seleccionar data',
  dateTimePickerToolbarTitle: 'Seleccionar data i hora',
  timePickerToolbarTitle: 'Seleccionar hora',
  dateRangePickerToolbarTitle: 'Seleccionar rang de dates',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Selecciona ${views[view]}. ${!formattedTime ? 'Hora no seleccionada' : `L'hora seleccionada és ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} hores`,
  minutesClockNumberText: (minutes) => `${minutes} minuts`,
  secondsClockNumberText: (seconds) => `${seconds} segons`,

  // Digital clock labels
  selectViewText: (view) => `Seleccionar ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Número de la setmana',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Setmana ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Tria la data, la data triada és ${formattedDate}` : 'Tria la data',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Tria l'hora, l'hora triada és ${formattedTime}` : "Tria l'hora",
  fieldClearLabel: 'Netega el valor',

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

  // View names
  year: 'Any',
  month: 'Mes',
  day: 'Dia',
  weekDay: 'Dia de la setmana',
  hours: 'Hores',
  minutes: 'Minuts',
  seconds: 'Segons',
  meridiem: 'Meridià',

  // Common
  empty: 'Buit',
};

export const caES = getPickersLocalization(caESPickers);
