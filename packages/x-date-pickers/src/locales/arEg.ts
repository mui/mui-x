import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

// This object is not Partial<PickersLocaleText> because it is the default values

const arEGPickers: PickersLocaleText<any> = {
  // Calendar navigation
  previousMonth: 'الشهر السابق',
  nextMonth: 'الشهر التالي',

  // View navigation
  openPreviousView: 'افتح الشاشة السابقة',
  openNextView: 'افتح الشاشة التالية',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'شاشة السنوات مفتوحة، قم بالتبديل إلى شاشة التقويم'
      : 'شاشة التقويم مفتوحة، قم بالتبديل إلى شاشة  السنوات',

  // DateRange labels
  start: 'بداية',
  end: 'نهاية',
  startDate: 'بداية التاريخ',
  startTime: 'بداية التوقيت',
  endDate: 'نهاية التاريخ',
  endTime: 'نهاية التوقيت',

  // Action bar
  cancelButtonLabel: 'إلغاء',
  clearButtonLabel: 'مسح',
  okButtonLabel: 'موافق',
  todayButtonLabel: 'اليوم',

  // Toolbar titles
 datePickerToolbarTitle: 'اختر التاريخ',
  dateTimePickerToolbarTitle: 'اختر التاريخ والوقت',
  timePickerToolbarTitle: 'اختر الوقت',
  dateRangePickerToolbarTitle: 'اختر نطاق التاريخ',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `اختر ${view}. ${
      time === null ? 'لم يتم تحديد الوقت' : `الوقت المحدد هو ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `الساعات ${hours}`,
  minutesClockNumberText: (minutes) => `الدقائق ${minutes}`,
  secondsClockNumberText: (seconds) => `الثواني ${seconds}`,

  // Digital clock labels
  selectViewText: (view) => `اختر ${view}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'رقم الأسبوع',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `الأسبوع ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `اختر التاريخ، التاريخ المحدد هو ${utils.format(value, 'fullDate')}`
      : 'اختر التاريخ',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `اختر الوقت، التاريخ المحدد هو ${utils.format(value, 'fullTime')}`
      : 'اختر الوقت',

  fieldClearLabel: 'مسح القيمة',

  // Table labels
 timeTableLabel: 'اختر الوقت',
  dateTableLabel: 'اختر التاريخ',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'س'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'شهر كامل' : 'ش'),
  fieldDayPlaceholder: () => 'يوم',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'اليوم الكامل' : 'ي'),
  fieldHoursPlaceholder: () => 'س',
  fieldMinutesPlaceholder: () => 'د',
  fieldSecondsPlaceholder: () => 'ث',
  fieldMeridiemPlaceholder: () => 'ص/م',

  // View names
  year: 'سنة',
  month: 'شهر',
  day: 'يوم',
  weekDay: 'يوم الأسبوع',
  hours: 'ساعات',
  minutes: 'دقائق',
  seconds: 'ثواني',
  meridiem: 'صباح/مساء',

  // Common
  empty: 'فارغ',
};

export const arEG = getPickersLocalization(arEGPickers);
