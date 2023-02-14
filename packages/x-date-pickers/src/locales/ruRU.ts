import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// Translation map for Clock Label
const timeViews = {
  hours: 'часы',
  minutes: 'минуты',
  seconds: 'секунды',
};

// maps PickersToolbar["viewType"] to its translation
const viewTypes = {
  calendar: 'календарный',
  clock: 'часовой',
};

const ruRUPickers: PickersLocaleText<any> = {
  // Calendar navigation
  previousMonth: 'Предыдущий месяц',
  nextMonth: 'Следующий месяц',

  // View navigation
  openPreviousView: 'открыть предыдущий вид',
  openNextView: 'открыть следующий вид',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'открыт годовой вид, переключить на календарный вид'
      : 'открыт календарный вид, переключить на годовой вид',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `Открыт текстовый вид, перейти на ${viewTypes[viewType]} вид`
      : `Открыт ${viewTypes[viewType]} вид, перейти на текстовый вид`,

  // DateRange placeholders
  start: 'Начало',
  end: 'Конец',

  // Action bar
  cancelButtonLabel: 'Отмена',
  clearButtonLabel: 'Очистить',
  okButtonLabel: 'Ок',
  todayButtonLabel: 'Сегодня',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Выбрать дату',
  dateTimePickerDefaultToolbarTitle: 'Выбрать дату и время',
  timePickerDefaultToolbarTitle: 'Выбрать время',
  dateRangePickerDefaultToolbarTitle: 'Выбрать период',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Выбрать ${timeViews[view]}. ${
      time === null ? 'Время не выбрано' : `Выбрано время ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} часов`,
  minutesClockNumberText: (minutes) => `${minutes} минут`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

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
};

export const ruRU = getPickersLocalization(ruRUPickers);
