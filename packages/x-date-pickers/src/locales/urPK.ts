import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const urPKPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'پچھلا مہینہ',
  nextMonth: 'اگلا مہینہ',

  // View navigation
  openPreviousView: 'پچھلا ویو کھولیں',
  openNextView: 'اگلا ویو کھولیں',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'سال والا ویو کھلا ہے۔ کیلنڈر والا ویو کھولیں'
      : 'کیلنڈر والا ویو کھلا ہے۔ سال والا ویو کھولیں',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `،ٹیکسٹ ویو کھلا ہے ${viewType} ویو کھولیں`
      : `${viewType} ویو کھلا ہے، ٹیکسٹ ویو کھولیں`,

  // DateRange placeholders
  start: 'شروع',
  end: 'ختم',

  // Action bar
  cancelButtonLabel: 'کینسل',
  clearButtonLabel: 'کلئیر',
  okButtonLabel: 'اوکے',
  todayButtonLabel: 'آج',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'تاریخ منتخب کریں',
  dateTimePickerDefaultToolbarTitle: 'تاریخ اور وقت منتخب کریں',
  timePickerDefaultToolbarTitle: 'وقت منتخب کریں',
  dateRangePickerDefaultToolbarTitle: 'تاریخوں کی رینج منتخب کریں',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `${view} منتخب کریں ${
      time === null ? 'کوئی وقت منتخب نہیں' : `منتخب وقت ہے ${adapter.format(time, 'fullTime')}`
    }`,
  hoursClockNumberText: (hours) => `${hours} گھنٹے`,
  minutesClockNumberText: (minutes) => `${minutes} منٹ`,
  secondsClockNumberText: (seconds) => `${seconds} سیکنڈ`,

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
};

export const urPK = getPickersLocalization(urPKPickers);
