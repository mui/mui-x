import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'שעות',
  minutes: 'דקות',
  seconds: 'שניות',
  meridiem: 'מרידיאם',
};

const heILPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'חודש קודם',
  nextMonth: 'חודש הבא',

  // View navigation
  openPreviousView: 'תצוגה קודמת',
  openNextView: 'תצוגה הבאה',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'תצוגת שנה פתוחה, מעבר לתצוגת לוח שנה'
      : 'תצוגת לוח שנה פתוחה, מעבר לתצוגת שנה',

  // DateRange labels
  start: 'תחילה',
  end: 'סיום',
  startDate: 'תאריך תחילה',
  startTime: 'שעת תחילה',
  endDate: 'תאריך סיום',
  endTime: 'שעת סיום',

  // Action bar
  cancelButtonLabel: 'ביטול',
  clearButtonLabel: 'ניקוי',
  okButtonLabel: 'אישור',
  todayButtonLabel: 'היום',

  // Toolbar titles
  datePickerToolbarTitle: 'בחירת תאריך',
  dateTimePickerToolbarTitle: 'בחירת תאריך ושעה',
  timePickerToolbarTitle: 'בחירת שעה',
  dateRangePickerToolbarTitle: 'בחירת טווח תאריכים',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `בחירת ${views[view]}. ${!formattedTime ? 'לא נבחרה שעה' : `השעה הנבחרת היא ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} שעות`,
  minutesClockNumberText: (minutes) => `${minutes} דקות`,
  secondsClockNumberText: (seconds) => `${seconds} שניות`,

  // Digital clock labels
  selectViewText: (view) => `בחירת ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'שבוע מספר',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `שבוע ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `בחירת תאריך, התאריך שנבחר הוא ${formattedDate}` : 'בחירת תאריך',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `בחירת שעה, השעה שנבחרה היא ${formattedTime}` : 'בחירת שעה',
  fieldClearLabel: 'נקה ערך',

  // Table labels
  timeTableLabel: 'בחירת שעה',
  dateTableLabel: 'בחירת תאריך',

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
  year: 'שנה',
  month: 'חודש',
  day: 'יום',
  weekDay: 'יום בשבוע',
  hours: 'שעות',
  minutes: 'דקות',
  seconds: 'שניות',
  meridiem: 'יחידת זמן',

  // Common
  empty: 'ריק',
};

export const heIL = getPickersLocalization(heILPickers);
