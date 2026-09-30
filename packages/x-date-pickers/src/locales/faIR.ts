import type { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import type { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'ساعت‌ها',
  minutes: 'دقیقه‌ها',
  seconds: 'ثانیه‌ها',
  meridiem: 'نیم‌روز',
};

const faIRPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'ماه گذشته',
  nextMonth: 'ماه آینده',

  // View navigation
  openPreviousView: 'نمای قبلی',
  openNextView: 'نمای بعدی',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'نمای سال باز است، رفتن به نمای تقویم'
      : 'نمای تقویم باز است، رفتن به نمای سال',

  // DateRange labels
  start: 'شروع',
  end: 'پایان',
  startDate: 'تاریخ شروع',
  startTime: 'زمان شروع',
  endDate: 'تاریخ پایان',
  endTime: 'زمان پایان',

  // Action bar
  cancelButtonLabel: 'لغو',
  clearButtonLabel: 'پاک کردن',
  okButtonLabel: 'تایید',
  todayButtonLabel: 'امروز',
  nextStepButtonLabel: 'آینده',

  // Toolbar titles
  datePickerToolbarTitle: 'تاریخ را انتخاب کنید',
  dateTimePickerToolbarTitle: 'تاریخ و زمان را انتخاب کنید',
  timePickerToolbarTitle: 'زمان را انتخاب کنید',
  dateRangePickerToolbarTitle: 'بازه تاریخی را انتخاب کنید',
  timeRangePickerToolbarTitle: 'بازه زمانی را انتخاب کنید',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `انتخاب ${views[view]}. ${!formattedTime ? 'زمانی انتخاب نشده است' : `زمان انتخاب شده ${formattedTime} است`}`,
  hoursClockNumberText: (hours) => `${hours} ساعت`,
  minutesClockNumberText: (minutes) => `${minutes} دقیقه`,
  secondsClockNumberText: (seconds) => `${seconds} ثانیه`,

  // Digital clock labels
  selectViewText: (view) => `انتخاب ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'شماره هفته',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `هفته ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate
      ? `تاریخ را انتخاب کنید، تاریخ انتخاب شده ${formattedDate} است`
      : 'تاریخ را انتخاب کنید',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime
      ? `زمان را انتخاب کنید، زمان انتخاب شده ${formattedTime} است`
      : 'زمان را انتخاب کنید',
  openRangePickerDialogue: (formattedRange) =>
    formattedRange
      ? `بازه را انتخاب کنید، بازه زمانی انتخاب شده ${formattedRange} است`
      : 'بازه را انتخاب کنید',
  fieldClearLabel: 'پاک کردن',

  // Table labels
  timeTableLabel: 'انتخاب زمان',
  dateTableLabel: 'انتخاب تاریخ',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'سال',
  month: 'ماه',
  day: 'روز',
  weekDay: 'روز هفته',
  hours: 'ساعت‌ها',
  minutes: 'دقیقه‌ها',
  seconds: 'ثانیه‌ها',
  meridiem: 'نیم‌روز',

  // Common
  empty: 'خالی',
};

export const faIR = getPickersLocalization(faIRPickers);
