import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'ساعت‌ها',
  minutes: 'دقیقه‌ها',
  seconds: 'ثانیه‌ها',
  meridiem: 'بعد از ظهر',
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
  startTime: 'ساعت شروع',
  endDate: 'تاریخ پایان',
  endTime: 'ساعت پایان',

  // Action bar
  cancelButtonLabel: 'لغو',
  clearButtonLabel: 'پاک کردن',
  okButtonLabel: 'اوکی',
  todayButtonLabel: 'امروز',

  // Toolbar titles
  datePickerToolbarTitle: 'تاریخ را انتخاب کنید',
  dateTimePickerToolbarTitle: 'تاریخ و ساعت را انتخاب کنید',
  timePickerToolbarTitle: 'ساعت را انتخاب کنید',
  dateRangePickerToolbarTitle: 'محدوده تاریخ را انتخاب کنید',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    ` را انتخاب کنید ${timeViews[view]}. ${!formattedTime ? 'هیچ ساعتی انتخاب نشده است' : `ساعت انتخاب ${formattedTime} می باشد`}`,
  hoursClockNumberText: (hours) => `${hours} ساعت‌ها`,
  minutesClockNumberText: (minutes) => `${minutes} دقیقه‌ها`,
  secondsClockNumberText: (seconds) => `${seconds} ثانیه‌ها`,

  // Digital clock labels
  selectViewText: (view) => ` را انتخاب کنید ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'عدد هفته',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `هفته ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate
      ? `تاریخ را انتخاب کنید، تاریخ انتخاب شده ${formattedDate} می‌باشد`
      : 'تاریخ را انتخاب کنید',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime
      ? `ساعت را انتخاب کنید، ساعت انتخاب شده ${formattedTime} می‌باشد`
      : 'ساعت را انتخاب کنید',
  fieldClearLabel: 'پاک کردن مقدار',

  // Table labels
  timeTableLabel: 'انتخاب تاریخ',
  dateTableLabel: 'انتخاب ساعت',

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
