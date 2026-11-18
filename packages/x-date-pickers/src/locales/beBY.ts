import type { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import type { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  // maps TimeView to its translation
  hours: 'гадзіны',
  minutes: 'хвіліны',
  seconds: 'секунды',
  meridiem: 'мерыдыем',
};

// Belarusian has 3 count-based forms, selected by the last digit(s) of the count
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
  hoursClockNumberText: (hours) =>
    `${hours} ${getPluralForm(Number(hours), 'гадзіна', 'гадзіны', 'гадзін')}`,
  minutesClockNumberText: (minutes) =>
    `${minutes} ${getPluralForm(Number(minutes), 'хвіліна', 'хвіліны', 'хвілін')}`,
  secondsClockNumberText: (seconds) =>
    `${seconds} ${getPluralForm(Number(seconds), 'секунда', 'секунды', 'секунд')}`,

  // Digital clock labels
  selectViewText: (view) => `Абярыце ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Нумар тыдня',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Тыдзень ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

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
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  // fieldWeekDayPlaceholder: params => params.contentType === 'letter' ? 'EEEE' : 'EE',
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

export const beBY = getPickersLocalization(beBYPickers);
