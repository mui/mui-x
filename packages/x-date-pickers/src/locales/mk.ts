import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

// This object is not Partial<PickersLocaleText> because it is the default values

const mkPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Предходен месец',
  nextMonth: 'Следен месец',

  // View navigation
  openPreviousView: 'отвори претходен приказ',
  openNextView: 'отвори следен приказ',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'годишен приказ, отвори календарски приказ'
      : 'календарски приказ, отвори годишен приказ',

  // DateRange labels
  start: 'Почеток',
  end: 'Крај',
  // startDate: 'Start date',
  // startTime: 'Start time',
  // endDate: 'End date',
  // endTime: 'End time',

  // Action bar
  cancelButtonLabel: 'Откажи',
  clearButtonLabel: 'Избриши',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Денес',
  nextStepButtonLabel: 'Следен',

  // Toolbar titles
  datePickerToolbarTitle: 'Избери датум',
  dateTimePickerToolbarTitle: 'Избери датум и време',
  timePickerToolbarTitle: 'Избери време',
  dateRangePickerToolbarTitle: 'Избери временски опсег',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Select ${view}. ${!formattedTime ? 'Нема избрано време' : `Избраното време е ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} часа`,
  minutesClockNumberText: (minutes) => `${minutes} минути`,
  secondsClockNumberText: (seconds) => `${seconds} секунди`,

  // Digital clock labels
  selectViewText: (view) => `Избери ${view}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Недела број',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Недела ${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Избери датум, избраниот датум е ${formattedDate}` : 'Избери датум',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Избери време, избраното време е ${formattedTime}` : 'Избери време',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Избриши',

  // Table labels
  timeTableLabel: 'одбери време',
  dateTableLabel: 'одбери датум',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
  fieldDayPlaceholder: () => 'ДД',
  fieldHoursPlaceholder: () => 'чч',
  fieldMinutesPlaceholder: () => 'мм',
  fieldSecondsPlaceholder: () => 'сс',

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

export const mk = getPickersLocalization(mkPickers);
