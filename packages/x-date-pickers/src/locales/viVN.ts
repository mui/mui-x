import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';
import { DEFAULT_FIELD_PLACEHOLDERS } from './utils/defaultLocaleHelpers';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'giờ',
  minutes: 'phút',
  seconds: 'giây',
  meridiem: 'buổi',
};

const viVNPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'Tháng trước',
  nextMonth: 'Tháng sau',

  // View navigation
  openPreviousView: 'Mở xem trước',
  openNextView: 'Mở xem sau',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? 'đang mở xem năm, chuyển sang xem lịch'
      : 'đang mở xem lịch, chuyển sang xem năm',

  // DateRange labels
  start: 'Bắt đầu',
  end: 'Kết thúc',
  startDate: 'Ngày bắt đầu',
  startTime: 'Thời gian bắt đầu',
  endDate: 'Ngày kết thúc',
  endTime: 'Thời gian kết thúc',

  // Action bar
  cancelButtonLabel: 'Hủy',
  clearButtonLabel: 'Xóa',
  okButtonLabel: 'OK',
  todayButtonLabel: 'Hôm nay',
  nextStepButtonLabel: 'Sau',

  // Toolbar titles
  datePickerToolbarTitle: 'Chọn ngày',
  dateTimePickerToolbarTitle: 'Chọn ngày và giờ',
  timePickerToolbarTitle: 'Chọn giờ',
  dateRangePickerToolbarTitle: 'Chọn khoảng ngày',
  // timeRangePickerToolbarTitle: 'Select time range',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `Chọn ${views[view]}. ${!formattedTime ? 'Không có giờ được chọn' : `Giờ được chọn là ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} giờ`,
  minutesClockNumberText: (minutes) => `${minutes} phút`,
  secondsClockNumberText: (seconds) => `${seconds} giây`,

  // Digital clock labels
  selectViewText: (view) => `Chọn ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Số tuần',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Tuần ${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `Chọn ngày, ngày đã chọn là ${formattedDate}` : 'Chọn ngày',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `Chọn giờ, giờ đã chọn là ${formattedTime}` : 'Chọn giờ',
  // openRangePickerDialogue: formattedRange => formattedRange ? `Choose range, selected range is ${formattedRange}` : 'Choose range',
  fieldClearLabel: 'Xóa giá trị',

  // Table labels
  timeTableLabel: 'chọn giờ',
  dateTableLabel: 'chọn ngày',

  // Field section placeholders
  ...DEFAULT_FIELD_PLACEHOLDERS,
  fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),

  // View names
  year: 'Năm',
  month: 'Tháng',
  day: 'Ngày',
  weekDay: 'Thứ',
  hours: 'Giờ',
  minutes: 'Phút',
  seconds: 'Giây',
  meridiem: 'Buổi',

  // Common
  empty: 'Trống',
};

export const viVN = getPickersLocalization(viVNPickers);
