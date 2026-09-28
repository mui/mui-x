import type { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import type { TimeViewWithMeridiem } from '../internals/models';

// Translation map for Clock Label
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'часы',
  minutes: 'минуты',
  seconds: 'секунды',
  meridiem: 'меридием',
};

// Russian has 3 count-based forms, selected by the last digit(s) of the count
function getPluralForm(count: number, one: string, few: string, many: string) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return one;
  }
  if (lastDigit > 1 && lastDigit < 5 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return few;
  }
  return many;
}

const ruRUPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Предыдущий месяц',
  nextMonth: 'Следующий месяц',

  // View navigation
  openPreviousView: 'Открыть предыдущий вид',
  openNextView: 'Открыть следующий вид',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'открыт годовой вид, переключить на календарный вид'
      : 'открыт календарный вид, переключить на годовой вид',

  // DateRange labels
  start: 'Начало',
  end: 'Конец',
  startDate: 'Начальная дата',
  startTime: 'Начальное время',
  endDate: 'Конечная дата',
  endTime: 'Конечное время',

  // Action bar
  cancelButtonLabel: 'Отмена',
  clearButtonLabel: 'Очистить',
  okButtonLabel: 'Ок',
  todayButtonLabel: 'Сегодня',
  nextStepButtonLabel: 'Следующий',

  // Toolbar titles
  datePickerToolbarTitle: 'Выбрать дату',
  dateTimePickerToolbarTitle: 'Выбрать дату и время',
  timePickerToolbarTitle: 'Выбрать время',
  dateRangePickerToolbarTitle: 'Выбрать период',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Выбрать ${timeViews[view]}. ${!formattedTime ? 'Время не выбрано' : `Выбрано время ${formattedTime}`}`,
  hoursClockNumberText: (hours) =>
    `${hours} ${getPluralForm(Number(hours), 'час', 'часа', 'часов')}`,
  minutesClockNumberText: (minutes) =>
    `${minutes} ${getPluralForm(Number(minutes), 'минута', 'минуты', 'минут')}`,
  secondsClockNumberText: (seconds) =>
    `${seconds} ${getPluralForm(Number(seconds), 'секунда', 'секунды', 'секунд')}`,

  // Digital clock labels
  selectViewText: (view) => `Выбрать ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Номер недели',
  calendarWeekNumberHeaderText: '№',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Неделя ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Выберите дату, выбрана дата ${formattedDate}` : 'Выберите дату',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Выберите время, выбрано время ${formattedTime}` : 'Выберите время',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Очистить значение',

  // Table labels
  timeTableLabel: 'выбрать время',
  dateTableLabel: 'выбрать дату',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'ММММ' : 'ММ'),
  fieldDayPlaceholder: () => 'ДД',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'ДДДД' : 'ДД'),
  fieldHoursPlaceholder: () => 'чч',
  fieldMinutesPlaceholder: () => 'мм',
  fieldSecondsPlaceholder: () => 'сс',
  fieldMeridiemPlaceholder: () => '(д|п)п',

  // View names
  year: 'Год',
  month: 'Месяц',
  day: 'День',
  weekDay: 'День недели',
  hours: 'Часы',
  minutes: 'Минуты',
  seconds: 'Секунды',
  meridiem: 'Меридием',

  // Common
  empty: 'Пустой',
};

export const ruRU = getPickersLocalization(ruRUPickers);
