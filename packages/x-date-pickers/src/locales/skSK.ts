import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'Hodiny',
  minutes: 'Minúty',
  seconds: 'Sekundy',
  meridiem: 'Popoludnie',
};

const skSKPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Predchádzajúci mesiac',
  nextMonth: 'Ďalší mesiac',

  // View navigation
  openPreviousView: 'Otvoriť predchádzajúce zobrazenie',
  openNextView: 'Otvoriť ďalšie zobrazenie',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'ročné zobrazenie otvorené, prepnite do zobrazenia kalendára'
      : 'zobrazenie kalendára otvorené, prepnite do zobrazenia roka',

  // DateRange labels
  start: 'Začiatok',
  end: 'Koniec',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Zrušiť',
  clearButtonLabel: 'Vymazať',
  okButtonLabel: 'Potvrdiť',
  todayButtonLabel: 'Dnes',

  // Toolbar titles
  datePickerToolbarTitle: 'Vyberte dátum',
  dateTimePickerToolbarTitle: 'Vyberte dátum a čas',
  timePickerToolbarTitle: 'Vyberte čas',
  dateRangePickerToolbarTitle: 'Vyberete rozmedzie dátumov',

  // Clock labels
  clockLabelText: (view, time, utils, formattedTime) =>
    `${timeViews[view] ?? view} vybraný. ${!formattedTime && (time === null || !utils.isValid(time)) ? 'Nie je vybraný čas' : `Vybraný čas je ${formattedTime ?? utils.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} hodín`,
  minutesClockNumberText: (minutes) => `${minutes} minút`,
  secondsClockNumberText: (seconds) => `${seconds} sekúnd`,

  // Digital clock labels
  selectViewText: (view) => `Vyberte ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Týždeň v roku',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber} týždeň v roku`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils, formattedDate) =>
    formattedDate || (value !== null && utils.isValid(value))
      ? `Vyberte dátum, vybraný dátum je ${formattedDate ?? utils.format(value, 'fullDate')}`
      : 'Vyberte dátum',
  openTimePickerDialogue: (value, utils, formattedTime) =>
    formattedTime || (value !== null && utils.isValid(value))
      ? `Vyberte čas, vybraný čas je ${formattedTime ?? utils.format(value, 'fullTime')}`
      : 'Vyberte čas',
  // fieldClearLabel: 'Clear',

  // Table labels
  timeTableLabel: 'vyberte čas',
  dateTableLabel: 'vyberte dátum',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  // year: 'Year',
  // month: 'Month',
  // day: 'Day',
  // weekDay: 'Week day',
  // hours: 'Hours',
  // minutes: 'Minutes',
  // seconds: 'Seconds',
  // meridiem: 'Meridiem',

  // Common
  // empty: 'Empty',
};

export const skSK = getPickersLocalization(skSKPickers);
