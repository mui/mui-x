import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';

const faIRPickers: PickersLocaleText<any> = {
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
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen, viewType) =>
    isKeyboardInputOpen
      ? `نمای ورودی متن باز است، رفتن به نمای ${viewType}`
      : `نمای ${viewType} باز است، رفتن به نمای ورودی متن`,

  // DateRange placeholders
  start: 'شروع',
  end: 'پایان',

  // Action bar
  cancelButtonLabel: 'لغو',
  clearButtonLabel: 'پاک کردن',
  okButtonLabel: 'اوکی',
  todayButtonLabel: 'امروز',

  // Toolbar titles
  datePickerDefaultToolbarTitle: 'تاریخ را انتخاب کنید',
  dateTimePickerDefaultToolbarTitle: 'تاریخ و ساعت را انتخاب کنید',
  timePickerDefaultToolbarTitle: 'ساعت را انتخاب کنید',
  dateRangePickerDefaultToolbarTitle: 'محدوده تاریخ را انتخاب کنید',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Select ${view}. ${
      time === null
        ? 'هیچ ساعتی انتخاب نشده است'
        : `ساعت انتخاب ${adapter.format(time, 'fullTime')} می باشد`
    }`,
  hoursClockNumberText: (hours) => `${hours} ساعت ها`,
  minutesClockNumberText: (minutes) => `${minutes} دقیقه ها`,
  secondsClockNumberText: (seconds) => `${seconds} ثانیه ها`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `تاریخ را انتخاب کنید، تاریخ انتخاب شده ${utils.format(
          utils.date(rawValue)!,
          'fullDate',
        )} می باشد`
      : 'تاریخ را انتخاب کنید',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `ساعت را انتخاب کنید، ساعت انتخاب شده ${utils.format(
          utils.date(rawValue)!,
          'fullTime',
        )} می باشد`
      : 'ساعت را انتخاب کنید',

  // Table labels
  timeTableLabel: 'انتخاب تاریخ',
  dateTableLabel: 'انتخاب ساعت',
};

export const faIR = getPickersLocalization(faIRPickers);
