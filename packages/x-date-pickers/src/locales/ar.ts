import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'ساعات',
  minutes: 'دقائق',
  seconds: 'ثواني',
  meridiem: 'ميريديم',
};

const arPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'الشهر السابق',
  nextMonth: 'الشهر المقبل',

  // View navigation
  openPreviousView: 'افتح العرض السابق',
  openNextView: 'افتح العرض التالي',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'عرض السنة مفتوح، قم بالتبديل إلى عرض التقويم'
      : 'عرض التقويم مفتوح، قم بالتبديل إلى عرض السنة',

  // DateRange labels
  start: 'يبدأ',
  end: 'نهاية',
  startDate: 'تاريخ البدء',
  startTime: 'وقت البدء',
  endDate: 'تاريخ الانتهاء',
  endTime: 'وقت الانتهاء',

  // Action bar
  cancelButtonLabel: 'يلغي',
  clearButtonLabel: 'واضح',
  okButtonLabel: 'نعم',
  todayButtonLabel: 'اليوم',

  // Toolbar titles
  datePickerToolbarTitle: 'اختر التاريخ',
  dateTimePickerToolbarTitle: 'حدد التاريخ والوقت',
  timePickerToolbarTitle: 'حدد الوقت',
  dateRangePickerToolbarTitle: 'حدد النطاق الزمني',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `يختار ${views[view]}. ${!formattedTime ? 'لم يتم تحديد الوقت' : `الوقت المختار هو ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} ساعات`,
  minutesClockNumberText: (minutes) => `${minutes} دقائق`,
  secondsClockNumberText: (seconds) => `${seconds} ثواني`,

  // Digital clock labels
  selectViewText: (view) => `يختار ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'رقم الاسبوع',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `أسبوع ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `اختر التاريخ، التاريخ المحدد هو ${formattedDate}` : 'اختر التاريخ',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `اختر الوقت، الوقت المحدد هو ${formattedTime}` : 'اختر الوقت',
  fieldClearLabel: 'واضح',

  // Table labels
  timeTableLabel: 'اختيار الوقت',
  dateTableLabel: 'تاريخ الاختيار',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'س'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
  fieldDayPlaceholder: () => 'اليوم',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'سنة',
  month: 'شهر',
  day: 'يوم',
  weekDay: 'أيام الأسبوع',
  hours: 'ساعات',
  minutes: 'دقائق',
  seconds: 'ثواني',
  meridiem: 'ميريديم',

  // Common
  empty: 'فارغ',
};

export const ar = getPickersLocalization(arPickers);
