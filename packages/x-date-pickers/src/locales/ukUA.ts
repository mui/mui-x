import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'годин',
  minutes: 'хвилин',
  seconds: 'секунд',
  meridiem: 'Південь',
};

const ukUAPickers: Partial<PickersLocaleText> = {
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
  startDate: 'День початку',
  startTime: 'Час початку',
  endDate: 'День закінчення',
  endTime: 'Час закінчення',

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
  clockLabelText: (view, formattedTime) =>
    `Вибрати ${timeViews[view]}. ${!formattedTime ? 'Час не вибраний' : `Вибрано час ${formattedTime}`}`,
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
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Оберіть дату, обрана дата  ${formattedDate}` : 'Оберіть дату',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Оберіть час, обраний час  ${formattedTime}` : 'Оберіть час',
  fieldClearLabel: 'Очистити дані',

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
  year: 'Рік',
  month: 'Місяць',
  day: 'День',
  weekDay: 'День тижня',
  hours: 'Годин',
  minutes: 'Хвилин',
  seconds: 'Секунд',
  meridiem: 'Меридіем',

  // Common
  empty: 'Порожній',
};

export const ukUA = getPickersLocalization(ukUAPickers);
