import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const views = {
  // maps TimeView to its translation
  hours: 'гадзіны',
  minutes: 'хвіліны',
  seconds: 'секунды',
  // maps PickersToolbar["viewType"] to its translation
  date: 'календара',
  time: 'часу',
};

const beBYPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Папярэдні месяц',
  nextMonth: 'Наступны месяц',

  // View navigation
  openPreviousView: 'адкрыць папярэдні выгляд',
  openNextView: 'адкрыць наступны выгляд',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'гадавы выгляд адкрыты, перайсці да каляндарнага выгляду'
      : 'каляндарны выгляд адкрыты, перайсці да гадавога выгляду',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `тэкставае поле адкрыта, перайсці да выгляду ${views[viewType]}`
      : `Выгляд ${views[viewType]} зараз адкрыты, перайсці да тэкставага поля`,

  // DateRange placeholders
  start: 'Пачатак',
  end: 'Канец',

  // Action bar
  cancelButtonLabel: 'Адмена',
  clearButtonLabel: 'Ачысціць',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Сёння',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'Абраць дату',
  dateTimePickerDefaultToolbarTitle: 'Абраць дату і час',
  timePickerDefaultToolbarTitle: 'Абраць час',
  dateRangePickerDefaultToolbarTitle: 'Абраць каляндарны перыяд',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Абярыце ${views[view]}. ${
      time === null ? 'Час не абраны' : `Абраны час ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} гадзін`,
  minutesClockNumberText: (minutes) => `${minutes} хвілін`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Абраць дату, абрана дата  ${utils.format(value, 'fullDate')}`
      : 'Абраць дату',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Абраць час, абрыны час  ${utils.format(value, 'fullTime')}`
      : 'Абраць час',

  // Table labels
  timeTableLabel: 'абраць час',
  dateTableLabel: 'абраць дату',
};

export const beBY = getPickersLocalization(beBYPickers);
