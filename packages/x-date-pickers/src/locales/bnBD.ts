import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'ঘণ্টা',
  minutes: 'মিনিট',
  seconds: 'সেকেন্ড',
  meridiem: 'এএম/পিএম',
};

const bnBDPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'আগের মাস',
  nextMonth: 'পরের মাস',

  // View navigation
  openPreviousView: 'আগের ভিউ খুলুন',
  openNextView: 'পরের ভিউ খুলুন',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'বছরের ভিউ খোলা আছে, ক্যালেন্ডার ভিউতে পরিবর্তন করুন'
      : 'ক্যালেন্ডার ভিউ খোলা আছে, বছরের ভিউতে পরিবর্তন করুন',

  // DateRange labels
  start: 'শুরু',
  end: 'শেষ',
  startDate: 'শুরুর তারিখ',
  startTime: 'শুরুর সময়',
  endDate: 'শেষের তারিখ',
  endTime: 'শেষের সময়',

  // Action bar
  cancelButtonLabel: 'বাতিল',
  clearButtonLabel: 'পরিষ্কার',
  okButtonLabel: 'ঠিক আছে',
  todayButtonLabel: 'আজ',

  // Toolbar titles
  datePickerToolbarTitle: 'তারিখ নির্বাচন করুন',
  dateTimePickerToolbarTitle: 'তারিখ ও সময় নির্বাচন করুন',
  timePickerToolbarTitle: 'সময় নির্বাচন করুন',
  dateRangePickerToolbarTitle: 'তারিখের পরিসীমা নির্বাচন করুন',

  // Clock labels
  clockLabelText: (view, time, utils, formattedTime) =>
    `নির্বাচন করুন ${views[view]}. ${!formattedTime && (time === null || !utils.isValid(time)) ? 'কোনও সময় নির্বাচন করা হয়নি' : `নির্বাচিত সময় ${formattedTime ?? utils.format(time, 'fullTime')}}`}`,
  hoursClockNumberText: (hours) => `${hours} ঘণ্টা`,
  minutesClockNumberText: (minutes) => `${minutes} মিনিট`,
  secondsClockNumberText: (seconds) => `${seconds} সেকেন্ড`,

  // Digital clock labels
  selectViewText: (view) => `${views[view]} নির্বাচন করুন`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'সপ্তাহ সংখ্যা',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `সপ্তাহ ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils, formattedDate) =>
    formattedDate || (value !== null && utils.isValid(value))
      ? `তারিখ নির্বাচন করুন, নির্বাচিত তারিখ ${formattedDate ?? utils.format(value, 'fullDate')}`
      : 'তারিখ নির্বাচন করুন',
  openTimePickerDialogue: (value, utils, formattedTime) =>
    formattedTime || (value !== null && utils.isValid(value))
      ? `সময় নির্বাচন করুন, নির্বাচিত সময় ${formattedTime ?? utils.format(value, 'fullTime')}`
      : 'সময় নির্বাচন করুন',
  fieldClearLabel: 'পরিষ্কার',

  // Table labels
  timeTableLabel: 'সময় নির্বাচন করুন',
  dateTableLabel: 'তারিখ নির্বাচন করুন',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'ব'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'DD',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'ঘন্টা',
  fieldMinutesPlaceholder: () => 'মিনিট',
  fieldSecondsPlaceholder: () => 'সেকেন্ড',
  fieldMeridiemPlaceholder: () => 'এএম/পিএম',

  // View names
  year: 'বছর',
  month: 'মাস',
  day: 'দিন',
  weekDay: 'সপ্তাহের দিন',
  hours: 'ঘণ্টা',
  minutes: 'মিনিট',
  seconds: 'সেকেন্ড',
  meridiem: 'এএম/পিএম',

  // Common
  empty: 'ফাঁকা',
};

export const bnBD = getPickersLocalization(bnBDPickers);
