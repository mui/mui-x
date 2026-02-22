import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

const views: Record<TimeViewWithMeridiem, string> = {
  // maps TimeView to its translation
  hours: 'гадзіны',
  minutes: 'хвіліны',
  seconds: 'секунды',
  meridiem: 'мерыдыем',
};

const beBYPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Папярэдні месяц',
  nextMonth: 'Наступны месяц',

  // View navigation
  openPreviousView: 'Aдкрыць папярэдні выгляд',
  openNextView: 'Aдкрыць наступны выгляд',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'гадавы выгляд адкрыты, перайсці да каляндарнага выгляду'
      : 'каляндарны выгляд адкрыты, перайсці да гадавога выгляду',

  // DateRange labels
  start: 'Пачатак',
  end: 'Канец',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Адмена',
  clearButtonLabel: 'Ачысціць',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Сёння',
  nextStepButtonLabel: 'Наступны',

  // Toolbar titles
  datePickerToolbarTitle: 'Абраць дату',
  dateTimePickerToolbarTitle: 'Абраць дату і час',
  timePickerToolbarTitle: 'Абраць час',
  dateRangePickerToolbarTitle: 'Абраць каляндарны перыяд',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Абярыце ${views[view]}. ${!formattedTime ? 'Час не абраны' : `Абраны час ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} гадзін`,
  minutesClockNumberText: (minutes) => `${minutes} хвілін`,
  secondsClockNumberText: (seconds) => `${seconds} секунд`,

  // Digital clock labels
  selectViewText: (view) => `Абярыце ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Нумар тыдня',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Тыдзень ${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Абраць дату, абрана дата  ${formattedDate}` : 'Абраць дату',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Абраць час, абрыны час  ${formattedTime}` : 'Абраць час',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  // fieldClearLabel: 'Clear',

  // Table labels
  timeTableLabel: 'абраць час',
  dateTableLabel: 'абраць дату',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',

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

export const beBY = getPickersLocalization(beBYPickers);
