import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { DateView } from '../internals/models';

const beBYPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Папярэдні месяц',
  nextMonth: 'Наступны месяц',

  // View navigation
  openPreviousView: 'адкрыць папярэдні выгляд',
  openNextView: 'адкрыць наступны выгляд',
  calendarViewSwitchingButtonAriaLabel: (view: DateView) =>
    view === 'year'
      ? 'гадавы выгляд адкрыты, перайсці да каляндарнага выгляду'
      : 'каляндарны выгляд адкрыты, перайсці да гадавога выгляду',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `тэкставае поле адкрыта, перайсці да  ${viewType} выгляду`
      : `${viewType} выгляд зараз адкрыты, перайсці да тэкставага поля`,

  // DateRange placeholders
  start: 'Пачатак',
  end: 'Канец',

  // Action bar
  cancelButtonLabel: 'Адмена',
  clearButtonLabel: 'Ачысціць',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Сёння',

  // Toolbar titles
  datePickerToolbarTitle: 'Абраць дату',
  dateTimePickerToolbarTitle: 'Абраць дату і час',
  timePickerToolbarTitle: 'Абраць час',
  dateRangePickerToolbarTitle: 'Абраць каляндарны перыяд',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null ? 'Час не абраны' : `Абраны час ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} гадзін`,
  minutesClockNumberText: (minutes) => `${minutes} хвілін`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Нумар тыдня',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Тыдзень ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

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

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',
};

export const beBY = getPickersLocalization(beBYPickers);
