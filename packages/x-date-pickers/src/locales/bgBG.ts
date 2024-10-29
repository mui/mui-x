import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'часове',
  minutes: 'минути',
  seconds: 'секунди',
  meridiem: 'преди обяд/след обяд',
};

const bgBGPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Предишен месец',
  nextMonth: 'Следващ месец',

  // View navigation
  openPreviousView: 'Отвори предишен изглед',
  openNextView: 'Отвори следващ изглед',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'отворен е изглед на година, премини на изглед на календар'
      : 'отворен е изглед на календар, премини на изглед на година',

  // DateRange labels
  start: 'Начало',
  end: 'Край',
  startDate: 'Начална дата',
  startTime: 'Начален час',
  endDate: 'Крайна дата',
  endTime: 'Краен час',

  // Action bar
  cancelButtonLabel: 'Отказ',
  clearButtonLabel: 'Изчисти',
  okButtonLabel: 'ОК',
  todayButtonLabel: 'Днес',

  // Toolbar titles
  datePickerToolbarTitle: 'Избери дата',
  dateTimePickerToolbarTitle: 'Избери дата и час',
  timePickerToolbarTitle: 'Избери час',
  dateRangePickerToolbarTitle: 'Избери времеви период',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Избери ${views[view]}. ${!formattedTime ? 'Не е избран час' : `Избраният час е ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} часа`,
  minutesClockNumberText: (minutes) => `${minutes} минути`,
  secondsClockNumberText: (seconds) => `${seconds} секунди`,

  // Digital clock labels
  selectViewText: (view) => `Избери ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Седмица',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Седмица ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Избери дата, избраната дата е ${formattedDate}` : 'Избери дата',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Избери час, избраният час е ${formattedTime}` : 'Избери час',
  fieldClearLabel: 'Изчисти стойност',

  // Table labels
  timeTableLabel: 'избери час',
  dateTableLabel: 'избери дата',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'ММММ' : 'ММ'),
  fieldDayPlaceholder: () => 'ДД',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'СССС' : 'СС'),
  fieldHoursPlaceholder: () => 'чч',
  fieldMinutesPlaceholder: () => 'мм',
  fieldSecondsPlaceholder: () => 'сс',
  fieldMeridiemPlaceholder: () => 'пс',

  // View names
  year: 'Година',
  month: 'Месец',
  day: 'Ден',
  weekDay: 'Ден от седмицата',
  hours: 'Часове',
  minutes: 'Минути',
  seconds: 'Секунди',
  meridiem: 'Преди обяд/след обяд',

  // Common
  empty: 'Празно',
};

export const bgBG = getPickersLocalization(bgBGPickers);
