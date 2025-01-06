import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

// maps TimeView to its translation
const timeViews: Record<TimeViewWithMeridiem, string> = {
  hours: '時間',
  minutes: '分',
  seconds: '秒',
  meridiem: 'メリディム',
};

const jaJPPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: '先月',
  nextMonth: '来月',

  // View navigation
  openPreviousView: '前の表示を開く',
  openNextView: '次の表示を開く',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year'
      ? '年選択表示からカレンダー表示に切り替える'
      : 'カレンダー表示から年選択表示に切り替える',

  // DateRange labels
  start: '開始',
  end: '終了',
  startDate: '開始日',
  startTime: '開始時間',
  endDate: '終了日',
  endTime: '終了時間',

  // Action bar
  cancelButtonLabel: 'キャンセル',
  clearButtonLabel: 'クリア',
  okButtonLabel: '確定',
  todayButtonLabel: '今日',

  // Toolbar titles
  datePickerToolbarTitle: '日付を選択',
  dateTimePickerToolbarTitle: '日時を選択',
  timePickerToolbarTitle: '時間を選択',
  dateRangePickerToolbarTitle: '日付の範囲を選択',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `${timeViews[view] ?? view}を選択してください ${!formattedTime ? '時間が選択されていません' : `選択した時間は ${formattedTime} です`}`,
  hoursClockNumberText: (hours) => `${hours} ${timeViews.hours}`,
  minutesClockNumberText: (minutes) => `${minutes} ${timeViews.minutes}`,
  secondsClockNumberText: (seconds) => `${seconds} ${timeViews.seconds}`,

  // Digital clock labels
  selectViewText: (view) => `を選択 ${timeViews[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: '週番号',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `${weekNumber}週目`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate
      ? `日付を選択してください。選択した日付は ${formattedDate} です`
      : '日付を選択してください',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime
      ? `時間を選択してください。選択した時間は ${formattedTime} です`
      : '時間を選択してください',
  fieldClearLabel: 'クリア',

  // Table labels
  timeTableLabel: '時間を選択',
  dateTableLabel: '日付を選択',

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
  year: '年',
  month: '月',
  day: '日',
  weekDay: '平日',
  hours: '時間',
  minutes: '分',
  seconds: '秒',
  meridiem: 'メリディム',

  // Common
  empty: '空',
};

export const jaJP = getPickersLocalization(jaJPPickers);
