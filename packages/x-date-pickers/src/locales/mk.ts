import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

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

  // Toolbar titles
  datePickerToolbarTitle: 'Избери датум',
  dateTimePickerToolbarTitle: 'Избери датум и време',
  timePickerToolbarTitle: 'Избери време',
  dateRangePickerToolbarTitle: 'Избери временски опсег',

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
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Недела ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Избери датум, избраниот датум е ${formattedDate}` : 'Избери датум',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Избери време, избраното време е ${formattedTime}` : 'Избери време',
  fieldClearLabel: 'Избриши',

  // Table labels
  timeTableLabel: 'одбери време',
  dateTableLabel: 'одбери датум',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'ДД',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'чч',
  fieldMinutesPlaceholder: () => 'мм',
  fieldSecondsPlaceholder: () => 'сс',
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

export const mk = getPickersLocalization(mkPickers);
