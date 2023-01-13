import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const urPKPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'پچھلا مہینہ',
  nextMonth: 'اگلا مہینہ',

  // View navigation
  openPreviousView: 'پچھلا ویو کھولیں',
  openNextView: 'اگلا ویو کھولیں',
  // calendarViewSwitchingButtonAriaLabel: (view: DateView) => view === 'year' ? 'year view is open, switch to calendar view' : 'calendar view is open, switch to year view',

  // DateRange placeholders
  start: 'شروع',
  end: 'ختم',

  // Action bar
  cancelButtonLabel: 'کینسل',
  clearButtonLabel: 'کلئیر',
  okButtonLabel: 'اوکے',
  todayButtonLabel: 'آج',

  // Toolbar titles
  datePickerToolbarTitle: 'تاریخ منتخب کریں',
  dateTimePickerToolbarTitle: 'تاریخ اور وقت منتخب کریں',
  timePickerToolbarTitle: 'وقت منتخب کریں',
  dateRangePickerToolbarTitle: 'تاریخوں کی رینج منتخب کریں',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${view} منتخب کریں ${
      time === null ? 'کوئی وقت منتخب نہیں' : `منتخب وقت ہے ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} گھنٹے`,
  minutesClockNumberText: (minutes) => `${minutes} منٹ`,
  secondsClockNumberText: (seconds) => `${seconds} سیکنڈ`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'ہفتہ نمبر',
  calendarWeekNumberHeaderText: 'نمبر',
  calendarWeekNumberAriaLabelText: (weekNumber) => `ہفتہ ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `تاریخ منتخب کریں، منتخب شدہ تاریخ ہے ${utils.format(value, 'fullDate')}`
      : 'تاریخ منتخب کریں',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `وقت منتخب کریں، منتخب شدہ وقت ہے ${utils.format(value, 'fullTime')}`
      : 'وقت منتخب کریں',

  // Table labels
  timeTableLabel: 'وقت منتخب کریں',
  dateTableLabel: 'تاریخ منتخب کریں',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const urPK = getPickersLocalization(urPKPickers);
