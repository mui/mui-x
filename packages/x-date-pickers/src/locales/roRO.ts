import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'Ore',
  minutes: 'Minute',
  seconds: 'Secunde',
  meridiem: 'Meridiane',
};

const roROPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Luna anterioară',
  nextMonth: 'Luna următoare',

  // View navigation
  openPreviousView: 'Deschideți vizualizarea anterioară',
  openNextView: 'Deschideți vizualizarea următoare',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'Vizualizarea anuală este deschisă, comutați la vizualizarea calendarului'
      : 'Vizualizarea calendarului este deschisă, comutați la vizualizarea anuală',

  // DateRange labels
  start: 'Început',
  end: 'Sfârșit',
  startDate: 'Data de început',
  startTime: 'Ora de început',
  endDate: 'Data de sfârșit',
  endTime: 'Ora de sfârșit',

  // Action bar
  cancelButtonLabel: 'Anulare',
  clearButtonLabel: 'Ștergere',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Astăzi',

  // Toolbar titles
  datePickerToolbarTitle: 'Selectați data',
  dateTimePickerToolbarTitle: 'Selectați data și ora',
  timePickerToolbarTitle: 'Selectați ora',
  dateRangePickerToolbarTitle: 'Selectați intervalul de date',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Selectați ${timeViews[view] ?? view}. ${!formattedTime ? 'Nicio oră selectată' : `Ora selectată este ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} ${timeViews.hours}`,
  minutesClockNumberText: (minutes) => `${minutes} ${timeViews.minutes}`,
  secondsClockNumberText: (seconds) => `${seconds}  ${timeViews.seconds}`,

  // Digital clock labels
  selectViewText: (view) => `Selectați ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Număr săptămână',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Săptămâna ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Selectați data, data selectată este ${formattedDate}` : 'Selectați data',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Selectați ora, ora selectată este ${formattedTime}` : 'Selectați ora',
  fieldClearLabel: 'Golire conținut',

  // Table labels
  timeTableLabel: 'Selectați ora',
  dateTableLabel: 'Selectați data',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'A'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'LLLL' : 'LL'),
  fieldDayPlaceholder: () => 'ZZ',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'ZZZZ' : 'ZZ'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'An',
  month: 'Luna',
  day: 'Ziua',
  weekDay: 'Ziua saptămânii',
  hours: 'Ore',
  minutes: 'Minute',
  seconds: 'Secunde',
  meridiem: 'Meridiem',

  // Common
  empty: 'Gol',
};

export const roRO = getPickersLocalization(roROPickers);
