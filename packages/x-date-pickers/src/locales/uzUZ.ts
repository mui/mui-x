import type { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import type { TimeViewWithMeridiem } from '../internals/models';

// Accusative forms, used as the object of "tanlang" (select)
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: 'soatni',
  minutes: 'daqiqani',
  seconds: 'soniyani',
  meridiem: 'kun qismini',
};

const uzUZPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Oldingi oy',
  nextMonth: 'Keyingi oy',

  // View navigation
  openPreviousView: 'Oldingi koʻrinishni ochish',
  openNextView: 'Keyingi koʻrinishni ochish',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'yillar koʻrinishi ochiq, taqvim koʻrinishiga oʻtish'
      : 'taqvim koʻrinishi ochiq, yillar koʻrinishiga oʻtish',

  // DateRange labels
  start: 'Boshlanishi',
  end: 'Tugashi',
  startDate: 'Boshlanish sanasi',
  startTime: 'Boshlanish vaqti',
  endDate: 'Tugash sanasi',
  endTime: 'Tugash vaqti',

  // Action bar
  cancelButtonLabel: 'Bekor qilish',
  clearButtonLabel: 'Tozalash',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Bugun',
  nextStepButtonLabel: 'Keyingi',

  // Toolbar titles
  datePickerToolbarTitle: 'Sanani tanlang',
  dateTimePickerToolbarTitle: 'Sana va vaqtni tanlang',
  timePickerToolbarTitle: 'Vaqtni tanlang',
  dateRangePickerToolbarTitle: 'Sanalar oraligʻini tanlang',
  timeRangePickerToolbarTitle: 'Vaqt oraligʻini tanlang',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view]} tanlang. ${!formattedTime ? 'Vaqt tanlanmagan' : `Tanlangan vaqt: ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} soat`,
  minutesClockNumberText: (minutes) => `${minutes} daqiqa`,
  secondsClockNumberText: (seconds) => `${seconds} soniya`,

  // Digital clock labels
  selectViewText: (view) => `${timeViews[view]} tanlang`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Hafta raqami',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber}-hafta`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Sanani tanlang, tanlangan sana: ${formattedDate}` : 'Sanani tanlang',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Vaqtni tanlang, tanlangan vaqt: ${formattedTime}` : 'Vaqtni tanlang',
  openRangePickerDialogue: (formattedRange) =>
    formattedRange ? `Oraliqni tanlang, tanlangan oraliq: ${formattedRange}` : 'Oraliqni tanlang',
  fieldClearLabel: 'Tozalash',

  // Table labels
  timeTableLabel: 'vaqtni tanlang',
  dateTableLabel: 'sanani tanlang',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'OOOO' : 'OO'),
  fieldDayPlaceholder: () => 'KK',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'HHHH' : 'HH'),
  fieldHoursPlaceholder: () => 'hh',
  fieldMinutesPlaceholder: () => 'mm',
  fieldSecondsPlaceholder: () => 'ss',
  fieldMeridiemPlaceholder: () => 'aa',

  // View names
  year: 'Yil',
  month: 'Oy',
  day: 'Kun',
  weekDay: 'Hafta kuni',
  hours: 'Soat',
  minutes: 'Daqiqa',
  seconds: 'Soniya',
  meridiem: 'Kun qismi',

  // Common
  empty: 'Boʻsh',
};

export const uzUZ = getPickersLocalization(uzUZPickers);
