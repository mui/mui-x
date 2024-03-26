import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'годин',
  minutes: 'хвилин',
  seconds: 'секунд',
  meridiem: 'Південь',
};

const ukUAPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Попередній місяць',
  nextMonth: 'Наступний місяць',

  // View navigation
  openPreviousView: 'Відкрити попередній вигляд',
  openNextView: 'Відкрити наступний вигляд',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'річний вигляд відкрито, перейти до календарного вигляду'
      : 'календарний вигляд відкрито, перейти до річного вигляду',

  // DateRange labels
  start: 'Початок',
  end: 'Кінець',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Відміна',
  clearButtonLabel: 'Очистити',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Сьогодні',

  // Toolbar titles
  datePickerToolbarTitle: 'Вибрати дату',
  dateTimePickerToolbarTitle: 'Вибрати дату і час',
  timePickerToolbarTitle: 'Вибрати час',
  dateRangePickerToolbarTitle: 'Вибрати календарний період',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Вибрати ${timeViews[view]}. ${time === null ? 'Час не вибраний' : `Вибрано час ${adapter.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} годин`,
  minutesClockNumberText: (minutes) => `${minutes} хвилин`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Digital clock labels
  selectViewText: (view) => `Вибрати ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Номер тижня',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Тиждень ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Оберіть дату, обрана дата  ${utils.format(value, 'fullDate')}`
      : 'Оберіть дату',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Оберіть час, обраний час  ${utils.format(value, 'fullTime')}`
      : 'Оберіть час',
  // fieldClearLabel: 'Clear value',

  // Table labels
  timeTableLabel: 'оберіть час',
  dateTableLabel: 'оберіть дату',

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

export const ukUA = getPickersLocalization(ukUAPickers);
