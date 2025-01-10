import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: '小時',
  minutes: '分鐘',
  seconds: '秒',
  meridiem: '十二小時制',
};

const zhTWPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: '上個月',
  nextMonth: '下個月',

  // View navigation
  openPreviousView: '前一個視圖',
  openNextView: '下一個視圖',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year' ? '年視圖已打開，切換為日曆視圖' : '日曆視圖已打開，切換為年視圖',

  // DateRange labels
  start: '開始',
  end: '結束',
  startDate: '開始日期',
  startTime: '開始時間',
  endDate: '結束日期',
  endTime: '結束時間',

  // Action bar
  cancelButtonLabel: '取消',
  clearButtonLabel: '清除',
  okButtonLabel: '確認',
  todayButtonLabel: '今天',

  // Toolbar titles
  datePickerToolbarTitle: '選擇日期',
  dateTimePickerToolbarTitle: '選擇日期和時間',
  timePickerToolbarTitle: '選擇時間',
  dateRangePickerToolbarTitle: '選擇時間範圍',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `選擇 ${views[view]}. ${!formattedTime ? '未選擇時間' : `已選擇${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours}小時`,
  minutesClockNumberText: (minutes) => `${minutes}分鐘`,
  secondsClockNumberText: (seconds) => `${seconds}秒`,

  // Digital clock labels
  selectViewText: (view) => `選擇 ${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: '週數',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `第${weekNumber}週`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `選擇日期，已選擇${formattedDate}` : '選擇日期',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `選擇時間，已選擇${formattedTime}` : '選擇時間',
  fieldClearLabel: '清除',

  // Table labels
  timeTableLabel: '選擇時間',
  dateTableLabel: '選擇日期',

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
  year: '年份',
  month: '月份',
  day: '日期',
  weekDay: '星期',
  hours: '時',
  minutes: '分',
  seconds: '秒',
  meridiem: '十二小時制',

  // Common
  empty: '空',
};

export const zhTW = getPickersLocalization(zhTWPickers);
