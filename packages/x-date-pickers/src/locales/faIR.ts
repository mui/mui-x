import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { CalendarPickerView } from '../internals/models';

const faIRPickers: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'ماه گذشته',
  nextMonth: 'ماه آینده',

  // View navigation
  openPreviousView: 'نمای قبلی',
  openNextView: 'نمای بعدی',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year'
      ? 'نمای سال باز است، رفتن به نمای تقویم'
      : 'نمای تقویم باز است، رفتن به نمای سال',
  inputModeToggleButtonAriaLabel: (isKeyboardInputOpen: boolean, viewType: 'calendar' | 'clock') =>
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
  datePickerToolbarTitle: 'تاریخ را انتخاب کنید',
  dateTimePickerToolbarTitle: 'تاریخ و ساعت را انتخاب کنید',
  timePickerToolbarTitle: 'ساعت را انتخاب کنید',
  dateRangePickerToolbarTitle: 'محدوده تاریخ را انتخاب کنید',

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

  // Calendar labels
  // calendarWeekNumberHeaderLabel: 'Week number',
  // calendarWeekNumberHeaderText: '#',
  // calendarWeekNumberAriaLabelText: weekNumber => `Week ${weekNumber}`,
  // calendarWeekNumberText: weekNumber => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `تاریخ را انتخاب کنید، تاریخ انتخاب شده ${utils.format(value, 'fullDate')} می باشد`
      : 'تاریخ را انتخاب کنید',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `ساعت را انتخاب کنید، ساعت انتخاب شده ${utils.format(value, 'fullTime')} می باشد`
      : 'ساعت را انتخاب کنید',

  // Table labels
  timeTableLabel: 'انتخاب تاریخ',
  dateTableLabel: 'انتخاب ساعت',

  // Field section placeholders
  // fieldYearPlaceholder: params => 'Y'.repeat(params.digitAmount),
  // fieldMonthPlaceholder: params => params.contentType === 'letter' ? 'MMMM' : 'MM',
  // fieldDayPlaceholder: () => 'DD',
  // fieldHoursPlaceholder: () => 'hh',
  // fieldMinutesPlaceholder: () => 'mm',
  // fieldSecondsPlaceholder: () => 'ss',
  // fieldMeridiemPlaceholder: () => 'aa',
};

export const faIR = getPickersLocalization(faIRPickers);
