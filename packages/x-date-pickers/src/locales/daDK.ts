import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'Timer',
  minutes: 'Minutter',
  seconds: 'Sekunder',
  meridiem: 'Meridiem',
};

const daDKPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Næste måned',

  // View navigation
  openPreviousView: 'Åben forrige visning',
  openNextView: 'Åben næste visning',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'årsvisning er åben, skift til kalendervisning'
      : 'kalendervisning er åben, skift til årsvisning',

  // DateRange labels
  start: 'Start',
  end: 'Slut',
  startDate: 'Start dato',
  startTime: 'Start tid',
  endDate: 'Slut date',
  endTime: 'Slut tid',

  // Action bar
  cancelButtonLabel: 'Annuller',
  clearButtonLabel: 'Ryd',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',

  // Toolbar titles
  datePickerToolbarTitle: 'Vælg dato',
  dateTimePickerToolbarTitle: 'Vælg dato & tidspunkt',
  timePickerToolbarTitle: 'Vælg tidspunkt',
  dateRangePickerToolbarTitle: 'Vælg datointerval',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Vælg ${timeViews[view] ?? view}. ${!formattedTime ? 'Intet tidspunkt valgt' : `Valgte tidspunkt er ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Digital clock labels
  selectViewText: (view) => `Vælg ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Ugenummer',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Uge ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Vælg dato, valgte dato er ${formattedDate}` : 'Vælg dato',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Vælg tidspunkt, valgte tidspunkt er ${formattedTime}` : 'Vælg tidspunkt',
  fieldClearLabel: 'ryd felt',

  // Table labels
  timeTableLabel: 'vælg tidspunkt',
  dateTableLabel: 'vælg dato',

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
  year: 'år',
  month: 'måned',
  day: 'dag',
  weekDay: 'ugedag',
  hours: 'timer',
  minutes: 'minutter',
  seconds: 'sekunder',
  meridiem: 'middag',

  // Common
  empty: 'tom',
};

export const daDK = getPickersLocalization(daDKPickers);
