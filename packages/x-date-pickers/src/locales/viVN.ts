import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'giờ',
  minutes: 'phút',
  seconds: 'giây',
  meridiem: 'buổi',
};

const viVNPickers: Partial<PickersLocaleText<any>> = {
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

  // Toolbar titles
  datePickerToolbarTitle: 'Chọn ngày',
  dateTimePickerToolbarTitle: 'Chọn ngày và giờ',
  timePickerToolbarTitle: 'Chọn giờ',
  dateRangePickerToolbarTitle: 'Chọn khoảng ngày',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Chọn ${views[view]}. ${time === null ? 'Không có giờ được chọn' : `Giờ được chọn là ${adapter.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} giờ`,
  minutesClockNumberText: (minutes) => `${minutes} phút`,
  secondsClockNumberText: (seconds) => `${seconds} giây`,

  // Digital clock labels
  selectViewText: (view) => `Chọn ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'Số tuần',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `Tuần ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Chọn ngày, ngày đã chọn là ${utils.format(value, 'fullDate')}`
      : 'Chọn ngày',
  openTimePickerDialogue: (value, utils) =>
    value !== null && utils.isValid(value)
      ? `Chọn giờ, giờ đã chọn là ${utils.format(value, 'fullTime')}`
      : 'Chọn giờ',
  fieldClearLabel: 'Xóa giá trị',

  // Table labels
  timeTableLabel: 'chọn giờ',
  dateTableLabel: 'chọn ngày',

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
