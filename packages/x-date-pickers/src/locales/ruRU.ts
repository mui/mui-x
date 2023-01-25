
import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const ruRUPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Предыдущий месяц',
  nextMonth: 'Следующий месяц',

  // View navigation
  openPreviousView: 'открыть предыдущий вид',
  openNextView: 'открыть следующий вид',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'открыт говодой вид, переключить на календарный вид'
      : 'открыт календарный вид, переключить на говодой вид',

  // DateRange placeholders
  start: 'Начало',
  end: 'Конец',

  // Action bar
  cancelButtonLabel: 'Отмена',
  clearButtonLabel: 'Очистить',
  okButtonLabel: 'Ок',
  todayButtonLabel: 'Сегодня',

  // Toolbar titles
  datePickerToolbarTitle: 'Выбрать дату',
  dateTimePickerToolbarTitle: 'Выбрать дату и время',
  timePickerToolbarTitle: 'Выбрать время',
  dateRangePickerToolbarTitle: 'Выбрать календарный период',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Время не выбрано' : `Выбрано время ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} часов`,
  minutesClockNumberText: (minutes) => `${minutes} минут`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Номер недели',
  calendarWeekNumberHeaderText: '№',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Неделя ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Выберите дату, выбрана дата ${utils.format(value, 'fullDate')}`
      : 'Выберите дату',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Выберите время, выбрано время ${utils.format(value, 'fullTime')}`
      : 'Выберите время',

  // Table labels
  timeTableLabel: 'выбрать время',
  dateTableLabel: 'выбрать дату',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'ММММ' : 'ММ'),
  fieldDayPlaceholder: () => 'ДД',
  fieldHoursPlaceholder: () => 'чч',
  fieldMinutesPlaceholder: () => 'мм',
  fieldSecondsPlaceholder: () => 'сс',
  fieldMeridiemPlaceholder: () => 'дп',
};

export const ruRU = getPickersLocalization(ruRUPickers);
