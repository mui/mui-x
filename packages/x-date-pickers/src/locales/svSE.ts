import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'timmar',
  minutes: 'minuter',
  seconds: 'sekunder',
  meridiem: 'meridiem',
};

const svSEPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Föregående månad',
  nextMonth: 'Nästa månad',

  // View navigation
  openPreviousView: 'Öppna föregående vy',
  openNextView: 'Öppna nästa vy',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvyn är öppen, byt till kalendervy'
      : 'kalendervyn är öppen, byt till årsvy',

  // DateRange labels
  start: 'Start',
  end: 'Slut',
  startDate: 'Startdatum',
  startTime: 'Starttid',
  endDate: 'Slutdatum',
  endTime: 'Sluttid',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Rensa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Idag',

  // Toolbar titles
  datePickerToolbarTitle: 'Välj datum',
  dateTimePickerToolbarTitle: 'Välj datum & tid',
  timePickerToolbarTitle: 'Välj tid',
  dateRangePickerToolbarTitle: 'Välj datumintervall',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Välj ${timeViews[view]}. ${!formattedTime ? 'Ingen tid vald' : `Vald tid är ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} timmar`,
  minutesClockNumberText: (minutes) => `${minutes} minuter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Digital clock labels
  selectViewText: (view) => `Välj ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Vecka nummer',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Vecka ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Välj datum, valt datum är ${formattedDate}` : 'Välj datum',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Välj tid, vald tid är ${formattedTime}` : 'Välj tid',
  fieldClearLabel: 'Rensa värde',

  // Table labels
  timeTableLabel: 'välj tid',
  dateTableLabel: 'välj datum',

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
  weekDay: 'Veckodag',
  hours: 'Timmar',
  minutes: 'Minuter',
  seconds: 'Sekunder',
  meridiem: 'Meridiem',

  // Common
  empty: 'Tom',
};

export const svSE = getPickersLocalization(svSEPickers);
